import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "ui-avatars.com",
      },
      {
        hostname: "amzn-s3-eventia.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
