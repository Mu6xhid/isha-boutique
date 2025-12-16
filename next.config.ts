import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], //  ⬅️  whitelist Cloudinary
  },
};

export default nextConfig;
