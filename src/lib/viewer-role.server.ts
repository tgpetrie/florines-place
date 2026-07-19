import "server-only";

import { supabaseAuthConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

/** The signed-in viewer's authoritative role, read from profiles.role. Never trusts client input. */
export async function getViewerRole(): Promise<Role> {
  if (!supabaseAuthConfigured()) return "guest";

  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (userError || !userId) return "guest";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role === "admin" || profile?.role === "family") return profile.role;
  return "guest";
}

/** The signed-in viewer's id and role together, for routes that need both (e.g. to stamp author_id). */
export async function getViewer(): Promise<{ id: string | null; role: Role }> {
  if (!supabaseAuthConfigured()) return { id: null, role: "guest" };

  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData.user?.id ?? null;
  if (userError || !userId) return { id: null, role: "guest" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const role: Role = profile?.role === "admin" || profile?.role === "family" ? profile.role : "guest";
  return { id: userId, role };
}
