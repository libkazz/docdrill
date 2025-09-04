/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages 静的配信を想定（クライアントで S3 を fetch）
  output: 'export'
};

module.exports = nextConfig;
