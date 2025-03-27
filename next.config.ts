import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // webpack: config => {
  //   config.externals.push("pino-pretty", "lokijs", "encoding");
  //   return config;
  // },
  images: {
    domains: ['example.com'],
  },
};

export default nextConfig;
