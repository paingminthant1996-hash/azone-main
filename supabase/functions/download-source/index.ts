// supabase/functions/download-source/index.ts
// Supabase Edge Function: download-source
// Deploy via supabase CLI or dashboard
// Env expected: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
// Generates a signed URL for a private object in 'template-sources' bucket after verifying purchase.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const STORAGE_BUCKET = "template-sources";
const SIGN_URL_EXPIRE_SECONDS = 120;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables");
  // We still start the server, but all requests will return 500
}

interface RpcResponseBool {
  // Supabase REST returns array for scalar returns
  // e.g. [true] or [false]
  [index: number]: boolean;
}

interface TemplateVersionRow {
  source_path?: string | null;
}

async function callRpcUserHasAccess(versionId: string, userJwt: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  const rpcUrl = `${SUPABASE_URL}/rest/v1/rpc/user_has_access_to_version`;
  // The param name used in SQL function is p_version_id; REST RPC expects JSON body with parameter name
  const body = { p_version_id: versionId };
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${userJwt}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    // Could be 401 or RPC not found or other error
    const text = await res.text().catch(() => "");
    console.error("RPC call failed:", res.status, text);
    return false;
  }
  const json: RpcResponseBool = await res.json().catch(() => []);
  if (Array.isArray(json) && json.length > 0) {
    return Boolean(json[0]);
  }
  return false;
}

async function getVersionSourcePath(versionId: string): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const url = `${SUPABASE_URL}/rest/v1/template_versions?id=eq.${encodeURIComponent(versionId)}&select=source_path`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`, // using anon for read; RLS might allow via user token, but source_path is OK to fetch server-side
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Failed to fetch version:", res.status, txt);
    return null;
  }
  const json = await res.json().catch(() => null);
  if (Array.isArray(json) && json.length > 0) {
    const row = json[0] as TemplateVersionRow;
    return row.source_path ?? null;
  }
  return null;
}

async function createSignedUrl(bucketId: string, objectKey: string, expiresInSec = SIGN_URL_EXPIRE_SECONDS) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const url = `${SUPABASE_URL}/storage/v1/object/sign/${encodeURIComponent(bucketId)}/${encodeURIComponent(objectKey)}?expiry=${expiresInSec}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Failed createSignedUrl:", res.status, text);
    return null;
  }
  const json = await res.json().catch(() => null);
  return json; // expects { signedURL: "...", expiresIn: ... } or similar
}

Deno.serve(async (req: Request) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "server_env_missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Accept GET ?version_id=... or POST JSON { version_id }
    const url = new URL(req.url);
    let versionId = url.searchParams.get("version_id") ?? null;

    if (req.method === "POST") {
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        const body = await req.json().catch(() => ({}));
        versionId = body?.version_id ?? versionId;
      }
    }

    if (!versionId) {
      return new Response(JSON.stringify({ error: "version_id_required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Authorization header must contain user JWT so RPC user_has_access_to_version resolves auth.uid()
    const authHeader = req.headers.get("authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "missing_authorization" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const userJwt = authHeader.split(" ")[1];

    // 1) Check access via RPC (uses user's JWT)
    const hasAccess = await callRpcUserHasAccess(versionId, userJwt);
    if (!hasAccess) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    // 2) Lookup source_path for version
    const sourcePath = await getVersionSourcePath(versionId);
    if (!sourcePath) {
      return new Response(JSON.stringify({ error: "source_not_found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    // 3) Create signed URL using service role
    const signed = await createSignedUrl(STORAGE_BUCKET, sourcePath, SIGN_URL_EXPIRE_SECONDS);
    if (!signed) {
      return new Response(JSON.stringify({ error: "signed_url_failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    // Normalize signed url field
    const signedUrl = (signed as any).signedURL ?? (signed as any).signed_url ?? (signed as any).signedUrl ?? signed;

    return new Response(JSON.stringify({ url: signedUrl, expires_in: SIGN_URL_EXPIRE_SECONDS }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("download-source error:", err);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

