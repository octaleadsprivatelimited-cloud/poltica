/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sarpanch-campaign/lib', '@sarpanch-campaign/ui'],
  images: {
    domains: ['localhost', 'supabase.co'],
  },
}

module.exports = nextConfig
