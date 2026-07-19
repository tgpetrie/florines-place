"use client";

import { useState } from "react";
import Link from "next/link";
import { Lantern } from "@/components/shore-art";
import { submitAccessRequest } from "@/lib/access-requests-client";

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

export function AccessRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (submitted) {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <Lantern className="mx-auto h-12 w-10 text-rust" />
        <h2 className="mt-4 text-2xl text-heading">Your request has been sent.</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          A family admin will review it and reach out if they can set you up with an account.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-quiet">
            Back home
          </Link>
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
          await submitAccessRequest({
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            message: String(form.get("message") ?? ""),
          });
          setSubmitted(true);
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "The request could not be saved.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Field label="Your name">
        <input required name="name" className={inputClass} placeholder="Who's asking?" />
      </Field>
      <Field label="Email">
        <input required type="email" name="email" className={inputClass} placeholder="you@example.com" />
      </Field>
      <Field label="Anything the family should know">
        <textarea
          name="message"
          rows={3}
          className={inputClass}
          placeholder="How you're connected to the family, or why you're asking — optional"
        />
      </Field>

      {error && (
        <p className="rounded-xl border border-rust/35 bg-rust/10 px-4 py-3 text-sm font-semibold text-rust" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full text-lg" disabled={submitting}>
        {submitting ? "Sending…" : "Send Request"}
      </button>
      <p className="text-center text-xs text-driftwood">
        Accounts stay invite-only — this just lets a family admin know you're asking.
      </p>
    </form>
  );
}
