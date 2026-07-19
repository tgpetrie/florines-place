import "server-only";

import { APP_MODE } from "@/lib/app-mode";
import { supabaseAuthConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

export interface AuthViewer {
  isAuthenticated: boolean;
  role: Role;
  email: string | null;
}

const signedOutViewer: AuthViewer = {
  isAuthenticated: false,
  role: "guest",
  email: null,
};

export async function getAuthViewer(): Promise<AuthViewer> {
  if (APP_MODE === "demo" || !supabaseAuthConfigured()) return signedOutViewer;

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const userId = typeof claims?.sub === "string" ? claims.sub : null;

  if (claimsError || !userId) return signedOutViewer;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const role: Role =
    profile?.role === "admin" || profile?.role === "family" ? profile.role : "guest";

  return {
    isAuthenticated: true,
    role,
    email: typeof claims?.email === "string" ? claims.email : null,
  };
}

export function safeNextPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value?.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
