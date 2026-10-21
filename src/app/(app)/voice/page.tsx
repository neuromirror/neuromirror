"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Square, Trash2, Sparkles, Volume2, Check, ArrowRight, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { btnGhost, btnPrimary } from "@/components/ui";
import { MOODS, type Mood } from "@/lib/types";
import { analyzeWritingLocally, type CognitiveAnalysisResult } from "@/lib/cognitive-analyzer";

const MAX_MS = 120_000;
const MAX_BYTES = 10 * 1024 * 1024;

export default function VoiceJournalPage() {
  const router = useRouter();
  const { today, newId, saveJournal, notebooks } = useStore();

  const [recording, setRecording] = useState(false);
  const [liveListening, setLiveListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");

  // Metadata before saving
  const [title, setTitle] = useState(`Voice journal · ${today || new Date().toISOString().slice(0, 10)}`);
  const [mood, setMood] = useState<Mood | "">("reflective");
  const [notebookId, setNotebookId] = useState<string>("");
  const [tagInput, setTagInput] = useState("voice");

  // Insights analysis result state
  const [analysis, setAnalysis] = useState<CognitiveAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [savedJournalId, setSavedJournalId] = useState<string | null>(null);

  const media = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechRecognizer = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      stream.current?.getTracks().forEach((t) => t.stop());
      if (url) URL.revokeObjectURL(url);
      if (speechRecognizer.current) {
        try { speechRecognizer.current.stop(); } catch {}
      }
    };
  }, [url]);

  // Setup Web Speech API for real-time live dictation if available in browser
  const startLiveSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return false;

    try {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = "en-US";

      recognizer.onresult = (event: any) => {
        let liveText = "";
        for (let i = 0; i < event.results.length; i++) {
          liveText += event.results[i][0].transcript + " ";
        }
        if (liveText.trim()) {
          setTranscript((prev) => {
            const combined = (prev ? prev.trim() + " " : "") + liveText.trim();
            // deduplicate trailing spaces
            return liveText.trim();
          });
        }
      };

      recognizer.onerror = () => {
        setLiveListening(false);
      };

      recognizer.onend = () => {
        setLiveListening(false);
      };

      recognizer.start();
      speechRecognizer.current = recognizer;
      setLiveListening(true);
      return true;
    } catch {
      return false;
    }
  };

  const stopLiveSpeech = () => {
    if (speechRecognizer.current) {
      try { speechRecognizer.current.stop(); } catch {}
      speechRecognizer.current = null;
    }
    setLiveListening(false);
  };

  async function start() {
    setError("");
    setStatus("");
    setBlob(null);
    setTranscript("");
    setAnalysis(null);
    setSavedJournalId(null);

    // Start live speech recognizer in parallel for instant display
    startLiveSpeech();

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      if (!liveListening) {
        setError("Audio recording is not supported in this browser.");
      }
      return;
    }

    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;
      const type = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"].find((t) =>
        MediaRecorder.isTypeSupported(t)
      );
      const recorder = new MediaRecorder(s, type ? { mimeType: type } : undefined);
      media.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const audio = new Blob(chunks.current, { type: recorder.mimeType || "audio/webm" });
        setBlob(audio);
        setUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(audio);
        });
        s.getTracks().forEach((track) => track.stop());
        stream.current = null;
        setStatus(
          audio.size > MAX_BYTES
            ? "Recording exceeds 10 MB. Please record a shorter clip."
            : "Recording ready. Play it back, review the transcript, and save or analyze."
        );
      };

      recorder.start();
      setRecording(true);
      timer.current = setTimeout(() => stop(), MAX_MS);
    } catch (cause) {
      stopLiveSpeech();
      setError(
        cause instanceof Error && cause.name === "NotAllowedError"
          ? "Microphone permission was denied. Allow microphone access in your browser and retry."
          : "Could not access microphone. Check your device settings and retry."
      );
    }
  }

  function stop() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    stopLiveSpeech();
    if (media.current?.state === "recording") media.current.stop();
    setRecording(false);
  }

  function discard() {
    if (recording) stop();
    stopLiveSpeech();
    setBlob(null);
    setTranscript("");
    setAnalysis(null);
    setSavedJournalId(null);
    setStatus("Recording discarded.");
    setUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return "";
    });
  }

  // Cloudflare Whisper Edge Function Transcribe
  async function transcribeAudio() {
    if (!blob || blob.size > MAX_BYTES) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const client = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await client.auth.getSession();
      if (sessionError || !session) throw new Error("Sign in again to transcribe this recording.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/voice-transcription`, {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": blob.type,
        },
        body: blob,
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Could not transcribe this recording. Please retry.");
      if (typeof data?.transcript !== "string" || !data.transcript.trim()) {
        throw new Error("No transcript was returned.");
      }
      setTranscript(data.transcript.trim());
      setStatus("Whisper transcription complete. Review before saving.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Cloudflare transcription timed out. You can edit the text manually.");
    } finally {
      setBusy(false);
    }
  }

  // Save Voice Journal to Store & Supabase
  async function performSave(): Promise<string> {
    if (!transcript.trim()) throw new Error("Please speak or write something to save.");
    const escape = (value: string) => value.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
    const stamp = new Date().toISOString();
    const journalId = newId("j");

    const tags = tagInput
      .split(/[\s,]+/)
      .map((t) => t.replace(/^#/, "").trim())
      .filter((t) => t.length > 0);

    const audioMarkup = url
      ? `<p><audio controls src="${url}" preload="metadata" style="width: 100%; margin: 8px 0;"></audio></p>`
      : "";

    const content = `${audioMarkup}<p>${escape(transcript.trim()).replace(/\n/g, "</p><p>")}</p>`;

    await saveJournal({
      kind: "journal",
      id: journalId,
      title: title.trim() || `Voice journal · ${today}`,
      content,
      journalDate: today,
      mood: (mood || null) as Mood | null,
      notebookId: notebookId || null,
      tags: tags.length ? tags : ["voice"],
      favorite: false,
      archived: false,
      createdAt: stamp,
      updatedAt: stamp,
    });

    setSavedJournalId(journalId);
    return journalId;
  }

  // Save only
  async function saveDraft() {
    setBusy(true);
    setError("");
    try {
      await performSave();
      discard();
      router.push("/writing?view=journals");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the journal. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  // Save AND Run Immediate Cognitive Analysis
  async function saveAndAnalyze() {
    setBusy(true);
    setAnalyzing(true);
    setError("");
    setAnalysis(null);

    try {
      const savedId = await performSave();
      setStatus("Journal saved! Computing cognitive linguistic observations…");

      // Attempt Edge Function analysis
      let completed = false;
      try {
        const client = createClient();
        const { data, error: fnErr } = await client.functions.invoke("cognitive-analysis", {
          body: { journalId: savedId },
        });
        if (!fnErr && data?.analysis) {
          setAnalysis(data.analysis);
          completed = true;
        }
      } catch {
        // fall back
      }

      if (!completed) {
        // Fallback local linguistic analysis
        const local = analyzeWritingLocally(title, transcript);
        setAnalysis(local);
      }

      setStatus("Analysis completed! See your reflections below.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not complete analysis. Journal is saved.");
    } finally {
      setBusy(false);
      setAnalyzing(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <PageHeader eyebrow="Voice Journaling & Audio" title="Speak freely, reflect deeply" />
      <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-2">
        Speak your thoughts in real-time or record up to two minutes. NeuroMirror captures your words with live speech
        transcription and Cloudflare Whisper. Review, customize, and save or analyze for immediate cognitive language patterns.
      </p>

      {/* Main Recording Card */}
      <section className="mt-8 rounded-2xl border border-line bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {!recording && !liveListening ? (
              <button
                type="button"
                onClick={() => void start()}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper hover:opacity-90 shadow-sm"
              >
                <Mic className="h-4 w-4" /> Start Speaking
              </button>
            ) : (
              <button
                type="button"
                onClick={stop}
                className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-medium text-paper hover:opacity-90 animate-pulse shadow-sm"
              >
                <Square className="h-4 w-4" /> Stop Recording
              </button>
            )}

            {blob && (
              <button type="button" onClick={discard} className={btnGhost}>
                <Trash2 className="h-4 w-4" /> Discard
              </button>
            )}
          </div>

          {(recording || liveListening) && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-clay"></span>
              </span>
              <span className="text-xs font-medium text-clay">Listening in real-time…</span>
            </div>
          )}
        </div>

        {/* Audio Player playback */}
        {url && (
          <div className="mt-6 rounded-xl border border-line bg-paper p-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-ink-2">
              <Volume2 className="h-4 w-4 text-accent" />
              <span>Audio Playback</span>
            </div>
            <audio controls src={url} className="w-full" />
            <div className="mt-3 flex items-center justify-between">
              <button
                disabled={busy || blob!.size > MAX_BYTES}
                onClick={() => void transcribeAudio()}
                className="text-xs text-accent hover:underline disabled:opacity-50"
              >
                {busy ? "Transcribing with Whisper…" : "Re-transcribe with Cloudflare Whisper"}
              </button>
              {blob!.size > MAX_BYTES && <span className="text-xs text-clay">Recording exceeds 10 MB limit.</span>}
            </div>
          </div>
        )}

        {status && <p role="status" className="mt-4 text-xs font-medium text-accent">{status}</p>}
        {error && <p role="alert" className="mt-4 text-xs text-clay">{error}</p>}

        {/* Transcript & Customization Area */}
        <div className="mt-8 border-t border-line pt-6">
          <label htmlFor="transcript" className="block text-sm font-semibold text-ink">
            Spoken Transcript
          </label>
          <p className="text-xs text-ink-3 mt-1 mb-2">
            Text appears here live as you speak. You can edit, format, or add to it anytime.
          </p>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken words will appear here in real-time as you speak…"
            rows={7}
            className="w-full rounded-xl border border-line-2 bg-paper px-4 py-3 text-sm leading-6 text-ink outline-none focus:border-accent"
          />

          {/* Journal Personalization Metadata Fields */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="voice-title" className="block text-xs font-medium text-ink-2 mb-1">
                Entry Title
              </label>
              <input
                id="voice-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <div>
              <label htmlFor="voice-mood" className="block text-xs font-medium text-ink-2 mb-1">
                Mood
              </label>
              <select
                id="voice-mood"
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood | "")}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent"
              >
                <option value="">Not set</option>
                {MOODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.glyph} {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="voice-nb" className="block text-xs font-medium text-ink-2 mb-1">
                Notebook
              </label>
              <select
                id="voice-nb"
                value={notebookId}
                onChange={(e) => setNotebookId(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent"
              >
                <option value="">None</option>
                {notebooks.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="voice-tags" className="block text-xs font-medium text-ink-2 mb-1">
                Tags (space separated)
              </label>
              <input
                id="voice-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="voice thoughts reflection"
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => void saveAndAnalyze()}
              disabled={busy || !transcript.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50 shadow-sm"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Save & Analyze for Insights
            </button>

            <button
              onClick={() => void saveDraft()}
              disabled={busy || !transcript.trim()}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-2 bg-card px-4 py-2.5 text-xs font-medium text-ink hover:bg-paper-2 disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> Save Journal
            </button>
          </div>
        </div>
      </section>

      {/* Immediate Cognitive Insights Card when Analyzed */}
      {analysis && (
        <section className="mt-8 rounded-2xl border border-line bg-card p-6 sm:p-8 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl text-ink">Cognitive Voice Journal Insights</h2>
            </div>
            {savedJournalId && (
              <button
                type="button"
                onClick={() => router.push(`/writing/journal/${savedJournalId}`)}
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
              >
                Open in Editor <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="mt-5 space-y-5">
            <div className="rounded-xl bg-paper p-4 border border-line">
              <p className="text-sm leading-relaxed text-ink">{analysis.summary}</p>
              {analysis.trend && (
                <div className="mt-3 pt-3 border-t border-line">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                    {analysis.trend.label}
                  </span>
                  <p className="text-xs text-ink-2 mt-0.5">{analysis.trend.summary}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-3">
                Linguistic Observations
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {analysis.observations.map((obs, i) => (
                  <div key={i} className="rounded-xl border border-line bg-paper p-4">
                    <h4 className="text-xs font-semibold text-ink">{obs.area}</h4>
                    <p className="text-xs text-ink-2 mt-1">{obs.finding}</p>
                    {obs.evidence && <p className="text-[11px] text-ink-3 italic mt-1">“{obs.evidence}”</p>}
                    <p className="text-[11px] text-ink-3 mt-1.5">{obs.caveat}</p>
                  </div>
                ))}
              </div>
            </div>

            {analysis.reflectionQuestions?.length > 0 && (
              <div className="rounded-xl border border-line bg-paper p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-2 mb-2">
                  Reflection Inquiries
                </h3>
                <ul className="space-y-1.5 text-xs text-ink-2 list-disc pl-4">
                  {analysis.reflectionQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[11px] text-ink-3 border-t border-line pt-3">{analysis.disclaimer}</p>
          </div>
        </section>
      )}
    </div>
  );
}
