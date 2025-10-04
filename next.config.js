const { withPlugins } = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withOffline = require('next-offline');

const isExport =
  process.env.NEXT_EXPORT === 'true' || process.env.EXPORT === 'true';
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '',
  webpack(config, { isServer }) {
    try {
      // Audio file loader
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        exclude: config.exclude,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: config.inlineImageLimit || 8192,
              fallback: require.resolve('file-loader'),
              publicPath: `${config.assetPrefix || ''}/_next/static/images/`,
              outputPath: `${isServer ? '../' : ''}static/images/`,
              name: '[name]-[hash].[ext]',
              esModule: false,
            },
          },
        ],
      });

      // GLSL shader loader
      config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader'],
      });
    } catch (err) {
      // Always throw an instance of Error
      throw err instanceof Error ? err : new Error(String(err));
    }
    return config;
  },
};

// Add i18n only if not exporting static site (for SSR/localization)
if (!isExport) {
  nextConfig.i18n = {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  };
}

// withOffline plugin options
const offlinePlugin =
  !isExport &&
  [
    withOffline,
    {
      workboxOpts: {
        swDest: isExport ? 'service-worker.js' : 'static/service-worker.js',
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
        ];
      },
    },
  ];

// Compose plugins
module.exports = withPlugins(
  [offlinePlugin, withBundleAnalyzer].filter(Boolean),
  nextConfig
);