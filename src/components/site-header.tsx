"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRole, roleLabels } from "@/lib/role-context";
import { Lantern } from "@/components/shore-art";
import { APP_MODE } from "@/lib/app-mode";
import type { Role } from "@/lib/types";
import { signOut } from "@/app/auth/actions";

/**
 * Four primary areas, each opening a hover dropdown for its subpages (no
 * chevron). Request a Stay lives under Availability; Supplies & Ideas under
 * Family Dashboard; the field guide, tides, nearby, fishing and guestbook
 * under Guide. No route was removed — the top bar just got calmer.
 */
interface NavItem {
  label: string;
  href: string;
  match: string[];
  items?: { href: string; label: string }[];
}

const nav: NavItem[] = [
  { label: "Home", href: "/", match: ["/"] },
  {
    label: "Availability",
    href: "/calendar",
    match: ["/calendar", "/request"],
    items: [
      { href: "/calendar", label: "Calendar" },
      { href: "/request", label: "Request a Stay" },
    ],
  },
  {
    label: "Family Dashboard",
    href: "/dashboard",
    match: ["/dashboard", "/supplies", "/ideas"],
    items: [
      { href: "/dashboard", label: "Overview" },
      { href: "/supplies", label: "Supplies" },
      { href: "/ideas", label: "Ideas" },
    ],
  },
  {
    label: "Guide",
    href: "/guide",
    match: ["/guide", "/local", "/guestbook"],
    items: [
      { href: "/guide", label: "Cabin Guide" },
      { href: "/local#conditions", label: "Tides & Weather" },
      { href: "/local#stops", label: "Nearby" },
      { href: "/local#harvest", label: "Fishing & Shellfish" },
      { href: "/guestbook", label: "Guestbook" },
    ],
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { role, setRole, isAuthenticated, email } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-sandshadow/40 bg-oyster/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <Lantern className="h-7 w-6 text-cedarwarm" />
          <span className="text-xl text-heading" style={{ fontFamily: "var(--font-display)" }}>
            Florine&rsquo;s Place
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) => {
            const active = item.match.includes(pathname);
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
                onFocusCapture={() => setHovered(item.label)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setHovered(null);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setHovered(null);
                    event.currentTarget.querySelector<HTMLAnchorElement>("a")?.focus();
                  }
                }}
              >
                <Link
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                    active ? "bg-canaldeep text-oyster" : "text-ink-soft hover:bg-wetsand/50 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
                {item.items && hovered === item.label && (
                  <div className="absolute left-0 top-full z-50 w-52 pt-2">
                    <div className="rounded-2xl border border-sandshadow/50 bg-oystercard p-2 shadow-lg">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-wetsand/50"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {APP_MODE === "demo" && <RolePicker role={role} setRole={setRole} />}
          {APP_MODE === "live" && (
            isAuthenticated ? (
              <form action={signOut} className="hidden items-center gap-2 sm:flex">
                {email && (
                  <span className="max-w-40 truncate text-xs text-driftwood" title={email}>
                    {email}
                  </span>
                )}
                <button
                  type="submit"
                  className="rounded-full border border-sandshadow/60 bg-oystercard px-3 py-1.5 text-sm font-semibold text-canaldeep hover:bg-wetsand/50"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-sandshadow/60 bg-oystercard px-3 py-1.5 text-sm font-semibold text-canaldeep hover:bg-wetsand/50"
              >
                Family sign in
              </Link>
            )
          )}
          <button
            type="button"
            className="rounded-full border-2 border-canal/40 px-3 py-1.5 text-sm font-semibold text-canaldeep lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-sandshadow/40 bg-oyster px-4 py-3 lg:hidden"
          aria-label="Main mobile"
        >
          {nav.map((item) => (
            <div key={item.label} className="mb-2">
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-base font-semibold ${
                  item.match.includes(pathname) ? "bg-canaldeep text-oyster" : "text-ink hover:bg-wetsand/50"
                }`}
              >
                {item.label}
              </Link>
              {item.items && (
                <ul className="mt-1 grid grid-cols-2 gap-1 pl-3">
                  {item.items
                    .filter((sub) => sub.href !== item.href)
                    .map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-wetsand/50 hover:text-ink"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
          {APP_MODE === "live" && isAuthenticated && (
            <form action={signOut} className="mt-3 border-t border-sandshadow/40 pt-3 sm:hidden">
              <button type="submit" className="block w-full rounded-lg px-3 py-2.5 text-left font-semibold text-rust">
                Sign out{email ? ` · ${email}` : ""}
              </button>
            </form>
          )}
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
    <label className="flex items-center gap-1.5 rounded-full border border-sandshadow/60 bg-oystercard px-2.5 py-1.5">
      <span className="label hidden sm:inline">Viewing as</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="bg-transparent text-sm font-semibold text-canaldeep outline-none"
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
