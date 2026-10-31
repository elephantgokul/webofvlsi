const MAX_BODY_BYTES = 16 * 1024;
const ALLOWED_ORIGINS = new Set([
  "https://elephantgokul.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

const supabaseUrl = (Deno.env.get("SUPABASE_URL") || "").replace(/\/+$/, "");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const rateLimitSalt = Deno.env.get("CONTACT_RATE_LIMIT_SALT") || "";

class RequestBodyTooLarge extends Error {}

function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function readLimitedBody(request: Request): Promise<Uint8Array> {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) throw new RequestBodyTooLarge();
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    total += part.value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RequestBodyTooLarge();
    }
    chunks.push(part.value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const bytes = await readLimitedBody(request);
  const parsed = JSON.parse(new TextDecoder().decode(bytes));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Invalid request.");
  }
  return parsed as Record<string, unknown>;
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasForbiddenControls(value: string, allowNewlines: boolean): boolean {
  return allowNewlines
    ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
    : /[\u0000-\u001f\u007f]/.test(value);
}

async function hashRateKey(email: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(rateLimitSalt),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(email));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function consumeEmailLimit(email: string): Promise<boolean> {
  const bucketKey = await hashRateKey(email.toLowerCase());
  const response = await fetch(supabaseUrl + "/rest/v1/rpc/consume_contact_rate_limit", {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: "Bearer " + serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_bucket_key: bucketKey,
      p_limit: 5,
      p_window_seconds: 3600,
    }),
  });
  if (!response.ok) throw new Error("Rate limiter unavailable.");
  return (await response.json()) === true;
}

async function handleContact(request: Request, origin: string): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await readJson(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLarge) return json({ error: "Request is too large." }, 413, origin);
    return json({ error: "Invalid request." }, 400, origin);
  }

  // Honeypot and minimum completion time slow unsophisticated bots; neither is
  // treated as an authorization boundary.
  if (cleanText(body.website) || !Number.isFinite(Number(body.elapsed_ms)) || Number(body.elapsed_ms) < 1800) {
    return json({ ok: true }, 200, origin);
  }

  const name = cleanText(body.name);
  const email = cleanText(body.email);
  const subject = cleanText(body.subject);
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const pageUrl = cleanText(body.page_url);

  if (
    name.length < 2 || name.length > 120 || hasForbiddenControls(name, false) ||
    email.length < 6 || email.length > 254 || hasForbiddenControls(email, false) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    subject.length < 4 || subject.length > 200 || hasForbiddenControls(subject, false) ||
    message.length < 20 || message.length > 10000 || hasForbiddenControls(message, true) ||
    pageUrl.length > 1000 || (pageUrl && (!pageUrl.startsWith("/") || pageUrl.startsWith("//")))
  ) {
    return json({ error: "Please check the submitted fields." }, 400, origin);
  }

  if (!supabaseUrl || !serviceKey || !rateLimitSalt) {
    return json({ error: "Contact service is not configured." }, 503, origin);
  }

  try {
    if (!(await consumeEmailLimit(email))) {
      return json({ error: "Please wait before sending another message." }, 429, origin);
    }

    const stored = await fetch(supabaseUrl + "/rest/v1/contact_messages", {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: "Bearer " + serviceKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        page_url: pageUrl || null,
      }),
    });
    if (!stored.ok) return json({ error: "Message could not be submitted." }, 502, origin);
    return json({ ok: true }, 200, origin);
  } catch {
    return json({ error: "Message could not be submitted." }, 503, origin);
  }
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") || "";
  // CORS is browser policy only; the public endpoint also validates, bounds,
  // rate-limits, and stores data through a server-only secret.
  if (!ALLOWED_ORIGINS.has(origin)) return new Response("Origin not allowed", { status: 403 });
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(origin) });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
  return await handleContact(request, origin);
});

