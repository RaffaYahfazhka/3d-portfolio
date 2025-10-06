const plugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withOffline = require('next-offline')

// ========= Flag & helper untuk mode export (Pages) =========
const isExport = process.env.EXPORT === 'true'      // aktifkan di CI saat deploy Pages
const repo = process.env.REPO_NAME || ''            // isi di CI; contoh: "my-portfolio"
const explicitBase = process.env.BASE_PATH || ''    // opsional override, contoh: "/my-portfolio"
const basePath = isExport ? (explicitBase || (repo ? `/${repo}` : '')) : ''
const assetPrefix = isExport ? `${basePath}/` : ''

const nextConfig = {
  // Debug prod runtime
  productionBrowserSourceMaps: true,

  // Khusus saat export ke GitHub Pages
  ...(isExport
    ? {
        output: 'export',              // hasil build ke folder out/
        images: { unoptimized: true }, // wajib untuk export statis
        trailingSlash: true,
        basePath,
        assetPrefix,
      }
    : {}),

  webpack(config, { isServer }) {
    // audio support (dipertahankan)
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

    // shader support (dipertahankan)
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })

    return config
  },
}

// manage i18n (dipertahankan)
if (process.env.EXPORT !== 'true') {
  nextConfig.i18n = {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  }
}

// ====== Susun plugin: saat EXPORT, JANGAN muat withOffline ======
const pluginArray = [
  ...(isExport
    ? [] // <-- service worker dimatikan khusus export
    : [
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
                    expiration: { maxEntries: 200 },
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
      ]),
  withBundleAnalyzer,
]

module.exports = plugins(pluginArray, nextConfig)
