import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import { RoleProvider } from "@/lib/role-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
});

export const metadata: Metadata = {
  title: {
    default: "Florine's Place",
    template: "%s · Florine's Place",
  },
  description:
    "Our family cabin on Hood Canal — a shared place for rest, gathering, and low tides. Not a rental. Never a business.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <RoleProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </RoleProvider>
      </body>
    </html>
  );
}
