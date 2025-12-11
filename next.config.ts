import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/product-pricing-app',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
