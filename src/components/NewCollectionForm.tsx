"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewCollectionForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setBusy(false);
    if (res.ok) {
      const data = await res.json();
      setName("");
      router.push(`/dashboard/collections/${data.collection.id}`);
    }
  }

  return (
    <form onSubmit={submit} className={`flex gap-2 ${compact ? "" : "max-w-md"}`}>
      <input
        className="input"
        placeholder="New collection name — e.g. Workshop customers"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={60}
        aria-label="Collection name"
      />
      <button type="submit" className="btn btn-primary whitespace-nowrap" disabled={busy || !name.trim()}>
        Create
      </button>
    </form>
  );
}
