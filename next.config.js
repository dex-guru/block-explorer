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
      {
        protocol: 'https',
        hostname: 'assets.dex.guru',
        port: '',
        pathname: '/icons/**',
      },
    ],
  },
  generateBuildId: () => nextBuildId({ dir: __dirname }),
}

module.exports = nextConfig
