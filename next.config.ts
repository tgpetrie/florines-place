import type { NextConfig } from "next";
import path from "node:path";

// Fail closed: an unspecified production build is always the live, no-seed
// version. The demo deployment has to opt in explicitly.
const mode = process.env.NEXT_PUBLIC_APP_MODE === "demo" ? "demo" : "live";

const nextConfig: NextConfig = {
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
