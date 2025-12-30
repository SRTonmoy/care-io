/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // For static export or local images
  },
  experimental: {
    reactCompiler: true,
  },
}

export default nextConfig