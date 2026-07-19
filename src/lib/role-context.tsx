"use client";

/**
 * Mock role switching.
 *
 * BACKEND NOTE: this whole file is the seam for Supabase Auth. When real
 * logins exist, replace RoleProvider's internals with the Supabase session
 * (role read from a `profiles` table) and delete the switcher UI. Every
 * component that calls `useRole()` keeps working unchanged.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { APP_MODE } from "@/lib/app-mode";
import type { Role } from "@/lib/types";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: "guest",
  setRole: () => {},
});

const STORAGE_KEY = "florines-place:role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("guest");

  // Restore the previously chosen role after mount (SSR-safe).
  useEffect(() => {
    if (APP_MODE !== "demo") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "guest" || saved === "family" || saved === "admin") {
      setRoleState(saved);
    }
  }, []);

  const setRole = (next: Role) => {
    if (APP_MODE !== "demo") return;
    setRoleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

export const roleLabels: Record<Role, string> = {
  guest: "Guest",
  family: "Family Owner",
  admin: "Admin",
};
