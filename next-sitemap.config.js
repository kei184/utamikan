module.exports = {
  siteUrl: 'https://utamikan.netlify.app',
  generateRobotsTxt: true,
  outDir: 'public',
  sitemapSize: 5000,
  exclude: ['/admin/*'],
  transform: async (config, path) => ({
    loc: path,
    lastmod: new Date().toISOString()
  })
};
