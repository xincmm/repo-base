import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
  experimental: {
    reactCompiler: true,
  },
  serverExternalPackages: ["@llamaindex/env"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
      canvas$: false,
      jsdom$: false,
    };
    return config;
  },
};

export default nextConfig;
