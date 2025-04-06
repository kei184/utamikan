module.exports = {
  siteUrl: 'https://utamikan.netlify.app',
  generateRobotsTxt: true,
  outDir: 'public',
  exclude: ['/server-side-page'],
  transform: async (config, path) => {
    return {
      loc: path,
      lastmod: new Date().toISOString()
    }
  }
}
