import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@aynyoutube/types', '@aynyoutube/config'],
};

export default nextConfig;
