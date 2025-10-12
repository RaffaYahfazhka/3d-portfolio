// next.config.js
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withOffline = require('next-offline');

const isProd = process.env.NODE_ENV === 'production';
const isExport = process.env.NEXT_EXPORT === 'true' || process.env.EXPORT === 'true';

// Ganti sesuai nama repo GitHub Pages kamu
const repo = '3d-portfolio';

const nextConfig = {
  // ==== Static export untuk GitHub Pages ====
  output: 'export',
  reactStrictMode: true,

  // Gambar di GHPages harus unoptimized
  images: { unoptimized: true },

  // Base path & asset prefix untuk subpath GHPages: https://<user>.github.io/<repo>/
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}` : '',

  // Biar gampang referensikan asset di /public dengan prefix basePath
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repo}` : '',
  },

  productionBrowserSourceMaps: true,

  webpack(config) {
    // === Audio (ogg/mp3/wav/mpeg) pakai Asset Modules ===
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name]-[hash][ext]',
      },
    });

    // === Shader (glsl|vert|frag|vs|fs) sebagai source string ===
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/i,
      type: 'asset/source',
    });

    return config;
  },
};

// i18n TIDAK boleh aktif saat export
if (!isExport) {
  nextConfig.i18n = {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  };
}

// Plugin disusun kondisional: offline dimatikan saat export
const plugins = [
  // Aktifkan offline HANYA saat bukan export (SSR build)
  !isExport &&
    [
      withOffline,
      {
        workboxOpts: {
          swDest: 'static/service-worker.js',
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
    ],
  withBundleAnalyzer,
].filter(Boolean);

module.exports = withPlugins(plugins, nextConfig);
