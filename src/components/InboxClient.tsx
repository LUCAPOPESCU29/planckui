"use client";

import { useState } from "react";
import { toast } from "./Toaster";

export interface InboxTestimonial {
  id: string;
  author: string;
  role?: string;
  rating: number;
  text: string;
  videoUrl?: string;
  createdAt: string;
}

export function InboxClient({
  collectionId,
  pending: initialPending,
  approved: initialApproved,
}: {
  collectionId: string;
  pending: InboxTestimonial[];
  approved: InboxTestimonial[];
}) {
  const [pending, setPending] = useState(initialPending);
  const [approved, setApproved] = useState(initialApproved);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function patch(id: string, status: string) {
    await fetch(`/api/testimonials/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  function approve(t: InboxTestimonial) {
    setPending((p) => p.filter((x) => x.id !== t.id));
    setApproved((a) => [t, ...a]);
    patch(t.id, "approved");
    toast(`Approved ${t.author}'s testimonial`, {
      label: "Undo",
      run: () => {
        setApproved((a) => a.filter((x) => x.id !== t.id));
        setPending((p) => [t, ...p]);
        patch(t.id, "pending");
      },
    });
  }

  function reject(t: InboxTestimonial) {
    setPending((p) => p.filter((x) => x.id !== t.id));
    patch(t.id, "rejected");
    toast(`Kept ${t.author}'s off the wall`, {
      label: "Undo",
      run: () => {
        setPending((p) => [t, ...p]);
        patch(t.id, "pending");
      },
    });
  }

  function remove(t: InboxTestimonial) {
    setApproved((a) => a.filter((x) => x.id !== t.id));
    fetch(`/api/testimonials/${t.id}`, { method: "DELETE" });
    toast(`Deleted ${t.author}'s testimonial`, {
      label: "Undo",
      run: () => {
        setApproved((a) => [t, ...a]);
        patch(t.id, "approved");
      },
    });
  }

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="pending-h">
        <h2 id="pending-h" className="font-display text-lg font-semibold">
          Pending
          <span className="ml-2 align-middle text-sm font-normal text-ink-3">
            nothing here is public until you approve it
          </span>
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 rounded-[var(--radius-lg)] border border-dashed border-line-2 px-5 py-6 text-sm text-ink-3">
            Inbox zero. New submissions land here the moment someone sends them.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {pending.map((t) => (
              <li key={t.id} className="card p-5">
                <Quote t={t} />
                <div className="mt-4 flex gap-2">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => approve(t)}>
                    Approve
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => reject(t)}>
                    Keep off
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="approved-h">
        <h2 id="approved-h" className="font-display text-lg font-semibold">
          On the wall
        </h2>
        {approved.length === 0 ? (
          <p className="mt-3 rounded-[var(--radius-lg)] border border-dashed border-line-2 px-5 py-6 text-sm text-ink-3">
            Nothing approved yet. Approve something above, or import past praise below —
            approved items appear in your widgets instantly.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {approved.map((t) => (
              <li key={t.id} className="card p-5">
                <Quote t={t} />
                <div className="mt-4 flex gap-2">
                  {confirmDelete === t.id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => remove(t)}
                      >
                        Really delete
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setConfirmDelete(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmDelete(t.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Quote({ t }: { t: InboxTestimonial }) {
  return (
    <div className="flex flex-col gap-2">
      {t.rating > 0 && (
        <span className="text-sm" style={{ color: "oklch(0.72 0.13 82)" }} aria-label={`Rated ${t.rating} of 5`}>
          {"★".repeat(t.rating)}
          <span style={{ opacity: 0.25 }}>{"★".repeat(5 - t.rating)}</span>
        </span>
      )}
      <p className="max-w-[70ch] text-[15px]">{t.text}</p>
      {t.videoUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={t.videoUrl} controls preload="metadata" className="mt-1 max-h-72 w-auto rounded-[var(--radius-md)] border border-line" />
      )}
      <p className="text-sm text-ink-3">
        <strong className="font-medium text-ink-2">{t.author}</strong>
        {t.role ? `, ${t.role}` : ""}
      </p>
    </div>
  );
}
