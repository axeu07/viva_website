import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the `out/` folder can be hosted anywhere (Netlify, Vercel, cPanel).
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // keep the dev badge clear of the day clock (bottom-left)
  devIndicators: { position: "bottom-right" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
