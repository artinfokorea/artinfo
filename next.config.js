/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  reactStrictMode: true,
})

const nextConfig = {
  // experimental: {
  //   serverActions: true,
  // },
  images: {
    domains: ["ycuajmirzlqpgzuonzca.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ycuajmirzlqpgzuonzca.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 86400 * 30,
  },
  async rewrites() {
    return [
      {
        // source : 유저가 진입할 path
        // destination : 유저가 이동할 path
        source: "/",
        destination: "/home",
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/posts",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
