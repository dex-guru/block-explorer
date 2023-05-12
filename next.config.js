/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  env: {
    explorerName: 'Canto Explorer',
    disqusURL: 'http://block-explorer-five.vercel.app/',
    disqusName: 'your-disqus-shortname',
    pollInterval: 6000,
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
