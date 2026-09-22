import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export so the landing can be hosted as plain files for preview.
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
