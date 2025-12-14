import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  
  // Proxy API requests to avoid CORS issues in development
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://nestjs-amparado-ace-1.onrender.com/:path*',
      },
    ];
  },
  
  // Headers for CORS (in case proxy doesn't work)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
