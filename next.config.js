/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: [
         'res.cloudinary.com',
         'lh3.googleusercontent.com',
         'static.nike.com'
      ]
   },
   // typescript: {
   //    ignoreBuildErrors: true
   // }
}

module.exports = nextConfig
