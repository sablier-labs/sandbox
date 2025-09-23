/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    externalDir: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
