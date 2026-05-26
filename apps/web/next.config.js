import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@paracompanion/clinical", "@paracompanion/airlock", "@paracompanion/strings", "@paracompanion/doc-logic", "@paracompanion/types"],
};

export default withPWA(nextConfig);
