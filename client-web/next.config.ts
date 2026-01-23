import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ==========================================
  // STATIC EXPORT (for pure static hosting)
  // ==========================================
  output: 'export',

  // ==========================================
  // TYPESCRIPT BUILD ERROR BYPASS
  // ==========================================
  typescript: {
    ignoreBuildErrors: true,
  },

  // ==========================================
  // TURBOPACK CONFIG (Next.js 16+ default)
  // ==========================================
  turbopack: {
    // Empty config to acknowledge Turbopack usage
  },

  // ==========================================
  // IMAGES CONFIGURATION (Static Export)
  // ==========================================
  images: {
    // Unoptimized for static export
    unoptimized: true,
  },

  // ==========================================
  // EXPERIMENTAL FEATURES
  // ==========================================
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
    ],
  },

  // ==========================================
  // OTHER SETTINGS
  // ==========================================

  // Strict mode for React
  reactStrictMode: true,

  // Powered by header (disable for security)
  poweredByHeader: false,

  // Trailing slash for static hosting
  trailingSlash: true,

  // Enable compression
  compress: true,
};

export default nextConfig;
