"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRole, roleLabels } from "@/lib/role-context";
import { Lantern } from "@/components/shore-art";
import type { Role } from "@/lib/types";

const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/calendar", label: "Calendar" },
  { href: "/request", label: "Request a Stay" },
  { href: "/dashboard", label: "Family Dashboard" },
  { href: "/supplies", label: "Supplies" },
  { href: "/ideas", label: "Ideas" },
];

/** Grouped under "Guide" so the header stays calm as pages grow. */
const guideNav = [
  { href: "/guide", label: "Cabin Guide" },
  { href: "/local", label: "Tides, Weather & Nearby" },
  { href: "/guestbook", label: "Guestbook" },
];

const allNav = [...primaryNav, ...guideNav];

export function SiteHeader() {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const linkClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
      active ? "bg-navy text-moon" : "text-ink-soft hover:bg-sand/50 hover:text-ink"
    }`;

  const inGuide = guideNav.some((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-sand-deep/40 bg-oyster/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Lantern className="h-7 w-6 text-rust" />
          <span className="font-display text-xl text-night" style={{ fontFamily: "var(--font-display)" }}>
            Florine&rsquo;s Place
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(pathname === item.href)}>
              {item.label}
            </Link>
          ))}

          {/* Guide dropdown */}
          <div className="relative">
            <button
              type="button"
              className={`${linkClass(inGuide)} flex items-center gap-1`}
              aria-expanded={guideOpen}
              aria-haspopup="true"
              onClick={() => setGuideOpen((v) => !v)}
            >
              Guide
              <svg viewBox="0 0 10 6" className="h-1.5 w-2.5" fill="none" aria-hidden="true">
                <path d="M1 1 L5 5 L9 1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            {guideOpen && (
              <>
                {/* click-away backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setGuideOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-sand-deep/50 bg-shell p-2 shadow-lg">
                  {guideNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setGuideOpen(false)}
                      className={`block rounded-xl px-3.5 py-2.5 text-sm font-bold ${
                        pathname === item.href ? "bg-navy text-moon" : "text-ink hover:bg-sand/50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <RolePicker role={role} setRole={setRole} />
          <button
            type="button"
            className="btn-quiet btn !px-3 !py-1.5 text-sm lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-sand-deep/40 bg-oyster px-4 py-3 lg:hidden" aria-label="Main mobile">
          <ul className="grid grid-cols-2 gap-1">
            {allNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-base font-bold ${
                    pathname === item.href ? "bg-navy text-moon" : "text-ink hover:bg-sand/50"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

/**
 * Mock role switcher. BACKEND NOTE: disappears once Supabase Auth provides a
 * real role per login — see src/lib/role-context.tsx.
 */
function RolePicker({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <label className="flex items-center gap-1.5 rounded-full border border-sand-deep/60 bg-shell px-2.5 py-1.5">
      <span className="hidden text-[0.68rem] font-bold uppercase tracking-wider text-driftwood sm:inline">
        Viewing as
      </span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="bg-transparent text-sm font-bold text-navy outline-none"
        aria-label="Switch role (mock)"
      >
        {(Object.keys(roleLabels) as Role[]).map((r) => (
          <option key={r} value={r}>
            {roleLabels[r]}
          </option>
        ))}
      </select>
    </label>
  );
}
