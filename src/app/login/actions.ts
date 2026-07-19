"use server";

import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/auth";
import { supabaseAuthConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  if (!supabaseAuthConfigured()) {
    return { error: "Family sign-in is not connected to a Supabase project yet." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "That email and password did not match a family account." };

  redirect(next);
}
