import { SandDollar, TideLine } from "@/components/shore-art";

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
      <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[0.7rem] tracking-wide text-driftwood/70">
        <span>Built and Designed by Tom Petrie</span>
        <SandDollar className="h-3 w-3 text-driftwood/50" />
        <a
          href="https://tomstech.net"
          target="_blank"
          rel="noreferrer"
          className="text-driftwood/70 underline decoration-driftwood/30 underline-offset-2 hover:text-cedarwarm"
        >
          tomstech.net
        </a>
        <SandDollar className="h-3 w-3 text-driftwood/50" />
        <span>Guisan Design 2026</span>
      </p>
    </footer>
  );
}
