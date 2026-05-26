/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@paracompanion/airlock", "@paracompanion/clinical", "@paracompanion/types"],
};

export default nextConfig;
