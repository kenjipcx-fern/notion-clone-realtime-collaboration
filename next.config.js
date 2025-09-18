/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // App router is enabled by default in Next.js 14
  },
  images: {
    domains: ['images.unsplash.com', 'avatar.githubusercontent.com'],
  },
  // Enable webpack optimizations
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
