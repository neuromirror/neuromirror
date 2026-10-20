"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { btnGhost, btnPrimary } from "@/components/ui";

const MAX_MS = 120_000;
const MAX_BYTES = 10 * 1024 * 1024;

export default function VoiceJournalPage() {
  const router = useRouter();
  const { today, newId, saveJournal } = useStore();
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const media = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); stream.current?.getTracks().forEach((t) => t.stop()); if (url) URL.revokeObjectURL(url); }, [url]);

  async function start() {
    setError(""); setStatus(""); setBlob(null); setTranscript("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setError("Audio recording is not supported in this browser."); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;
      const type = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"].find((t) => MediaRecorder.isTypeSupported(t));
      const recorder = new MediaRecorder(s, type ? { mimeType: type } : undefined);
      media.current = recorder; chunks.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      recorder.onstop = () => {
        const audio = new Blob(chunks.current, { type: recorder.mimeType || "audio/webm" });
        setBlob(audio); setUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(audio); });
        s.getTracks().forEach((track) => track.stop()); stream.current = null;
        setStatus(audio.size > MAX_BYTES ? "Recording exceeds 10 MB. Please record a shorter clip." : "Recording ready. Play it back or request a transcript.");
      };
      recorder.start(); setRecording(true);
      timer.current = setTimeout(() => stop(), MAX_MS);
    } catch (cause) { setError(cause instanceof Error && cause.name === "NotAllowedError" ? "Microphone permission was denied. Allow microphone access and retry." : "Could not access the microphone. Check your device settings and retry."); }
  }
  function stop() {
    if (timer.current) clearTimeout(timer.current); timer.current = null;
    if (media.current?.state === "recording") media.current.stop();
    setRecording(false);
  }
  function discard() {
    if (recording) stop();
    setBlob(null); setTranscript(""); setStatus("Recording discarded.");
    setUrl((old) => { if (old) URL.revokeObjectURL(old); return ""; });
  }
  async function transcribe() {
    if (!blob || blob.size > MAX_BYTES) return;
    setBusy(true); setError(""); setStatus("");
    try {
      const client = createClient();
      const { data: { session }, error: sessionError } = await client.auth.getSession();
      if (sessionError || !session) throw new Error("Sign in again to transcribe this recording.");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/voice-transcription`, { method: "POST", headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, Authorization: `Bearer ${session.access_token}`, "Content-Type": blob.type }, body: blob, cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Could not transcribe this recording. Please retry.");
      if (typeof data?.transcript !== "string" || !data.transcript.trim()) throw new Error("No transcript was returned. The recording was not saved.");
      setTranscript(data.transcript); setStatus("Review and edit the transcript before adding it to your journal.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not transcribe. Please retry."); }
    finally { setBusy(false); }
  }
  async function saveDraft() {
    if (!transcript.trim()) return;
    setBusy(true); setError("");
    const escape = (value: string) => value.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
    const stamp = new Date().toISOString();
    try {
      await saveJournal({ kind: "journal", id: newId("j"), title: "Voice journal", content: `<p>${escape(transcript.trim()).replace(/\n/g, "</p><p>")}</p>`, journalDate: today, mood: null, notebookId: null, tags: [], favorite: false, archived: false, createdAt: stamp, updatedAt: stamp });
      discard(); router.push("/writing?view=journals");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save the journal. Please retry."); }
    finally { setBusy(false); }
  }

  return <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-12">
    <PageHeader eyebrow="Voice journaling" title="Speak, then review" />
    <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-2">Record up to two minutes, then request a transcript. Audio is sent securely to Cloudflare for transcription and is not saved by NeuroMirror. Review and edit the transcript before choosing to add it as a dated journal. This does not analyze voice quality, tone, or health.</p>
    <section className="mt-8 rounded-lg border border-line bg-card p-5 sm:p-6">
      <div className="flex flex-wrap gap-3">
        {!recording ? <button type="button" onClick={() => void start()} className={btnPrimary}><Mic className="h-4 w-4" /> Start recording</button> : <button type="button" onClick={stop} className={btnPrimary}><Square className="h-4 w-4" /> Stop recording</button>}
        {blob && <button type="button" onClick={discard} className={btnGhost}><Trash2 className="h-4 w-4" /> Discard</button>}
      </div>
      {recording && <p role="status" className="mt-4 text-sm text-ink-2">Recording… maximum 2 minutes.</p>}
      {url && <div className="mt-4"><label htmlFor="recorded-audio" className="sr-only">Play recording</label><audio id="recorded-audio" controls src={url} className="w-full" /><button disabled={busy || blob!.size > MAX_BYTES} onClick={() => void transcribe()} className={`${btnPrimary} mt-3`}>{busy ? "Transcribing…" : "Request transcript"}</button>{blob!.size > MAX_BYTES && <p className="mt-2 text-sm text-clay">Recording exceeds the 10 MB upload limit.</p>}</div>}
      {status && <p role="status" className="mt-4 text-sm text-ink-2">{status}</p>}
      {error && <div className="mt-4"><p role="alert" className="text-sm text-clay">{error}</p><button onClick={() => void transcribe()} disabled={busy || !blob} className={`${btnGhost} mt-2`}>Retry transcription</button></div>}
      {transcript && <div className="mt-6 border-t border-line pt-5"><label htmlFor="transcript" className="text-sm font-medium text-ink">Review transcript</label><textarea id="transcript" value={transcript} onChange={(e) => setTranscript(e.target.value)} maxLength={30000} rows={9} className="mt-2 w-full rounded-md border border-line-2 bg-paper px-3 py-3 text-sm leading-6 text-ink" /><p className="mt-2 text-xs text-ink-3">Only the edited text below will be saved. Saving creates a journal dated today. Analysis is a separate action.</p><button onClick={() => void saveDraft()} disabled={busy || !transcript.trim()} className={`${btnPrimary} mt-4`}>{busy ? "Saving…" : "Add reviewed transcript to journal"}</button></div>}
      <p className="mt-6 border-t border-line pt-4 text-xs leading-5 text-ink-3">Voice transcription creates editable text only. It does not assess vocal characteristics or provide medical conclusions.</p>
    </section>
  </div>;
}
