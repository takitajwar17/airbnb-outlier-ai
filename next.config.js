/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         { hostname: "avatars.githubusercontent.com" },
         { hostname: "lh3.googleusercontent.com" },
         { hostname: "res.cloudinary.com" },
         { hostname: "images.unsplash.com" },
         { hostname: "source.unsplash.com" }
      ],
   },
};

module.exports = nextConfig;
