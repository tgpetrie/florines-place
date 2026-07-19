"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { APP_MODE } from "@/lib/app-mode";
import type { Role } from "@/lib/types";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  email: string | null;
}

const RoleContext = createContext<RoleContextValue>({
  role: "guest",
  setRole: () => {},
  isAuthenticated: false,
  email: null,
});

const STORAGE_KEY = "florines-place:role";

interface RoleProviderProps {
  children: ReactNode;
  initialRole?: Role;
  isAuthenticated?: boolean;
  email?: string | null;
}

export function RoleProvider({
  children,
  initialRole = "guest",
  isAuthenticated = false,
  email = null,
}: RoleProviderProps) {
  const [role, setRoleState] = useState<Role>(initialRole);

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

  return (
    <RoleContext.Provider value={{ role, setRole, isAuthenticated, email }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

export const roleLabels: Record<Role, string> = {
  guest: "Guest",
  family: "Family Owner",
  admin: "Admin",
};
