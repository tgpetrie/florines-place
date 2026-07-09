"use client";

import { useState } from "react";
import Link from "next/link";
import { Lantern } from "@/components/shore-art";

/**
 * Mock stay request form.
 *
 * BACKEND NOTE: on submit, this will insert a row into a Supabase
 * `stay_requests` table (status "pending") via a server action, and notify
 * the family. For now it just shows the confirmation state.
 */

const inputClass =
  "w-full rounded-xl border border-sand-deep/70 bg-shell px-4 py-3 text-base text-ink placeholder:text-driftwood/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

const labelClass = "block text-sm font-bold text-navy";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-driftwood">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function StayRequestForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <Lantern className="mx-auto h-12 w-10 text-rust" />
        <h2 className="mt-4 text-2xl text-night">Your stay request has been sent.</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Please wait for family approval before making firm plans. When the
          family approves, the lantern is lit — you&rsquo;ll hear back soon.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/calendar" className="btn btn-quiet">
            View Calendar
          </Link>
          <button type="button" className="btn btn-primary" onClick={() => setSubmitted(false)}>
            Request another stay
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="card mx-auto max-w-xl space-y-5 p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault(); // mock behavior — no data leaves the page yet
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input required name="name" className={inputClass} placeholder="Who's asking?" />
        </Field>
        <Field label="Email or phone">
          <input required name="contact" className={inputClass} placeholder="How to reach you" />
        </Field>
        <Field label="Arrival date">
          <input required type="date" name="arrival" className={inputClass} />
        </Field>
        <Field label="Departure date">
          <input required type="date" name="departure" className={inputClass} />
        </Field>
      </div>

      <Field label="Number of guests">
        <input
          required
          type="number"
          name="guests"
          min={1}
          max={12}
          defaultValue={2}
          className={inputClass}
        />
      </Field>

      <Field label="Who is coming?" hint="Names help the family picture the stay.">
        <input required name="party" className={inputClass} placeholder="e.g. Carol, Jim, and the dog" />
      </Field>

      <Field label="Any pets?">
        <input name="pets" className={inputClass} placeholder="Leave blank if none" />
      </Field>

      <Field label="Reason for stay / note to family">
        <textarea
          name="note"
          rows={3}
          className={inputClass}
          placeholder="A quiet weekend? Chasing a minus tide? Tell the family a little about the trip."
        />
      </Field>

      <Field
        label="Special circumstances"
        hint="Anything the family should know — including if you'd like to ask about the cleaning fee."
      >
        <textarea name="special" rows={2} className={inputClass} placeholder="Optional" />
      </Field>

      <div className="space-y-4 rounded-xl bg-sand/30 p-5">
        <label className="flex items-start gap-3">
          <input required type="checkbox" name="feeAck" className="mt-1 h-5 w-5 accent-[#22334e]" />
          <span className="text-sm leading-relaxed text-ink">
            I understand that Florine&rsquo;s Place is free to use, and that the
            standard $150 cleaning fee helps keep the cabin clean, peaceful, and
            ready for everyone.
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input required type="checkbox" name="guideAck" className="mt-1 h-5 w-5 accent-[#22334e]" />
          <span className="text-sm leading-relaxed text-ink">
            I&rsquo;ve read the{" "}
            <Link href="/guide" className="font-bold text-navy underline underline-offset-2">
              cabin expectations
            </Link>{" "}
            and will leave the cabin ready for the next person.
          </span>
        </label>
      </div>

      <button type="submit" className="btn btn-primary w-full text-lg">
        Send Request to the Family
      </button>
      <p className="text-center text-xs text-driftwood">
        Requests go to the family for approval. Nothing is firm until you hear back.
      </p>
    </form>
  );
}
