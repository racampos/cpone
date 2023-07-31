/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: true, // need this b/c of babel.config.js
  },
};

module.exports = nextConfig;
