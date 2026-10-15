import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so this deploys to Cloudflare Pages as plain files.
  // No @cloudflare/next-on-pages adapter (Edge-runtime only, breaks on
  // Next 15/16), no beta vinext. See README "Deploying" for the reasoning.
  output: "export",
  images: {
    // The static exporter has no image optimisation server.
    unoptimized: true,
  },
  // `output: 'export'` renders every route at build time, so there is no
  // in-memory cache to lean on and these two add nothing but friction.
  cacheComponents: false,
  partialPrefetching: false,
};

export default nextConfig;