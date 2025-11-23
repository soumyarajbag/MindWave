/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', 'i.ytimg.com', 'i.scdn.co', 'mosaic.scdn.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.scdn.co',
      },
    ],
  },
};

module.exports = nextConfig;
