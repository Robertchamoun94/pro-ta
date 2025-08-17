// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.APP_URL || 'http://localhost:3000'],
    },
  },

  // Lägg till X-Robots-Tag i alla miljöer som inte är Production (Preview/Dev)
  async headers() {
    if (process.env.VERCEL_ENV !== 'production') {
      return [
        {
          source: '/:path*',
          headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
        },
      ];
    }
    // Production: inga extra headers
    return [];
  },
};

export default nextConfig;
