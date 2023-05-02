/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    disqusURL: 'http://block-explorer-five.vercel.app/',
    disqusName: 'your-disqus-shortname',
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = nextConfig
