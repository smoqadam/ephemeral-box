/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ephemeral-tools' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ephemeral-tools' : '',
}

module.exports = nextConfig