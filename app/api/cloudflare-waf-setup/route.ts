/**
 * Cloudflare WAF Setup – Run from Worker (non-Myanmar IP)
 * -------------------------------------------------------
 * Myanmar IP ကနေ Cloudflare API မရရင် ဒီ route ကို ခေါ်ပါ။
 * Cloudflare Worker က global edge ကနေ run လို့ Cloudflare API ရပါမယ်။
 *
 * ခေါ်နည်း: GET /api/cloudflare-waf-setup?setup_key=YOUR_CLOUDFLARE_WAF_SETUP_SECRET
 * သို့ Header: x-waf-setup-key: YOUR_CLOUDFLARE_WAF_SETUP_SECRET
 *
 * Cloudflare Worker Variables မှာ ထည့်ပါ:
 * - CLOUDFLARE_WAF_SETUP_SECRET (ဒီ route ကို ကာကွယ်ရန်)
 * - CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN (သို့ CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL)
 */

import { NextRequest, NextResponse } from "next/server";

const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const API_KEY = process.env.CLOUDFLARE_API_KEY;
const API_EMAIL = process.env.CLOUDFLARE_EMAIL;
const SETUP_SECRET = process.env.CLOUDFLARE_WAF_SETUP_SECRET;

function getAuth():
  | { type: "token"; value: string }
  | { type: "key"; key: string; email: string }
  | null {
  if (API_TOKEN) return { type: "token", value: API_TOKEN };
  if (API_KEY && API_EMAIL) return { type: "key", key: API_KEY, email: API_EMAIL };
  return null;
}

async function cfReq(
  method: string,
  path: string,
  body: object | null,
  auth: { type: "token"; value: string } | { type: "key"; key: string; email: string }
): Promise<{ status: number; body: { success?: boolean; errors?: unknown[]; result?: unknown; raw?: string } }> {
  const url = "https://api.cloudflare.com/client/v4" + (path.startsWith("/") ? path : "/" + path);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth.type === "token") headers["Authorization"] = `Bearer ${auth.value}`;
  else {
    headers["X-Auth-Email"] = auth.email;
    headers["X-Auth-Key"] = auth.key;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data: { success?: boolean; errors?: unknown[]; result?: unknown; raw?: string };
  try {
    data = await res.json();
  } catch {
    data = { raw: await res.text() };
  }
  return { status: res.status, body: data };
}

async function setSecurityLevelOff(auth: NonNullable<ReturnType<typeof getAuth>>) {
  const r = await cfReq("PATCH", `/zones/${ZONE_ID}/settings/security_level`, { value: "essentially_off" }, auth);
  if (!r.body.success) throw new Error(`Security Level: ${JSON.stringify(r.body.errors || r.body)}`);
}

async function setBotFightModeOff(auth: NonNullable<ReturnType<typeof getAuth>>) {
  const r = await cfReq("PATCH", `/zones/${ZONE_ID}/settings/bot_fight_mode`, { value: "off" }, auth);
  if (!r.body.success && r.body.errors?.[0] && !String(r.body.errors[0]).includes("Unknown")) {
    // non-fatal
  }
}

async function getOrCreateRuleset(auth: NonNullable<ReturnType<typeof getAuth>>): Promise<{ id: string; rules?: { description?: string }[] }> {
  const getR = await cfReq(
    "GET",
    `/zones/${ZONE_ID}/rulesets/phases/http_request_firewall_custom/entrypoint`,
    null,
    auth
  );
  if (getR.status === 200 && getR.body.success && getR.body.result) {
    return getR.body.result as { id: string; rules?: { description?: string }[] };
  }
  if (getR.status === 404 || getR.body.errors?.some((e: unknown) => (e as { code?: number }).code === 7000)) {
    const createR = await cfReq("POST", `/zones/${ZONE_ID}/rulesets`, {
      name: "Cloudflare Custom Rules",
      kind: "zone",
      phase: "http_request_firewall_custom",
      rules: [
        {
          description: "Allow All Humans",
          expression: '(ip.geoip.country eq "MM") or (cf.bot_management.verified_bot) or (not cf.client.bot)',
          action: "skip",
        },
        {
          description: "Block Suspicious Bots",
          expression: "(cf.client.bot) and (not cf.bot_management.verified_bot)",
          action: "block",
        },
      ],
    }, auth);
    if (!createR.body.success && /bot_management|verified_bot/.test(JSON.stringify(createR.body.errors || []))) {
      return createWithFallback(auth);
    }
    if (!createR.body.success) throw new Error(`Ruleset create: ${JSON.stringify(createR.body.errors || createR.body)}`);
    return createR.body.result as { id: string; rules?: { description?: string }[] };
  }
  throw new Error(`Ruleset get: ${JSON.stringify(getR.body.errors || getR.body)}`);
}

async function createWithFallback(auth: NonNullable<ReturnType<typeof getAuth>>): Promise<{ id: string; rules?: { description?: string }[] }> {
  const r = await cfReq("POST", `/zones/${ZONE_ID}/rulesets`, {
    name: "Cloudflare Custom Rules",
    kind: "zone",
    phase: "http_request_firewall_custom",
    rules: [
      { description: "Allow All Humans", expression: '(ip.geoip.country eq "MM") or (not cf.client.bot)', action: "skip" },
      { description: "Block Suspicious Bots", expression: "cf.client.bot", action: "block" },
    ],
  }, auth);
  if (!r.body.success) throw new Error(`Ruleset fallback: ${JSON.stringify(r.body.errors || r.body)}`);
  return r.body.result as { id: string; rules?: { description?: string }[] };
}

async function addRule(
  auth: NonNullable<ReturnType<typeof getAuth>>,
  rulesetId: string,
  rule: { description: string; expression: string; action: string }
) {
  const r = await cfReq("POST", `/zones/${ZONE_ID}/rulesets/${rulesetId}/rules`, rule, auth);
  if (!r.body.success && /bot_management|verified_bot/.test(JSON.stringify(r.body.errors || []))) {
    if (rule.description === "Allow All Humans") {
      return addRule(auth, rulesetId, {
        description: "Allow All Humans",
        expression: '(ip.geoip.country eq "MM") or (not cf.client.bot)',
        action: "skip",
      });
    }
    return addRule(auth, rulesetId, {
      description: "Block Suspicious Bots",
      expression: "cf.client.bot",
      action: "block",
    });
  }
  if (!r.body.success) throw new Error(`Rule ${rule.description}: ${JSON.stringify(r.body.errors || r.body)}`);
}

export async function GET(req: NextRequest) {
  const key = req.headers.get("x-waf-setup-key") || req.nextUrl.searchParams.get("setup_key");
  if (!SETUP_SECRET) {
    return NextResponse.json(
      { success: false, error: "CLOUDFLARE_WAF_SETUP_SECRET ကို Vercel Environment Variables မှာ ထည့်ပါ။" },
      { status: 503 }
    );
  }
  if (!key || key !== SETUP_SECRET) {
    return NextResponse.json({ success: false, error: "setup_key မမှန်ပါ။" }, { status: 401 });
  }
  if (!ZONE_ID) {
    return NextResponse.json(
      { success: false, error: "CLOUDFLARE_ZONE_ID ကို Vercel Environment Variables မှာ ထည့်ပါ။" },
      { status: 503 }
    );
  }
  const auth = getAuth();
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "CLOUDFLARE_API_TOKEN သို့ CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL ထည့်ပါ။" },
      { status: 503 }
    );
  }

  const logs: string[] = [];
  try {
    await setSecurityLevelOff(auth);
    logs.push("Security Level = essentially_off");
    await setBotFightModeOff(auth);
    logs.push("Bot Fight Mode = off (or skip)");

    const ruleset = await getOrCreateRuleset(auth);
    logs.push(`Ruleset id=${ruleset.id}`);
    const existing = ruleset.rules || [];
    const hasAllow = existing.some((r) => r.description?.includes("Allow All Humans"));
    const hasBlock = existing.some((r) => r.description?.includes("Block Suspicious Bots"));

    if (!hasAllow) {
      await addRule(auth, ruleset.id, {
        description: "Allow All Humans",
        expression: '(ip.geoip.country eq "MM") or (cf.bot_management.verified_bot) or (not cf.client.bot)',
        action: "skip",
      });
      logs.push("Added: Allow All Humans");
    }
    if (!hasBlock) {
      await addRule(auth, ruleset.id, {
        description: "Block Suspicious Bots",
        expression: "(cf.client.bot) and (not cf.bot_management.verified_bot)",
        action: "block",
      });
      logs.push("Added: Block Suspicious Bots");
    }
    if (hasAllow && hasBlock) logs.push("Allow/Block rules already present");

    return NextResponse.json({ success: true, logs });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: msg, logs }, { status: 500 });
  }
}
