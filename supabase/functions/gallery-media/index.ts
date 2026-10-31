const ADMIN_EMAIL = "hodvlsi@siet.ac.in";
const GALLERY_BUCKET = "gallery";
const MAX_GALLERY_BYTES = 20 * 1024 * 1024;
const MAX_POSTER_BYTES = 5 * 1024 * 1024;
const MAX_THUMB_BYTES = 1024 * 1024;

const allowedOrigins = new Set([
  "https://elephantgokul.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

const supabaseUrl = (Deno.env.get("SUPABASE_URL") || "").replace(/\/+$/, "");
const publicKey = Deno.env.get("SUPABASE_ANON_KEY") || readDefaultKey("SUPABASE_PUBLISHABLE_KEYS");
const secretKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || readDefaultKey("SUPABASE_SECRET_KEYS");

function readDefaultKey(name: string): string {
  try {
    const value = Deno.env.get(name);
    if (!value) return "";
    return JSON.parse(value).default || "";
  } catch {
    return "";
  }
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

class RequestBodyTooLarge extends Error {}

async function readBoundedBody(request: Request, maxBytes: number): Promise<Uint8Array> {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > maxBytes) throw new RequestBodyTooLarge();
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    total += part.value.byteLength;
    if (total > maxBytes) {
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

async function readBoundedJson(request: Request, maxBytes: number): Promise<Record<string, unknown>> {
  const bytes = await readBoundedBody(request, maxBytes);
  const value = JSON.parse(new TextDecoder().decode(bytes));
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid JSON body.");
  return value as Record<string, unknown>;
}


function safeFileName(value: string): string {
  const base = value.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, "") || "media";
  const clean = base.normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return (clean || "media").slice(0, 64);
}

function extension(name: string): string {
  return (name.split(".").pop() || "").toLowerCase();
}

function sniffMime(file: File, bytes: Uint8Array): string | null {
  const ext = extension(file.name);
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));

  let mime: string | null = null;
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) mime = "image/jpeg";
  else if (bytes.length >= 8 && bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10") mime = "image/png";
  else if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") mime = "image/webp";
  else if (bytes.length >= 6 && (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a")) mime = "image/gif";
  else if (bytes.length >= 12 && ascii(4, 8) === "ftyp") mime = "video/mp4";
  else if (bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) mime = "video/webm";

  const extensions: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif",
    mp4: "video/mp4", webm: "video/webm",
  };
  if (!mime || extensions[ext] !== mime) return null;
  if (file.type && file.type !== mime) return null;
  return mime;
}

async function detectMime(file: File): Promise<string | null> {
  const prefix = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return sniffMime(file, prefix);
}

function encodeStoragePath(path: string): string {
  return path.split("/").map((part) => encodeURIComponent(part)).join("/");
}

async function storageRequest(path: string, init: RequestInit): Promise<Response> {
  return fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      ...(init.headers || {}),
    },
  });
}

async function restRequest(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      ...(init.headers || {}),
    },
  });
}

async function requireAdmin(request: Request): Promise<Record<string, unknown> | null> {
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token || !supabaseUrl || !publicKey || !secretKey) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: publicKey, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;

  const user = await response.json();
  const appMetadata = user.app_metadata || {};
  if (String(user.email || "").toLowerCase() !== ADMIN_EMAIL || appMetadata.site_admin !== true) return null;
  return user;
}

async function uploadObject(path: string, file: File, mime: string, cacheSeconds: number): Promise<void> {
  const response = await storageRequest(`/storage/v1/object/${GALLERY_BUCKET}/${encodeStoragePath(path)}`, {
    method: "POST",
    headers: {
      "Content-Type": mime,
      "Cache-Control": `max-age=${cacheSeconds}`,
      "x-upsert": "false",
    },
    body: file,
  });
  if (!response.ok) throw new Error("Storage upload failed.");
}

async function deleteObjects(paths: string[]): Promise<void> {
  const clean = paths.filter(Boolean);
  if (!clean.length) return;
  const response = await storageRequest(`/storage/v1/object/${GALLERY_BUCKET}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes: clean }),
  });
  if (!response.ok) throw new Error("Storage delete failed.");
}

async function getPublishedMedia(ids: string[], includeDrafts: boolean): Promise<Record<string, unknown>[]> {
  const idFilter = ids.map((id) => `"${id}"`).join(",");
  const query = new URLSearchParams({
    select: "id,storage_path,thumbnail_path,status",
    id: `in.(${idFilter})`,
  });
  if (!includeDrafts) query.set("status", "eq.published");
  const response = await restRequest(`gallery_media?${query.toString()}`);
  if (!response.ok) throw new Error("Could not load gallery media.");
  return await response.json();
}

async function createSignedUrl(path: string): Promise<string> {
  const response = await storageRequest(`/storage/v1/object/sign/${GALLERY_BUCKET}/${encodeStoragePath(path)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: 300 }),
  });
  if (!response.ok) throw new Error("Could not sign gallery media.");
  const result = await response.json();
  const relative = result.signedURL || result.signedUrl;
  if (typeof relative !== "string") throw new Error("Signed URL response was invalid.");
  return relative.startsWith("http") ? relative : `${supabaseUrl}/storage/v1${relative.startsWith("/") ? "" : "/"}${relative}`;
}

async function handleSign(request: Request, origin: string): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await readBoundedJson(request, 16 * 1024);
  } catch (error) {
    return json({ error: error instanceof RequestBodyTooLarge ? "Request is too large." : "Invalid request." }, error instanceof RequestBodyTooLarge ? 413 : 400, origin);
  }
  const ids = Array.isArray(body.mediaIds) ? body.mediaIds : [];
  const includeDrafts = body.includeDrafts === true;
  if (!ids.length || ids.length > 30 || ids.some((id: unknown) => typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id))) {
    return json({ error: "Choose one or more valid media records." }, 400, origin);
  }

  if (includeDrafts && !(await requireAdmin(request))) return json({ error: "Administrator access is required." }, 401, origin);
  const media = await getPublishedMedia(ids, includeDrafts);
  const signed = await Promise.all(media.map(async (row) => ({
    id: row.id,
    url: await createSignedUrl(String(row.storage_path)),
    thumbnailUrl: row.thumbnail_path ? await createSignedUrl(String(row.thumbnail_path)) : null,
  })));
  return json({ media: signed }, 200, origin);
}

async function handleUpload(request: Request, origin: string, kind: string): Promise<Response> {
  const user = await requireAdmin(request);
  if (!user) return json({ error: "Administrator access is required." }, 401, origin);

  const poster = kind === "poster";
  if (kind !== "gallery" && !poster) return json({ error: "Unsupported upload type." }, 400, origin);
  const maxRequestBytes = poster ? MAX_POSTER_BYTES + 64 * 1024 : MAX_GALLERY_BYTES + MAX_THUMB_BYTES + 1024 * 1024;
  let form: FormData;
  try {
    const body = await readBoundedBody(request, maxRequestBytes);
    const headers = new Headers(request.headers);
    headers.delete("content-length");
    form = await new Request(request.url, { method: request.method, headers, body }).formData();
  } catch (error) {
    return json({ error: error instanceof RequestBodyTooLarge ? "Upload exceeds the request size limit." : "Upload form is invalid." }, error instanceof RequestBodyTooLarge ? 413 : 400, origin);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "Choose a file to upload." }, 400, origin);
  const maxBytes = poster ? MAX_POSTER_BYTES : MAX_GALLERY_BYTES;
  if (file.size < 1 || file.size > maxBytes) return json({ error: `File exceeds the ${Math.floor(maxBytes / 1024 / 1024)} MB limit.` }, 413, origin);
  const mime = await detectMime(file);
  const allowedMime = poster ? ["image/jpeg", "image/png", "image/webp"] : [
    "image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm",
  ];
  if (!mime || !allowedMime.includes(mime)) {
    return json({ error: "File content does not match an allowed JPEG, PNG, WebP, GIF, MP4, or WebM file." }, 415, origin);
  }

  const id = crypto.randomUUID();
  const fileName = safeFileName(file.name);
  const ext = extension(file.name);
  if (poster) {
    const path = `posters/${id}.${ext}`;
    const response = await storageRequest(`/storage/v1/object/events/${encodeStoragePath(path)}`, {
      method: "POST",
      headers: { "Content-Type": mime, "Cache-Control": "max-age=3600", "x-upsert": "false" },
      body: file,
    });
    if (!response.ok) return json({ error: "Poster upload failed." }, 502, origin);
    return json({ publicUrl: `${supabaseUrl}/storage/v1/object/public/events/${encodeStoragePath(path)}` }, 200, origin);
  }

  const categoryId = String(form.get("categoryId") || "");
  if (!/^[0-9a-f-]{36}$/i.test(categoryId)) return json({ error: "Choose a valid gallery category." }, 400, origin);
  const eventIdRaw = String(form.get("eventId") || "");
  const eventId = eventIdRaw || null;
  if (eventId && !/^[0-9a-f-]{36}$/i.test(eventId)) return json({ error: "Choose a valid event." }, 400, origin);
  const categoryResponse = await restRequest(`gallery_categories?id=eq.${categoryId}&is_active=eq.true&select=id`);
  if (!categoryResponse.ok || !(await categoryResponse.json()).length) return json({ error: "The selected category is unavailable." }, 400, origin);
  if (eventId) {
    const eventResponse = await restRequest(`events?id=eq.${eventId}&select=id`);
    if (!eventResponse.ok || !(await eventResponse.json()).length) return json({ error: "The selected event is unavailable." }, 400, origin);
  }

  const prefix = eventId || "general";
  const storagePath = `${prefix}/${id}.${ext}`;
  let thumbnailPath: string | null = null;
  const thumbnail = form.get("thumbnail");

  try {
    await uploadObject(storagePath, file, mime, 31536000);
    if (thumbnail instanceof File && thumbnail.size > 0) {
      if (thumbnail.size > MAX_THUMB_BYTES) throw new Error("Thumbnail exceeds the 1 MB limit.");
      const thumbMime = await detectMime(thumbnail);
      if (!thumbMime || !["image/jpeg", "image/png", "image/webp"].includes(thumbMime)) throw new Error("Thumbnail content is not a supported image.");
      thumbnailPath = `${prefix}/${id}-thumb.${extension(thumbnail.name)}`;
      await uploadObject(thumbnailPath, thumbnail, thumbMime, 31536000);
    }

    const caption = String(form.get("caption") || "").trim().slice(0, 500);
    const record = {
      id,
      event_id: eventId,
      category_id: categoryId,
      caption,
      media_kind: mime.startsWith("video/") ? "video" : "image",
      storage_path: storagePath,
      thumbnail_path: thumbnailPath,
      file_name: `${fileName}.${ext}`,
      mime_type: mime,
      file_size: file.size,
      status: "draft",
    };
    const dbResponse = await restRequest("gallery_media", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(record),
    });
    if (!dbResponse.ok) throw new Error("Gallery record could not be saved.");
    const records = await dbResponse.json();
    return json({ media: records[0] }, 201, origin);
  } catch (error) {
    await deleteObjects([storagePath, thumbnailPath || ""]).catch(() => undefined);
    return json({ error: error instanceof Error ? error.message : "Gallery upload failed." }, 400, origin);
  }
}

async function handleDelete(request: Request, origin: string): Promise<Response> {
  const user = await requireAdmin(request);
  if (!user) return json({ error: "Administrator access is required." }, 401, origin);
  let body: Record<string, unknown>;
  try {
    body = await readBoundedJson(request, 4 * 1024);
  } catch (error) {
    return json({ error: error instanceof RequestBodyTooLarge ? "Request is too large." : "Invalid request." }, error instanceof RequestBodyTooLarge ? 413 : 400, origin);
  }
  const id = String(body.mediaId || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Choose a valid media record." }, 400, origin);

  const response = await restRequest(`gallery_media?id=eq.${id}&select=id,storage_path,thumbnail_path`);
  if (!response.ok) return json({ error: "Could not load gallery record." }, 502, origin);
  const records = await response.json();
  if (!records.length) return json({ error: "Gallery item not found." }, 404, origin);

  try {
    await deleteObjects([records[0].storage_path, records[0].thumbnail_path || ""]);
    const deleteResponse = await restRequest(`gallery_media?id=eq.${id}`, { method: "DELETE" });
    if (!deleteResponse.ok) throw new Error("Gallery record delete failed.");
    return json({ deleted: true }, 200, origin);
  } catch {
    return json({ error: "Could not delete gallery media." }, 502, origin);
  }
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") || "";
  if (!allowedOrigins.has(origin)) return new Response("Origin not allowed", { status: 403 });
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
  if (!supabaseUrl || !publicKey || !secretKey) return json({ error: "Media service is not configured." }, 503, origin);

  try {
    const action = new URL(request.url).searchParams.get("action") || "sign";
    if (action === "sign") return await handleSign(request, origin);
    if (action === "upload") {
      const kind = new URL(request.url).searchParams.get("kind") || "gallery";
      return await handleUpload(request, origin, kind);
    }
    if (action === "delete") return await handleDelete(request, origin);
    return json({ error: "Unknown media action." }, 400, origin);
  } catch {
    return json({ error: "Media request could not be completed." }, 500, origin);
  }
});
