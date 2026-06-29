/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
    async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://file-management-system-ov73.onrender.com/api/:path*'
      }
    ];
  }
};

export default nextConfig;