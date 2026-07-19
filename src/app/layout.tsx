import type { Metadata } from "next";
import { Fraunces, Karla, Shadows_Into_Light } from "next/font/google";
import { RoleProvider } from "@/lib/role-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAuthViewer } from "@/lib/auth";
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

// Handwritten accent — used sparingly for personal/sentimental touches only.
const shadows = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand-src",
});

export const metadata: Metadata = {
  title: {
    default: "Florine's Place",
    template: "%s · Florine's Place",
  },
  description:
    "Our family cabin on Hood Canal — a shared place for rest, gathering, and low tides.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getAuthViewer();

  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable} ${shadows.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <RoleProvider
          initialRole={viewer.role}
          isAuthenticated={viewer.isAuthenticated}
          email={viewer.email}
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </RoleProvider>
      </body>
    </html>
  );
}
