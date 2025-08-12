import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  trailingSlash: true,
  async rewrites() {
    // Only use rewrites in development to avoid CORS issues
    if (process.env.NODE_ENV === 'development') {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      // Remove /api from the end if it exists since we'll add it in the destination
      const baseUrl = apiUrl.replace('/api', '');
      
      return [
        {
          source: '/api/:path*',
          destination: `${baseUrl}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
