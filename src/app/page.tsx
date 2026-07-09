import Link from "next/link";
import { MoonlitShore, TideLine } from "@/components/shore-art";

export default function HomePage() {
  return (
    <>
      {/* Hero: the canal at night, minus tide */}
      <section className="relative overflow-hidden bg-night text-moon">
        <MoonlitShore className="absolute inset-0 h-full w-full text-moon/80" />
        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-40 text-center sm:pt-32 sm:pb-52">
          <p className="rise eyebrow !text-pearl/80">Hood Canal, Washington</p>
          <h1 className="rise mt-4 text-5xl leading-tight sm:text-7xl">
            Florine&rsquo;s Place
          </h1>
          <p className="rise-2 mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pearl">
            Our family cabin on the canal. A place for rest, gathering, quiet,
            and the kind of low tides you plan a whole summer around.
          </p>
          <div className="rise-3 mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/request" className="btn btn-primary !bg-moon !text-night hover:!bg-white">
              Request a Stay
            </Link>
            <Link href="/calendar" className="btn btn-quiet !border-moon/40 !text-moon hover:!bg-moon/10">
              View Calendar
            </Link>
          </div>
          <p className="rise-3 mt-8 text-sm italic text-pearl/70">
            The tide is out. The calendar is open.
          </p>
        </div>
      </section>

      {/* Who Florine was */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <p className="eyebrow text-center">Who Florine was</p>
        <h2 className="mt-3 text-center text-3xl text-night sm:text-4xl">
          She built this place. It still feels like her.
        </h2>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            Florine&rsquo;s Place is our family cabin on Hood Canal, built in the
            early 1980s by Florine, our great aunt and grandmother&rsquo;s sister.
            She is no longer here in body, but her presence is still felt in the
            quiet of the cabin, the water, the wood, the low tide, and the way
            this place gathers people.
          </p>
          <p>
            Everything here — the calendar, the pantry list, the guestbook — is
            just a way of taking care of what she started, and of each other.
          </p>
        </div>
      </section>

      <TideLine />

      {/* Shared place + cleaning fee */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <p className="eyebrow">A shared family place</p>
            <h3 className="mt-3 text-2xl text-night">Not a rental. Never a business.</h3>
            <p className="mt-4 leading-relaxed text-ink-soft">
              This cabin is not a rental. It is a shared family place. Staying
              here is free for approved family and friends. What we ask for
              instead of money is care: request your dates, follow the cabin
              guide, and leave the place ready for whoever arrives next.
            </p>
          </div>
          <div className="card p-8">
            <p className="eyebrow">The cleaning fee</p>
            <h3 className="mt-3 text-2xl text-night">$150, so everyone arrives to the same cabin.</h3>
            <p className="mt-4 leading-relaxed text-ink-soft">
              The standard $150 cleaning fee is not rent — it simply helps keep
              the cabin clean, peaceful, and ready for whoever arrives next. It
              protects fairness and consistency for everyone. The family can
              waive it for special circumstances.
            </p>
          </div>
        </div>

        <div className="card mt-6 bg-navy p-8 text-center text-moon sm:p-10">
          <h3 className="text-2xl">Everyone who uses the cabin helps care for it.</h3>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-pearl">
            Check the supply list before you go. Write in the guestbook when you
            leave. Tell the family if something breaks. That&rsquo;s the whole
            arrangement — this place is a shared inheritance, and it works
            because we all hold it gently.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/guide" className="btn btn-quiet !border-moon/40 !text-moon hover:!bg-moon/10">
              Read the Cabin Guide
            </Link>
            <Link href="/guestbook" className="btn btn-quiet !border-moon/40 !text-moon hover:!bg-moon/10">
              Open the Guestbook
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
