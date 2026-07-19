"use client";

import { useRef, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-sand-deep/70 bg-shell px-4 py-3 text-sm text-ink placeholder:text-driftwood/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

export interface OpenBoardComposerFields {
  posterName: string;
  contact: string;
  message: string;
  category?: string;
  image?: File | null;
}

interface CategoryOption {
  value: string;
  label: string;
}

/**
 * Shared open-post form for Porch Notes and the live Guestbook. No account
 * needed — just a name, a private contact (phone or email, for the family
 * to follow up privately if needed), a message, and an optional image.
 */
export function OpenBoardComposer<T>({
  categories,
  messagePlaceholder,
  submitLabel = "Post",
  onSubmit,
  onPosted,
}: {
  categories?: CategoryOption[];
  messagePlaceholder: string;
  submitLabel?: string;
  onSubmit: (fields: OpenBoardComposerFields) => Promise<T>;
  onPosted: (result: T) => void;
}) {
  const [posterName, setPosterName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState(categories?.[0]?.value ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function pickImage(file: File | null) {
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form
      className="space-y-3 px-5 py-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const trimmedName = posterName.trim();
        const trimmedContact = contact.trim();
        const trimmedMessage = message.trim();
        if (!trimmedName || !trimmedContact || !trimmedMessage) return;

        setSubmitting(true);
        setError("");
        try {
          const result = await onSubmit({
            posterName: trimmedName,
            contact: trimmedContact,
            message: trimmedMessage,
            category: categories ? category : undefined,
            image,
          });
          onPosted(result);
          setMessage("");
          pickImage(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "That couldn't be posted.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold text-navy">Your name</span>
          <input
            required
            value={posterName}
            onChange={(event) => setPosterName(event.target.value)}
            placeholder="First name, last initial — e.g. Kate P."
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-navy">Phone or email</span>
          <input
            required
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Private — for the family to reach you if needed"
            className={`mt-1 ${inputClass}`}
          />
        </label>
      </div>

      {categories && (
        <label className="block">
          <span className="text-xs font-bold text-navy">What kind of note is this?</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={`mt-1 ${inputClass}`}
          >
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <textarea
        required
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={3}
        maxLength={1000}
        placeholder={messagePlaceholder}
        className={inputClass}
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => pickImage(event.target.files?.[0] ?? null)}
          className="text-xs text-driftwood file:mr-3 file:rounded-full file:border-0 file:bg-sand/60 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-navy"
        />
        {imagePreview && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Attached preview" className="h-14 w-14 rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => pickImage(null)}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rust text-xs font-bold text-shell"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-rust">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !posterName.trim() || !contact.trim() || !message.trim()}
        className="btn btn-primary text-sm disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Posting…" : submitLabel}
      </button>
      <p className="text-xs text-driftwood">
        Your name and note are public. Your phone/email stays private — only the family can see it.
      </p>
    </form>
  );
}
