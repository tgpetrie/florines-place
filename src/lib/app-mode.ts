export type AppMode = "demo" | "live";

export const APP_MODE: AppMode =
  process.env.NEXT_PUBLIC_APP_MODE === "live" ? "live" : "demo";

export const IS_DEMO = APP_MODE === "demo";

export const DEMO_START_MONTH =
  process.env.NEXT_PUBLIC_DEMO_START_MONTH?.match(/^\d{4}-\d{2}$/)?.[0] ?? "2026-07";
