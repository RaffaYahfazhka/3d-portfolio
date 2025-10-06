// next.config.js
const isProd = process.env.NODE_ENV === 'production';
const repo = '3d-portfolio'; 

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'export',         
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/i,
      type: 'asset/source',
    });
    return config;
  },
};

