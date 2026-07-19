"use client";

import { useState } from "react";
import Link from "next/link";
import { Lantern } from "@/components/shore-art";
import { APP_MODE } from "@/lib/app-mode";
import { submitStayRequest } from "@/lib/reservations-client";

/**
 * One request form for both builds. Demo writes to isolated browser storage;
 * live writes through the validated server route to Supabase.
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

export function StayRequestForm({
  initialArrival = "",
  initialDeparture = "",
  minimumDate,
}: {
  initialArrival?: string;
  initialDeparture?: string;
  minimumDate: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (submitted) {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <Lantern className="mx-auto h-12 w-10 text-rust" />
        <h2 className="mt-4 text-2xl text-heading">Your stay request has been sent.</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {APP_MODE === "demo"
            ? "The request now appears on this browser’s demo calendar. It will stay separate from the live family calendar."
            : "Please wait for family approval before making firm plans. When the family approves, the lantern is lit — you’ll hear back soon."}
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
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");
        const form = new FormData(event.currentTarget);
        try {
          await submitStayRequest({
            name: String(form.get("name") ?? ""),
            contact: String(form.get("contact") ?? ""),
            arrival: String(form.get("arrival") ?? ""),
            departure: String(form.get("departure") ?? ""),
            guestCount: Number(form.get("guests")),
            party: String(form.get("party") ?? ""),
            pets: String(form.get("pets") ?? ""),
            note: String(form.get("note") ?? ""),
            specialCircumstances: String(form.get("special") ?? ""),
            feeAcknowledged: form.get("feeAck") === "on",
            guideAcknowledged: form.get("guideAck") === "on",
          });
          setSubmitted(true);
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "The stay request could not be saved.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="flex items-center justify-between gap-3 rounded-xl bg-foam/55 px-4 py-3">
        <p className="text-sm font-bold text-heading-strong">
          {APP_MODE === "demo" ? "Demo request" : "Live family request"}
        </p>
        <span className="text-xs text-driftwood">
          {APP_MODE === "demo" ? "Browser-local" : "Shared calendar"}
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input required name="name" className={inputClass} placeholder="Who's asking?" />
        </Field>
        <Field label="Email or phone">
          <input required name="contact" className={inputClass} placeholder="How to reach you" />
        </Field>
        <Field label="Arrival date">
          <input required type="date" name="arrival" min={minimumDate} defaultValue={initialArrival} className={inputClass} />
        </Field>
        <Field label="Departure date">
          <input required type="date" name="departure" min={minimumDate} defaultValue={initialDeparture} className={inputClass} />
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
          <input required type="checkbox" name="feeAck" className="mt-1 h-5 w-5 accent-navy" />
          <span className="text-sm leading-relaxed text-ink">
            I understand that Florine&rsquo;s Place is free to use, and that the
            standard $150 cleaning fee helps keep the cabin clean, peaceful, and
            ready for everyone.
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input required type="checkbox" name="guideAck" className="mt-1 h-5 w-5 accent-navy" />
          <span className="text-sm leading-relaxed text-ink">
            I&rsquo;ve read the{" "}
            <Link href="/guide" className="text-link font-bold">
              cabin expectations
            </Link>{" "}
            and will leave the cabin ready for the next person.
          </span>
        </label>
      </div>

      {error && (
        <p className="rounded-xl border border-rust/35 bg-rust/10 px-4 py-3 text-sm font-semibold text-rust" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full text-lg" disabled={submitting}>
        {submitting ? "Checking dates…" : "Send Request to the Family"}
      </button>
      <p className="text-center text-xs text-driftwood">
        {APP_MODE === "demo"
          ? "Filled demo dates are protected from overlap; open dates can be requested."
          : "Requests go to the family for approval. Nothing is firm until you hear back."}
      </p>
    </form>
  );
}
