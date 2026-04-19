import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "splitwise.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
