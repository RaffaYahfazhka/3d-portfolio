// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  webpack: (config) => {
    // Jadikan file shader sebagai string (asset/source = raw)
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/i,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;
