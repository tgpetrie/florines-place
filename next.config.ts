import type { NextConfig } from "next";
import path from "node:path";

const mode = process.env.NEXT_PUBLIC_APP_MODE === "live" ? "live" : "demo";

const nextConfig: NextConfig = {
  distDir: mode === "live" ? ".next-live" : ".next-demo",
  webpack(config) {
    const implementation = path.resolve(
      process.cwd(),
      mode === "demo" ? "src/lib/reservations-client.demo.ts" : "src/lib/reservations-client.ts",
    );
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/lib/reservations-client$": implementation,
      [path.resolve(process.cwd(), "src/lib/reservations-client.ts")]: implementation,
    };
    return config;
  },
};

export default nextConfig;
