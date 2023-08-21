/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const fs = require('fs')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const getCommitShaShort = () => {
  let sha = ''

  try {
    const rev = fs.readFileSync('.git/HEAD').toString().trim()
    if (rev.indexOf(':') === -1) {
      sha = rev
    } else {
      sha = fs.readFileSync('.git/' + rev.substring(5))
    }
  } catch (e) {
    sha = fs.readFileSync('.git/refs/remotes/origin/main')
  }

  return sha.toString().trim().slice(0, 7)
}

const nextConfig = {
  output: 'standalone',
  env: {
    pollInterval: 6000,
  },
  reactStrictMode: true,
  webpack: (config, { webpack, buildId }) => {
    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    )

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
  generateBuildId: getCommitShaShort,
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

module.exports = withBundleAnalyzer(nextConfig)
