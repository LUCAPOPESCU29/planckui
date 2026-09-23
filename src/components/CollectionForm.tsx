"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "./Toaster";

export interface FormConfig {
  headline: string;
  askRating: boolean;
  askVideo: boolean;
  askRole: boolean;
}

const VIDEO_CAP_SECONDS = 90;

export function CollectionForm({
  slug,
  config,
  demo = false,
  embed = false,
}: {
  slug: string;
  config: FormConfig;
  demo?: boolean;
  embed?: boolean;
}) {
  const steps: { id: string; label: string }[] = [{ id: "words", label: "Your words" }];
  if (config.askRole) steps.push({ id: "who", label: "Who you are" });
  if (config.askVideo) steps.push({ id: "video", label: "Video (optional)" });

  const [step, setStep] = useState(0);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [recState, setRecState] = useState<"idle" | "recording" | "recorded">("idle");
  const [secs, setSecs] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const liveRef = useRef<HTMLVideoElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // inside an iframe embed, keep the host frame sized to the content
  useEffect(() => {
    if (!embed) return;
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => {
      window.parent.postMessage({ plkHeight: document.documentElement.scrollHeight }, "*");
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [embed]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (recState !== "recording") return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recState]);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (liveRef.current) {
        liveRef.current.srcObject = stream;
      }
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const b = new Blob(chunks, { type: "video/webm" });
        setBlob(b);
        setVideoPreviewUrl(URL.createObjectURL(b));
        setRecState("recorded");
      };
      recRef.current = rec;
      setSecs(0);
      setBlob(null);
      setVideoPreviewUrl(null);
      rec.start();
      setRecState("recording");
      setTimeout(() => {
        if (recRef.current?.state === "recording") recRef.current.stop();
      }, VIDEO_CAP_SECONDS * 1000);
    } catch {
      setError("Camera access was blocked. You can skip the video — words are plenty.");
    }
  }

  function stopRecording() {
    recRef.current?.stop();
  }

  function discardRecording() {
    setBlob(null);
    setVideoPreviewUrl(null);
    setRecState("idle");
  }

  const canContinue =
    step === 0 ? text.trim().length > 0 && (!config.askRating || rating > 0) : step === 1 ? author.trim().length > 0 : true;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      let videoUrl: string | undefined;
      if (blob && !demo) {
        const fd = new FormData();
        fd.append("file", new File([blob], "testimonial.webm", { type: "video/webm" }));
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        const upData = await up.json();
        if (!up.ok) throw new Error(upData.error || "The video upload failed.");
        videoUrl = upData.url;
      }
      if (!demo) {
        const res = await fetch(`/api/c/${slug}/submit`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            author,
            role,
            rating: config.askRating ? rating : 0,
            text,
            videoUrl,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Sending failed. Try once more.");
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sending failed. Try once more.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div ref={rootRef} className="card mx-auto max-w-lg p-8 text-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="mx-auto">
          <circle cx="20" cy="20" r="19" className="fill-accent-soft" />
          <path d="M12 20.5l5.5 5.5L28 14.5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="mt-4 font-display text-xl font-semibold">
          Thank you{author ? `, ${author.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          {demo
            ? "In a real collection, this would now wait in the owner's inbox for approval."
            : "Your words are in. They'll appear on the wall once the owner approves them."}
        </p>
        <a
          href="https://planckui.dev"
          target="_blank"
          rel="noopener"
          className="mt-6 inline-block rounded-full border border-line px-3.5 py-1.5 text-xs text-ink-3 transition-colors hover:border-accent hover:text-accent"
        >
          Collect testimonials free with PlanckUi
        </a>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-lg">
      <div className="mb-5 flex items-center gap-2" aria-hidden="true">
        {steps.map((s, i) => (
          <span
            key={s.id}
            className="h-1 flex-1 rounded-full transition-colors duration-200"
            style={{ background: i <= step ? "var(--accent)" : "var(--line)" }}
          />
        ))}
      </div>

      <div className="card p-6 sm:p-8">
        <h1 className="font-display text-xl font-semibold">{config.headline}</h1>
        <p className="mt-1 text-sm text-ink-3">
          Step {step + 1} of {steps.length} — {steps[step].label}
        </p>

        {step === 0 && (
          <div className="mt-5 flex flex-col gap-5">
            {config.askRating && (
              <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    className="rounded p-1 text-2xl transition-transform duration-150 hover:scale-110 active:scale-95"
                    style={{ color: "oklch(0.78 0.13 82)" }}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                  >
                    <span style={{ opacity: n <= (hover || rating) ? 1 : 0.22 }}>★</span>
                  </button>
                ))}
              </div>
            )}
            <div>
              <label htmlFor="plk-text" className="label">
                {config.askRating ? "Anything you want to add?" : "How did it go?"}
              </label>
              <textarea
                id="plk-text"
                className="textarea"
                rows={4}
                maxLength={2000}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Say it how you'd say it to a friend."
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label htmlFor="plk-name" className="label">
                Your name
              </label>
              <input
                id="plk-name"
                className="input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                maxLength={80}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="plk-role" className="label">
                What you do{" "}
                <span className="font-normal text-ink-3">(optional — e.g. Founder, Fern &amp; Co.)</span>
              </label>
              <input
                id="plk-role"
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                maxLength={80}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 flex flex-col gap-4">
            {recState === "idle" && (
              <>
                <p className="text-sm text-ink-2">
                  A 20-second video says more than a paragraph. Your call — this step is
                  completely optional.
                </p>
                <button type="button" className="btn btn-ghost" onClick={startRecording}>
                  Record a video
                </button>
              </>
            )}
            {recState === "recording" && (
              <div className="flex flex-col gap-3">
                <video
                  ref={liveRef}
                  autoPlay
                  muted
                  playsInline
                  className="max-h-72 w-full rounded-[var(--radius-md)] border border-line bg-black object-cover"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-ink-2">
                    Recording — {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")} (max{" "}
                    {VIDEO_CAP_SECONDS}s)
                  </span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={stopRecording}>
                    Stop
                  </button>
                </div>
              </div>
            )}
            {recState === "recorded" && videoPreviewUrl && (
              <div className="flex flex-col gap-3">
                <video
                  src={videoPreviewUrl}
                  controls
                  playsInline
                  className="max-h-72 w-full rounded-[var(--radius-md)] border border-line bg-black"
                />
                <button type="button" className="btn btn-ghost btn-sm self-start" onClick={discardRecording}>
                  Record again
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm" style={{ color: "var(--danger)" }} role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canContinue}
              onClick={() => setStep(step + 1)}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={submit}
            >
              {busy ? "Sending…" : "Send it"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-3">
        <a
          href="https://planckui.dev"
          target="_blank"
          rel="noopener"
          className="transition-colors hover:text-accent"
        >
          Powered by PlanckUi — free testimonial collection
        </a>
      </p>
      {demo && (
        <p className="mt-1 text-center text-xs text-ink-3">
          Preview mode — submissions here are not stored.
        </p>
      )}
    </div>
  );
}
