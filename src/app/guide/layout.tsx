import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cabin Guide" };

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
