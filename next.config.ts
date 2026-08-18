import type { NextConfig } from "next";

const backendUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: backendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrl.hostname,
        port: backendUrl.port,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: `${backendUrl.origin}/files/image/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
