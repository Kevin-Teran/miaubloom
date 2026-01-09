import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const withPWA = withPWAInit({
  dest: "public",
  disable: !isProd,
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  // Deshabilitar prerendering estático para evitar problemas con dynamic pages
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
};

export default withPWA(nextConfig);