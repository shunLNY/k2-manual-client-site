import type { NextConfig } from "next";

const getBackendUrl = () => {
  const fallbackUrl = "https://k2-manual-backend-black.vercel.app";
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || fallbackUrl;

  try {
    return new URL(configuredUrl);
  } catch {
    return new URL(fallbackUrl);
  }
};

const backendUrl = getBackendUrl();

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
