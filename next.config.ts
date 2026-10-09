import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @resvg/resvg-js ships a native binding that Turbopack can't bundle into
  // an ESM chunk — runs via Node's own require() at runtime instead.
  serverExternalPackages: ["@resvg/resvg-js"],
};

export default nextConfig;
