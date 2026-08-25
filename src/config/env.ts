/**
 * Validated environment configuration.
 *
 * Public values may be exposed to the browser via `NEXT_PUBLIC_*`.
 * Server-only values must never use that prefix and must not be imported
 * into Client Components.
 *
 * `NEXT_PUBLIC_VERCEL_ENV` is populated from Vercel's `VERCEL_ENV` in
 * `next.config.ts` so Client Components can distinguish preview vs production.
 */

export type AppEnvironment = "development" | "preview" | "production";

function resolveAppEnvironment(): AppEnvironment {
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

  if (vercelEnv === "production" || vercelEnv === "preview") {
    return vercelEnv;
  }

  if (vercelEnv === "development") {
    return "development";
  }

  if (process.env.NODE_ENV === "production") {
    return "production";
  }

  return "development";
}

function readOptionalPublicUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return value && value.length > 0 ? value : undefined;
}

const appEnvironment = resolveAppEnvironment();

/**
 * Public configuration safe for Client Components.
 * Derived only from `NEXT_PUBLIC_*` values.
 */
export const publicEnv = {
  appEnvironment,
  siteUrl: readOptionalPublicUrl(),
  isDevelopment: appEnvironment === "development",
  isPreview: appEnvironment === "preview",
  isProduction: appEnvironment === "production",
} as const;

/**
 * Server-only configuration. Import from Server Components, Route Handlers,
 * or other server modules only. Extend here when secrets are genuinely required.
 */
export const serverEnv = {
  appEnvironment,
} as const;
