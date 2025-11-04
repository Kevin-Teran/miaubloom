import withPWAInit from 'next-pwa';
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const withPWA = (withPWAInit as unknown as (config: { dest: string; disable: boolean; register: boolean; skipWaiting: boolean }) => (config: NextConfig) => NextConfig)({
  dest: 'public',
  disable: !isProd, 
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  // Deshabilitar prerendering estático para evitar problemas con dynamic pages
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  }
};

export default withPWA(nextConfig);