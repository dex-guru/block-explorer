/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextBuildId = require('next-build-id')

const nextConfig = {
  output: 'standalone',
  env: {
    disqusURL: 'http://block-explorer-five.vercel.app/',
    disqusName: 'your-disqus-shortname',
    pollInterval: 6000,
    gTagManagerId: 'GTM-K8HGVLW',
  },
  reactStrictMode: true,
  webpack: (config, { webpack, buildId }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.GIT_COMMIT': JSON.stringify(buildId),
      })
    )
    config.resolve.fallback = { fs: false, net: false, tls: false }

    return config
  },
  images: {
    domains: [
      'assets-stage.dex.guru',
      'assets.dex.guru',
      'gravatar.com',
      'www.gravatar.com',
    ],
  },
  generateBuildId: () => nextBuildId.sync({ dir: __dirname }).slice(0, 7),
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|js|css)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
