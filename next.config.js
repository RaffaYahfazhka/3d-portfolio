// next.config.js
const isProd = process.env.NODE_ENV === 'production';
const repo = '3d-portfolio'; // ganti jika pakai project page

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  // kalau BUKAN username.github.io (project page), aktifkan 2 baris ini:
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  trailingSlash: true,

  // rule shader yang kamu butuhkan kemarin
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/i,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;
