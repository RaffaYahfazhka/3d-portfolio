const plugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withOffline = require('next-offline')

/** === Tambahan: flag & helper untuk mode export (GH Pages) === */
const isExport = process.env.EXPORT === 'true' // konsisten dengan i18n gate-mu
const repo = process.env.REPO_NAME || ''       // isi di workflow (nama repo)
const explicitBase = process.env.BASE_PATH || '' // opsional override, mis. "/my-repo"
const basePath = isExport ? (explicitBase || (repo ? `/${repo}` : '')) : ''
const assetPrefix = isExport ? `${basePath}/` : ''

const nextConfig = {
  /** === Tambahan aman untuk debugging prod crash === */
  productionBrowserSourceMaps: true,

  /** === Tambahan: konfigurasi khusus saat EXPORT === */
  ...(isExport
    ? {
        output: 'export',                 // hasil ke folder out/
        images: { unoptimized: true },    // wajib untuk static export
        trailingSlash: true,              // aman untuk GH Pages
        basePath,
        assetPrefix,
      }
    : {}),

  webpack(config, { isServer }) {
    // audio support (tetap, tidak diubah)
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    })

    // shader support (tetap, tidak diubah)
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })

    return config
  },
}

/** manage i18n (tetap) */
if (process.env.EXPORT !== 'true') {
  nextConfig.i18n = {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  }
}

module.exports = plugins(
  [
    [
      withOffline,
      {
        workboxOpts: {
          swDest: process.env.NEXT_EXPORT
            ? 'service-worker.js'
            : 'static/service-worker.js',
          runtimeCaching: [
            {
              urlPattern: /^https?.*/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'offlineCache',
                expiration: {
                  maxEntries: 200,
                },
              },
            },
          ],
        },
        async rewrites() {
          return [
            {
              source: '/service-worker.js',
              destination: '/_next/static/service-worker.js',
            },
          ]
        },
      },
    ],
    withBundleAnalyzer,
  ],
  nextConfig
)
