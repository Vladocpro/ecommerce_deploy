/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      // remotePatterns replaces the deprecated `domains` and only allows HTTPS
      remotePatterns: [
         {protocol: 'https', hostname: 'res.cloudinary.com'},
         {protocol: 'https', hostname: 'lh3.googleusercontent.com'},
         {protocol: 'https', hostname: 'static.nike.com'},
      ]
   }
}

module.exports = nextConfig
