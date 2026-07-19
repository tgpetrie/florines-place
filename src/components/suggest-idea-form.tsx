"use client";

import { useState } from "react";
import Link from "next/link";
import { Lantern } from "@/components/shore-art";
import { suggestIdea } from "@/lib/ideas-client";

const inputClass =
  "w-full rounded-xl border border-sand-deep/70 bg-shell px-4 py-3 text-base text-ink placeholder:text-driftwood/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

const labelClass = "block text-sm font-bold text-navy";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function SuggestIdeaForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (submitted) {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <Lantern className="mx-auto h-12 w-10 text-rust" />
        <h2 className="mt-4 text-2xl text-heading">Your idea has been sent.</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          It's on the family's board now, for them to think about.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-quiet">Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="card mx-auto max-w-xl space-y-5 p-6 sm:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");
        const form = new FormData(event.currentTarget);
        try {
          await suggestIdea({
            title: String(form.get("title") ?? ""),
            description: String(form.get("description") ?? ""),
            posterName: String(form.get("posterName") ?? ""),
            contact: String(form.get("contact") ?? ""),
          });
          setSubmitted(true);
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "The idea could not be saved.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Field label="Idea title">
        <input required name="title" className={inputClass} placeholder="What's the idea?" />
      </Field>
      <Field label="Tell us more">
        <textarea name="description" rows={4} className={inputClass} placeholder="Optional — as much detail as you'd like" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name">
          <input required name="posterName" className={inputClass} placeholder="First name, last initial" />
        </Field>
        <Field label="Phone or email">
          <input required name="contact" className={inputClass} placeholder="Private — for the family only" />
        </Field>
      </div>

      {error && (
        <p className="rounded-xl border border-rust/35 bg-rust/10 px-4 py-3 text-sm font-semibold text-rust" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full text-lg" disabled={submitting}>
        {submitting ? "Sending…" : "Suggest this idea"}
      </button>
      <p className="text-center text-xs text-driftwood">
        Your name and idea are visible to the family. Your phone/email stays private.
      </p>
    </form>
  );
}
