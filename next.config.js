const withPWA = require("next-pwa")
const { withSentryConfig } = require("@sentry/nextjs")
const isProduction = process.env.NODE_ENV === "production"

/** @type {import('next').NextConfig} */
const config = {
  // experimental: {
  //   serverActions: true,
  // },
  images: {
    domains: ["ycuajmirzlqpgzuonzca.supabase.co", "www.sac.or.kr"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ycuajmirzlqpgzuonzca.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // async rewrites() {
  //   return [
  //     {
  //       // source : 유저가 진입할 path
  //       // destination : 유저가 이동할 path
  //       source: "/",
  //       destination: "/home",
  //     },
  //   ]
  // },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/posts",
  //       permanent: true,
  //     },
  //   ]
  // },
}
const nextConfig = withPWA({
  dest: "public",
  disable: !isProduction,
  runtimeCaching: [],
})(config)

module.exports = nextConfig

// Injected content via Sentry wizard below

module.exports = withSentryConfig(
  module.exports,
  {
    silent: true,
    org: "artinfo",
    project: "javascript-nextjs",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  },
)
