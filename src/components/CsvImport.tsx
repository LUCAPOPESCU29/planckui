"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "./Toaster";

/* One-per-line: Name | Role | Rating | Text. Role and rating optional.
   Imported items land approved — the owner is vouching for them. */
export function CsvImport({ collectionId }: { collectionId: string }) {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch(`/api/collections/${collectionId}/import`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ csv }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast(data.error || "Import failed.");
      return;
    }
    toast(`Imported ${data.added} testimonial${data.added === 1 ? "" : "s"}`);
    setCsv("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
        Import past praise
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="card w-full max-w-2xl p-5">
      <p className="text-sm text-ink-2">
        One testimonial per line:
        <span className="ml-2 font-mono text-xs text-ink-3">Name | Role | Rating | Text</span>
      </p>
      <textarea
        className="textarea mt-3 font-mono text-xs"
        rows={5}
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        placeholder={"Maya Okafor | Founder, Fern & Co. | 5 | Replaced a paid tool in one afternoon.\nTomás Rivera | Bike shop | 5 | Customers mention my reviews now."}
        aria-label="Testimonials to import"
      />
      <div className="mt-3 flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !csv.trim()}>
          {busy ? "Importing…" : "Import as approved"}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
      <p className="mt-3 text-xs text-ink-3">
        Imports skip the inbox — you are vouching for these yourself.
      </p>
    </form>
  );
}
