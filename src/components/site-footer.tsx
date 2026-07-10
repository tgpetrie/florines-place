import { TideLine } from "@/components/shore-art";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-sand-deep/40 bg-sand/25 px-6 py-12 text-center">
      <TideLine className="mb-6" />
      <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft">
        Florine&rsquo;s Place · Hood Canal, Washington
      </p>
      <p className="mt-4 text-xs text-driftwood">
        A shared family place, cared for together.
      </p>
    </footer>
  );
}
