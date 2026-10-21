import { createClient } from "npm:@supabase/supabase-js@2";
const corsHeaders = { "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: corsHeaders });
const mime = new Set(["audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/wav", "audio/x-wav", "audio/aac", "audio/m4a", "audio/x-m4a", "application/octet-stream"]);
Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Use POST for this endpoint." }, 405);
  const bearer = request.headers.get("Authorization"), url = Deno.env.get("SUPABASE_URL"), anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!bearer?.startsWith("Bearer ") || !url || !anon) return json({ error: "Sign in to continue." }, 401);
  const client = createClient(url, anon, { global: { headers: { Authorization: bearer } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return json({ error: "Sign in to transcribe a recording." }, 401);
  const rawType = request.headers.get("Content-Type") || "audio/webm";
  const type = rawType.split(";")[0].toLowerCase().trim();
  if (type && !mime.has(type) && !type.startsWith("audio/")) return json({ error: "Choose a supported audio recording." }, 415);
  const raw = await request.arrayBuffer().catch(() => null);
  if (!raw || raw.byteLength < 256 || raw.byteLength > 10 * 1024 * 1024) return json({ error: "Recordings must be between 256 bytes and 10 MB." }, 413);
  const { data: allowed, error: rateError } = await client.rpc("claim_voice_transcription");
  if (rateError) return json({ error: "Could not check the transcription limit. Please retry." }, 500);
  if (!allowed) return json({ error: "You have reached the transcription limit for this hour." }, 429);
  const account = Deno.env.get("CLOUDFLARE_ACCOUNT_ID"), token = Deno.env.get("CLOUDFLARE_API_TOKEN"), model = Deno.env.get("CLOUDFLARE_STT_MODEL") || "@cf/openai/whisper-large-v3-turbo";
  if (!account || !token) return json({ error: "Transcription is temporarily unavailable." }, 503);
  const bytes = new Uint8Array(raw); let binary = ""; for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 30000);
  try {
    const endpointModel = model.split("/").map(encodeURIComponent).join("/");
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/ai/run/${endpointModel}`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ audio: btoa(binary), task: "transcribe" }) });
    if (!response.ok) return json({ error: "Cloudflare could not transcribe this recording. Please retry." }, 502);
    const payload: any = await response.json(), transcript = payload?.result?.text;
    if (typeof transcript !== "string" || !transcript.trim() || transcript.length > 30000) return json({ error: "No usable transcript was returned. The recording was not saved." }, 502);
    return json({ transcript: transcript.trim() });
  } catch { return json({ error: "Transcription timed out or could not be completed. Please retry." }, 502); }
  finally { clearTimeout(timer); }
});
