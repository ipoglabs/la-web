// next.config.ts
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or '20mb' if needed
    },
  },
};

export default nextConfig;
