import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // 개발환경에서만 프록시 활성화
    if (process.env.NODE_ENV === 'development') {
      const targetUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      return [
        {
          source: '/api/:path*',
          destination: `${targetUrl}/:path*`
        }
      ];
    }
    return [];
  }
};

export default nextConfig;