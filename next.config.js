/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove serverActions if present
  },
  images: {
    domains: [],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
