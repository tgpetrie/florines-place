import "server-only";

import { createClient } from "@supabase/supabase-js";

export function liveReservationsConfigured() {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SECRET_KEY?.trim());
}

export function createSupabaseAdmin() {
  const url = process.env.SUPABASE_URL?.trim();
  const secret = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !secret) throw new Error("Live Supabase reservations are not configured.");

  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { "X-Client-Info": "florines-place-live-server" } },
  });
}
