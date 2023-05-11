/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    explorerName: 'Canto Explorer',
    disqusURL: 'http://block-explorer-five.vercel.app/',
    disqusName: 'your-disqus-shortname',
    pollInterval: 6000,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    gTagManagerId: 'GTM-K8HGVLW',
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets-stage.dex.guru',
        port: '',
        pathname: '/icons/**',
      },
    ],
  },
}

module.exports = nextConfig
