import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { PageHeader } from "@/components/page-header";
import { getAuthViewer, safeNextPath } from "@/lib/auth";
import { APP_MODE } from "@/lib/app-mode";
import { supabaseAuthConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Family Sign In" };

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (APP_MODE === "demo") redirect("/");

  const params = await searchParams;
  const next = safeNextPath(params.next);
  const viewer = await getAuthViewer();

  if (viewer.isAuthenticated && (viewer.role === "family" || viewer.role === "admin")) {
    redirect(next);
  }

  const configured = supabaseAuthConfigured();

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Family entrance"
        title="Come on in"
        lede="Sign in with the account the family shared with you."
      />
      <div className="mx-auto max-w-md px-4 sm:px-6">
        {!configured && (
          <p className="mb-5 rounded-xl border border-rust/25 bg-rust/8 px-4 py-3 text-sm text-rust">
            Supabase Auth still needs a publishable key, and a project URL if the server is not already using `SUPABASE_URL`, before family sign-in can open.
          </p>
        )}
        {params.error === "family_only" && (
          <p className="mb-5 rounded-xl border border-rust/25 bg-rust/8 px-4 py-3 text-sm text-rust">
            This account has not been given family access yet.
          </p>
        )}
        {params.error === "confirmation_failed" && (
          <p className="mb-5 rounded-xl border border-rust/25 bg-rust/8 px-4 py-3 text-sm text-rust">
            That sign-in link is invalid or has expired. Ask a family admin for a new invitation.
          </p>
        )}
        <LoginForm next={next} />
        <p className="mt-5 text-center text-sm text-driftwood">
          Accounts are invite-only.{" "}
          <Link href="/request-access" className="font-semibold text-link">
            Request access
          </Link>{" "}
          or ask a family admin for a password reset.
        </p>
      </div>
    </div>
  );
}
