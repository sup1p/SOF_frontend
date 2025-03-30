/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
  images: {
    domains: ['localhost', 'v0.blob.com', 'aenacihkjsxjdpkeqxja.supabase.co'],
  },
};

export default nextConfig;
