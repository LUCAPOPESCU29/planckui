"use client";

import { useEffect, useRef, useState } from "react";

/* Every collecting widget that embeds as an iframe renders here. All
   variants post to the collection's submit endpoint; answers are composed
   into a single pending entry the owner moderates. */

export interface FormCfg {
  headline: string;
  items?: string; // questions / options lines
  [k: string]: unknown;
}

interface RouterProps {
  type: string;
  slug: string;
  cfg: FormCfg;
  demo?: boolean;
  embed?: boolean;
}

export function FormRouter({ type, slug, cfg, demo = false, embed = false }: RouterProps) {
  const shell = (children: React.ReactNode, wide = false) => (
    <div className={wide ? "w-full" : "mx-auto w-full max-w-lg"}>
      {children}
      {embed && <EmbedHeightProbe />}
    </div>
  );
  switch (type) {
    case "contact-form":
      return shell(<MessageForm slug={slug} cfg={cfg} demo={demo} tag="contact" cta="Send message" />);
    case "bug-report-widget":
      return shell(<MessageForm slug={slug} cfg={cfg} demo={demo} tag="bug" cta="Report it" emailField />);
    case "newsletter-signup":
      return shell(<NewsletterForm slug={slug} cfg={cfg} demo={demo} />);
    case "nps-survey":
      return shell(<NpsForm slug={slug} cfg={cfg} demo={demo} />);
    case "poll":
      return shell(<PollForm slug={slug} cfg={cfg} demo={demo} />);
    case "quiz":
      return shell(<QuizForm slug={slug} cfg={cfg} demo={demo} />);
    case "rsvp-form":
      return shell(<RsvpForm slug={slug} cfg={cfg} demo={demo} />);
    case "booking-request-form":
      return shell(<BookingForm slug={slug} cfg={cfg} demo={demo} />);
    case "feature-request-board":
      return shell(<FeatureBoard slug={slug} cfg={cfg} demo={demo} />, true);
    case "multi-question-survey":
    case "multi-step-wizard-form":
      return shell(<SteppedSurvey slug={slug} cfg={cfg} demo={demo} tag={type === "multi-step-wizard-form" ? "wizard" : "survey"} />);
    case "side-feedback-tab":
      return <FeedbackTab slug={slug} cfg={cfg} demo={demo} />;
    case "video-recorder-standalone":
      return shell(<RecorderForm slug={slug} cfg={cfg} demo={demo} />);
    default:
      return shell(
        <p className="py-10 text-center text-sm text-ink-3">
          This form type is not set up yet.
        </p>
      );
  }
}

/* ------------------------------------------------------------ shared bits */

function useSubmit(slug: string, demo: boolean) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function send(payload: Record<string, unknown>) {
    setState("busy");
    setError(null);
    if (demo) {
      await new Promise((r) => setTimeout(r, 400));
      setState("done");
      return;
    }
    try {
      const res = await fetch(`/api/c/${slug}/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sending failed. Try once more.");
      setState("done");
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Sending failed.");
    }
  }
  return { state, error, send, reset: () => setState("idle") };
}

function Success({ title, note }: { title: string; note?: string }) {
  return (
    <div className="card p-8 text-center">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="mx-auto">
        <circle cx="20" cy="20" r="19" className="fill-accent-soft" />
        <path d="M12 20.5l5.5 5.5L28 14.5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 className="mt-4 font-display text-xl font-semibold">{title}</h2>
      {note && <p className="mt-2 text-sm text-ink-2">{note}</p>}
      <a
        href="https://planckui.dev"
        target="_blank"
        rel="noopener"
        className="mt-6 inline-block rounded-full border border-line px-3.5 py-1.5 text-xs text-ink-3 transition-colors hover:border-accent hover:text-accent"
      >
        Collect responses free with PlanckUi
      </a>
    </div>
  );
}

function Heading({ text }: { text: string }) {
  return (
    <>
      <h1 className="font-display text-xl font-semibold">{text}</h1>
    </>
  );
}

function EmbedHeightProbe() {
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      window.parent.postMessage({ plkHeight: document.documentElement.scrollHeight }, "*");
    });
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);
  return null;
}

function MessageForm({
  slug,
  cfg,
  demo,
  tag,
  cta,
  emailField,
}: {
  slug: string;
  cfg: FormCfg;
  demo: boolean;
  tag: string;
  cta: string;
  emailField?: boolean;
}) {
  const { state, error, send } = useSubmit(slug, demo);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (state === "done") return <Success title="Received." note="A human will read it soon." />;
  return (
    <div className="card p-6 sm:p-8">
      <Heading text={cfg.headline} />
      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          send({
            author: name || email || "Someone",
            text: message,
            tags: [tag],
            answers: [
              ...(email ? [{ q: "Email", a: email }] : []),
              { q: "Message", a: message },
            ],
          });
        }}
      >
        <div>
          <label className="label" htmlFor="mf-name">Your name</label>
          <input id="mf-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} autoComplete="name" />
        </div>
        {emailField && (
          <div>
            <label className="label" htmlFor="mf-email">Email (so we can reply)</label>
            <input id="mf-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={120} autoComplete="email" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="mf-msg">{tag === "bug" ? "What happened?" : "Message"}</label>
          <textarea id="mf-msg" className="textarea" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={2000} />
        </div>
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={state === "busy"}>
          {state === "busy" ? "Sending…" : cta}
        </button>
      </form>
    </div>
  );
}

function NewsletterForm({ slug, cfg, demo }: { slug: string; cfg: FormCfg; demo: boolean }) {
  const { state, error, send } = useSubmit(slug, demo);
  const [email, setEmail] = useState("");
  if (state === "done") return <Success title="You are in." note="One good email. That is the whole deal." />;
  return (
    <div className="card p-6 sm:p-8 text-center">
      <Heading text={cfg.headline} />
      <p className="mt-2 text-sm text-ink-3">No spam. Unsubscribe any time.</p>
      <form
        className="mt-5 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          send({ author: email, text: "Newsletter signup: " + email, tags: ["newsletter"] });
        }}
      >
        <input type="email" required className="input text-center" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" maxLength={120} />
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={state === "busy"}>
          {state === "busy" ? "Joining…" : "Join"}
        </button>
      </form>
    </div>
  );
}

function NpsForm({ slug, cfg, demo }: { slug: string; cfg: FormCfg; demo: boolean }) {
  const { state, error, send } = useSubmit(slug, demo);
  const [score, setScore] = useState<number | null>(null);
  const [why, setWhy] = useState("");
  if (state === "done") return <Success title="Thank you." note="Your score is in." />;
  return (
    <div className="card p-6 sm:p-8">
      <Heading text={cfg.headline} />
      <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Score from 0 to 10">
        {Array.from({ length: 11 }, (_, n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={score === n}
            onClick={() => setScore(n)}
            className="h-10 w-10 rounded-[10px] border text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
            style={
              score === n
                ? { background: "var(--ink)", color: "var(--bg)", borderColor: "var(--ink)" }
                : { borderColor: "var(--line-2)", color: "var(--ink-2)" }
            }
          >
            {n}
          </button>
        ))}
      </div>
      <textarea
        className="textarea mt-4"
        rows={3}
        placeholder="Anything you want to add? (optional)"
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        maxLength={1000}
        aria-label="Comment"
      />
      {error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}
      <button
        className="btn btn-primary mt-4"
        disabled={score === null || state === "busy"}
        onClick={() => score !== null && send({ author: "NPS respondent", text: why || "", rating: Math.max(1, Math.round(score / 2)), tags: ["nps"], answers: [{ q: "Score", a: String(score) }, ...(why ? [{ q: "Why", a: why }] : [])] })}
      >
        {state === "busy" ? "Sending…" : "Send score"}
      </button>
    </div>
  );
}

function PollForm({ slug, cfg, demo }: { slug: string; cfg: FormCfg; demo: boolean }) {
  const options = (cfg.items || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const { state, error, send } = useSubmit(slug, demo);
  const [choice, setChoice] = useState<string | null>(null);
  const [counts, setCounts] = useState<number[] | null>(null);

  useEffect(() => {
    if (state !== "done" || demo) return;
    fetch(`/api/c/${slug}/poll?options=` + encodeURIComponent(options.join("|")))
      .then((r) => r.json())
      .then((d) => setCounts(d.counts))
      .catch(() => {});
  }, [state, demo, slug, options.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state === "done") {
    const total = counts ? counts.reduce((a, b) => a + b, 0) : 0;
    return (
      <div className="card p-6 sm:p-8">
        <Heading text={cfg.headline} />
        <p className="mt-2 text-sm text-ink-3">Vote counted{total ? ` — ${total} so far` : ""}.</p>
        <div className="mt-4 flex flex-col gap-2">
          {options.map((o, i) => (
            <div key={o} className="flex items-center gap-3">
              <span className="w-40 shrink-0 truncate text-sm">{o}</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <span
                  className="block h-full rounded-full"
                  style={{ width: counts && total ? `${Math.round((counts[i] / total) * 100)}%` : 0, background: "var(--accent)", transition: "width 500ms cubic-bezier(0.23,1,0.32,1)" }}
                />
              </span>
              <span className="w-8 text-right text-xs text-ink-3">{counts ? counts[i] : ""}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="card p-6 sm:p-8">
      <Heading text={cfg.headline} />
      <div className="mt-5 flex flex-col gap-2" role="radiogroup" aria-label="Options">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={choice === o}
            onClick={() => setChoice(o)}
            className="rounded-[var(--radius-md)] border px-4 py-3 text-left text-[15px] transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
            style={
              choice === o
                ? { borderColor: "var(--accent)", background: "var(--accent-soft)" }
                : { borderColor: "var(--line-2)" }
            }
          >
            {o}
          </button>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}
      <button
        className="btn btn-primary mt-4"
        disabled={!choice || state === "busy"}
        onClick={() => choice && send({ author: "Poll respondent", text: choice, tags: ["poll", "poll:" + choice.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)] })}
      >
        {state === "busy" ? "Counting…" : "Vote"}
      </button>
    </div>
  );
}

function QuizForm({ slug, cfg, demo }: { slug: string; cfg: FormCfg; demo: boolean }) {
  const questions = (cfg.items || "").split("\n").map((line) => {
    const [q, opts, correct] = line.split("|").map((s) => s.trim());
    return { q, opts: (opts || "").split(";;").filter(Boolean), correct: Number(correct) || 0 };
  });
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState("");
  const { state, send } = useSubmit(slug, demo);
  const q = questions[i];

  if (finished && state === "done") {
    return <Success title={`You scored ${score}/${questions.length}.`} note="Nice. Your result is with the organizer." />;
  }
  if (finished) {
    return (
      <div className="card p-6 sm:p-8">
        <Heading text={`Score: ${score}/${questions.length}`} />
        <div className="mt-4">
          <label className="label" htmlFor="qz-name">Your name — get on the scoreboard</label>
          <input id="qz-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
        </div>
        <button className="btn btn-primary mt-4" disabled={state === "busy"} onClick={() => send({ author: name || "Quiz taker", text: `Quiz result: ${score}/${questions.length}`, tags: ["quiz"], answers: [{ q: "Score", a: `${score}/${questions.length}` }] })}>
          {state === "busy" ? "Sending…" : "Send my result"}
        </button>
      </div>
    );
  }
  if (!q) return null;
  return (
    <div className="card p-6 sm:p-8">
      <Heading text={cfg.headline} />
      <p className="mt-1 text-sm text-ink-3">Question {i + 1} of {questions.length}</p>
      <p className="mt-4 text-[15px] font-medium">{q.q}</p>
      <div className="mt-4 flex flex-col gap-2">
        {q.opts.map((o, oi) => (
          <button
            key={o}
            type="button"
            onClick={() => {
              setPicked(oi);
              if (oi === q.correct) setScore((s) => s + 1);
              setTimeout(() => {
                if (i + 1 < questions.length) {
                  setI(i + 1);
                  setPicked(null);
                } else setFinished(true);
              }, 350);
            }}
            disabled={picked !== null}
            className="rounded-[var(--radius-md)] border px-4 py-3 text-left text-[15px] transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            style={picked === oi ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : { borderColor: "var(--line-2)" }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function RsvpForm({ slug, cfg, demo }: { slug: string; cfg: FormCfg; demo: boolean }) {
  const { state, error, send } = useSubmit(slug, demo);
  const [name, setName] = useState("");
  const [coming, setComing] = useState<string | null>(null);
  const [guests, setGuests] = useState(0);
  if (state === "done")
    return <Success title={coming === "yes" ? "See you there." : "Sorry to miss you."} note="Your answer is noted." />;
  return (
    <div className="card p-6 sm:p-8">
      <Heading text={cfg.headline} />
      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label className="label" htmlFor="rs-name">Your name</label>
          <input id="rs-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} autoComplete="name" />
        </div>
        <div className="flex gap-2" role="radiogroup" aria-label="Attending?">
          {[["yes", "Joyfully accepts"], ["no", "Regretfully declines"]].map(([v, label]) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={coming === v}
              onClick={() => setComing(v)}
              className="flex-1 rounded-[var(--radius-md)] border px-4 py-3 text-sm font-medium transition-all duration-150 active:scale-[0.98]"
              style={coming === v ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : { borderColor: "var(--line-2)" }}
            >
              {label}
            </button>
          ))}
        </div>
        {coming === "yes" && (
          <div>
            <label className="label" htmlFor="rs-guests">Plus-ones</label>
            <input id="rs-guests" type="number" min={0} max={10} className="input" value={guests} onChange={(e) => setGuests(Math.max(0, Math.min(10, Number(e.target.value) || 0)))} />
          </div>
        )}
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
        <button
          className="btn btn-primary"
          disabled={!name.trim() || !coming || state === "busy"}
          onClick={() => send({ author: name, text: coming === "yes" ? `Attending${guests ? ` with ${guests} plus-one${guests > 1 ? "s" : ""}` : ""}` : "Not attending", tags: ["rsvp"], answers: [{ q: "Attending", a: coming === "yes" ? "Yes" : "No" }, { q: "Plus-ones", a: String(coming === "yes" ? guests : 0) }] })}
        >
          {state === "busy" ? "Sending…" : "Send RSVP"}
        </button>
      </div>
    </div>
  );
}

function BookingForm({ slug, cfg, demo }: { slug: string; cfg: FormCfg; demo: boolean }) {
  const { state, error, send } = useSubmit(slug, demo);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  if (state === "done") return <Success title="Request sent." note="You'll get a confirmation with the exact slot." />;
  return (
    <div className="card p-6 sm:p-8">
      <Heading text={cfg.headline} />
      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label className="label" htmlFor="bk-name">Your name</label>
          <input id="bk-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="bk-date">Preferred date</label>
          <input id="bk-date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="bk-note">Anything we should know? (optional)</label>
          <textarea id="bk-note" className="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
        </div>
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
        <button
          className="btn btn-primary"
          disabled={!name.trim() || !date || state === "busy"}
          onClick={() => send({ author: name, text: note, tags: ["booking"], answers: [{ q: "Preferred date", a: date }, ...(note ? [{ q: "Note", a: note }] : [])] })}
        >
          {state === "busy" ? "Sending…" : "Request slot"}
        </button>
      </div>
    </div>
  );
}

function SteppedSurvey({ slug, cfg, demo, tag }: { slug: string; cfg: FormCfg; demo: boolean; tag: string }) {
  const questions = (cfg.items || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { state, error, send } = useSubmit(slug, demo);
  const last = i === questions.length - 1;

  if (state === "done") return <Success title="All done." note="Every answer landed safely." />;

  return (
    <div className="card p-6 sm:p-8">
      <Heading text={cfg.headline} />
      <div className="mt-3 flex items-center gap-2" aria-hidden="true">
        {questions.map((_, d) => (
          <span key={d} className="h-1 flex-1 rounded-full transition-colors duration-200" style={{ background: d <= i ? "var(--accent)" : "var(--line)" }} />
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-3">Question {i + 1} of {questions.length}</p>
      <label className="label mt-2" htmlFor="sv-q">{questions[i]}</label>
      <textarea
        id="sv-q"
        className="textarea"
        rows={3}
        value={answers[i] || ""}
        onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
        maxLength={800}
      />
      {error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}
      <div className="mt-5 flex items-center justify-between">
        {i > 0 ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setI(i - 1)}>Back</button>
        ) : <span />}
        <button
          type="button"
          className="btn btn-primary"
          disabled={!(answers[i] || "").trim() || state === "busy"}
          onClick={() => {
            if (!last) setI(i + 1);
            else
              send({
                author: "Survey respondent",
                answers: questions.map((q, d) => ({ q, a: answers[d] || "" })),
                tags: [tag],
              });
          }}
        >
          {last ? (state === "busy" ? "Sending…" : "Send answers") : "Next"}
        </button>
      </div>
    </div>
  );
}

function FeatureBoard({ slug, cfg, demo }: { slug: string; cfg: FormCfg; demo: boolean }) {
  const seeded = (cfg.items || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const { state, error, send } = useSubmit(slug, demo);
  const [idea, setIdea] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="card p-6 sm:p-8">
      <Heading text={cfg.headline} />
      <ul className="mt-5 flex flex-col gap-2">
        {seeded.map((s) => {
          const [title, desc] = s.split("|").map((x) => x.trim());
          return (
            <li key={title} className="rounded-[var(--radius-md)] border border-line px-4 py-3">
              <span className="text-sm font-medium">{title}</span>
              {desc && <span className="block text-sm text-ink-3">{desc}</span>}
            </li>
          );
        })}
      </ul>
      {done ? (
        <p className="mt-5 rounded-[var(--radius-md)] px-4 py-3 text-sm" style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
          Thanks — your request is in the queue for review.
        </p>
      ) : (
        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            send({ author: "Anonymous", text: idea, tags: ["feature-request"] }).then(() => setDone(true));
          }}
        >
          <label className="label" htmlFor="fb-idea">Missing something? Ask for it</label>
          <textarea id="fb-idea" className="textarea" rows={2} value={idea} onChange={(e) => setIdea(e.target.value)} maxLength={400} required />
          {error && <p className="text-sm text-danger" role="alert">{error}</p>}
          <button className="btn btn-primary self-start" disabled={state === "busy"}>
            {state === "busy" ? "Sending…" : "Submit request"}
          </button>
        </form>
      )}
    </div>
  );
}

function FeedbackTab({ slug, cfg, demo }: { slug: string; cfg: FormCfg; demo: boolean }) {
  const [open, setOpen] = useState(false);
  const { state, error, send } = useSubmit(slug, demo);
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="fixed right-0 top-1/2 z-50 -translate-y-1/2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="rounded-l-[var(--radius-md)] border border-r-0 border-line px-2.5 py-4 text-xs font-medium tracking-wide text-ink-2 transition-colors hover:text-ink"
        style={{ writingMode: "vertical-rl", background: "var(--surface)" }}
      >
        {cfg.headline}
      </button>
      {open && (
        <div className="absolute bottom-0 right-full mr-2 w-72 rounded-[var(--radius-lg)] border border-line bg-surface p-4 shadow-lg">
          {state === "done" ? (
            <p className="py-4 text-center text-sm">Got it. Thank you.</p>
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                send({ author: email || "Anonymous", text: msg, tags: ["feedback"], answers: [{ q: "Feedback", a: msg }] });
              }}
            >
              <textarea className="textarea" rows={3} placeholder="What do you think?" value={msg} onChange={(e) => setMsg(e.target.value)} required maxLength={600} aria-label="Feedback" />
              <input type="email" className="input" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} aria-label="Email" />
              {error && <p className="text-sm text-danger" role="alert">{error}</p>}
              <button className="btn btn-primary btn-sm" disabled={state === "busy"}>
                {state === "busy" ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </div>
      )}
      {demo && <EmbedHeightProbe />}
    </div>
  );
}

function RecorderForm({ slug, cfg, demo }: { slug: string; cfg: FormCfg; demo: boolean }) {
  const liveRef = useRef<HTMLVideoElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [recState, setRecState] = useState<"idle" | "recording" | "recorded">("idle");
  const [secs, setSecs] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);
  useEffect(() => {
    if (recState !== "recording") return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recState]);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (liveRef.current) liveRef.current.srcObject = stream;
      const rec = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm" });
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const b = new Blob(chunks, { type: "video/webm" });
        setBlob(b);
        setPreviewUrl(URL.createObjectURL(b));
        setRecState("recorded");
      };
      recRef.current = rec;
      setSecs(0);
      setBlob(null);
      rec.start();
      setRecState("recording");
      setTimeout(() => recRef.current?.state === "recording" && recRef.current.stop(), 90000);
    } catch {
      setError("Camera access was blocked by the browser.");
    }
  }

  if (done) return <Success title="Sent." note="Your video is awaiting approval." />;

  return (
    <div className="card p-6 sm:p-8">
      <Heading text={cfg.headline} />
      <div className="mt-5 flex flex-col gap-4">
        {recState === "idle" && (
          <>
            <div className="flex aspect-video items-center justify-center rounded-[var(--radius-md)] border border-dashed border-line-2 text-sm text-ink-3">
              Camera preview appears here
            </div>
            <button type="button" className="btn btn-primary" onClick={start}>Record a video</button>
          </>
        )}
        {recState === "recording" && (
          <>
            <video ref={liveRef} autoPlay muted playsInline className="aspect-video w-full rounded-[var(--radius-md)] border border-line bg-black object-cover" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-2">
                Recording — {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")} (max 90s)
              </span>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => recRef.current?.stop()}>Stop</button>
            </div>
          </>
        )}
        {recState === "recorded" && previewUrl && (
          <>
            <video src={previewUrl} controls playsInline className="aspect-video w-full rounded-[var(--radius-md)] border border-line bg-black" />
            <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} aria-label="Your name" />
            <input className="input" placeholder="One line about what this is (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={140} aria-label="Caption" />
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  try {
                    let videoUrl: string | undefined;
                    if (!demo && blob) {
                      const fd = new FormData();
                      fd.append("file", new File([blob], "video.webm", { type: "video/webm" }));
                      const up = await fetch("/api/upload", { method: "POST", body: fd });
                      const upData = await up.json();
                      if (!up.ok) throw new Error(upData.error || "Upload failed.");
                      videoUrl = upData.url;
                    }
                    if (!demo) {
                      const res = await fetch(`/api/c/${slug}/submit`, {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ author: name || "Video contributor", text: caption || "Video testimonial", videoUrl }),
                      });
                      if (!res.ok) throw new Error("Sending failed.");
                    }
                    setDone(true);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Sending failed.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Sending…" : "Send it"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setBlob(null); setPreviewUrl(null); setRecState("idle"); }}>
                Record again
              </button>
            </div>
          </>
        )}
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
      </div>
    </div>
  );
}
