import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/storage/**",
      },
    ],
  },
  // 👈 အောက်က rewrites block ကို အသစ်ထပ်ဖြည့်ပေးပါ
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: "http://localhost:4000/storage/:path*", // Port 3000 ကလာတဲ့ storage request တွေကို 4000 ဆီ လွှဲပေးမယ်
      },
    ];
  },
};

export default nextConfig;
