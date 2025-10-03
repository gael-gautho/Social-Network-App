import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },{
        protocol: "https",
        hostname: "social-network-app-on3v.onrender.com",
      },
    ],
  }


};

export default nextConfig;
