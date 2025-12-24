// app/api/download/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STORAGE_BUCKET = "template-sources";
const SIGN_URL_EXPIRE_SECONDS = 120;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE env in Next.js server route");
}

// utility: call RPC user_has_access_to_version with user's JWT
async function rpcUserHasAccess(versionId: string, userJwt: string): Promise<boolean> {
  const rpcUrl = `${SUPABASE_URL}/rest/v1/rpc/user_has_access_to_version`;
  const body = { p_version_id: versionId };
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY ?? "",
      "Authorization": `Bearer ${userJwt}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("RPC user_has_access failed:", res.status, text);
    return false;
  }
  const json = await res.json().catch(() => []);
  if (Array.isArray(json) && json.length > 0) return Boolean(json[0]);
  return false;
}

// utility: get source_path of version
async function getSourcePath(versionId: string): Promise<string | null> {
  const url = `${SUPABASE_URL}/rest/v1/template_versions?id=eq.${encodeURIComponent(versionId)}&select=source_path`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "apikey": SUPABASE_ANON_KEY ?? "",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY ?? ""}`,
    },
  });
  if (!res.ok) {
    console.error("Failed fetch template_versions:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const json = await res.json().catch(() => null);
  if (Array.isArray(json) && json.length > 0) {
    return (json[0] as any).source_path ?? null;
  }
  return null;
}

// utility: create signed url via storage REST with service role
async function createSignedUrl(bucketId: string, objectKey: string, expiresInSec = SIGN_URL_EXPIRE_SECONDS) {
  const url = `${SUPABASE_URL}/storage/v1/object/sign/${encodeURIComponent(bucketId)}/${encodeURIComponent(objectKey)}?expiry=${expiresInSec}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_SERVICE_ROLE_KEY ?? "",
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    console.error("Failed createSignedUrl:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const json = await res.json().catch(() => null);
  return json;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const versionId = url.searchParams.get("version_id");
    if (!versionId) {
      return NextResponse.json({ error: "version_id_required" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "missing_authorization" }, { status: 401 });
    }
    const userJwt = authHeader.split(" ")[1];

    // Check access via RPC (user's JWT)
    const hasAccess = await rpcUserHasAccess(versionId, userJwt);
    if (!hasAccess) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const sourcePath = await getSourcePath(versionId);
    if (!sourcePath) {
      return NextResponse.json({ error: "source_not_found" }, { status: 404 });
    }

    const signed = await createSignedUrl(STORAGE_BUCKET, sourcePath, SIGN_URL_EXPIRE_SECONDS);
    if (!signed) {
      return NextResponse.json({ error: "signed_url_failed" }, { status: 500 });
    }

    const urlResp = (signed as any).signedURL ?? (signed as any).signed_url ?? signed;

    return NextResponse.json({ url: urlResp, expires_in: SIGN_URL_EXPIRE_SECONDS }, { status: 200 });
  } catch (err) {
    console.error("app/api/download error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

// For POST support (optional)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const versionId = body?.version_id ?? null;
    if (!versionId) return NextResponse.json({ error: "version_id_required" }, { status: 400 });

    const authHeader = req.headers.get("authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "missing_authorization" }, { status: 401 });
    }
    const userJwt = authHeader.split(" ")[1];

    const hasAccess = await rpcUserHasAccess(versionId, userJwt);
    if (!hasAccess) return NextResponse.json({ error: "forbidden" }, { status: 403 });

    const sourcePath = await getSourcePath(versionId);
    if (!sourcePath) return NextResponse.json({ error: "source_not_found" }, { status: 404 });

    const signed = await createSignedUrl(STORAGE_BUCKET, sourcePath, SIGN_URL_EXPIRE_SECONDS);
    if (!signed) return NextResponse.json({ error: "signed_url_failed" }, { status: 500 });

    const urlResp = (signed as any).signedURL ?? (signed as any).signed_url ?? signed;
    return NextResponse.json({ url: urlResp, expires_in: SIGN_URL_EXPIRE_SECONDS }, { status: 200 });
  } catch (err) {
    console.error("app/api/download POST error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

