export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="rise mx-auto max-w-3xl px-6 pt-14 pb-10 text-center sm:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-4xl text-night sm:text-5xl">{title}</h1>
      {lede && <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{lede}</p>}
    </header>
  );
}
