import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // Configure rewrites to proxy API requests to the FastAPI backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1/8000/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
