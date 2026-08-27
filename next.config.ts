import type { NextConfig } from "next";

/**
 * Map Vercel's system `VERCEL_ENV` into a public build-time value so the
 * client bundle can distinguish development / preview / production.
 */
const nextConfig: NextConfig = {
  // Keep repository docs intentional; do not auto-generate AGENTS.md / CLAUDE.md.
  agentRules: false,
  output: "export",
  env: {
    NEXT_PUBLIC_VERCEL_ENV:
      process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
  },
};

export default nextConfig;
