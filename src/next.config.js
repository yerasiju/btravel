/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Настройка для разных платформ
  basePath: process.env.VERCEL
    ? ""
    : process.env.NODE_ENV === "production"
    ? "/btravel"
    : "",
  assetPrefix: process.env.VERCEL
    ? ""
    : process.env.NODE_ENV === "production"
    ? "/btravel/"
    : "",
};

module.exports = nextConfig;
