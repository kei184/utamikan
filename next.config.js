/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静的エクスポート有効化[7]
  trailingSlash: true,  // /path/index.html形式で出力[7]
  images: {
    unoptimized: true  // 画像最適化を無効化（外部最適化ツール使用時）[3]
  }
}

// next.config.js
module.exports = {
  // 静的出力として動作するように設定
  output: 'export', 
};
