/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // For static exports if needed
  },
  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // For better deployment experience
  swcMinify: true,
  // Ensure proper handling of dynamic routes
  trailingSlash: false,
  pageExtensions: ['js', 'jsx'],
}

module.exports = nextConfig