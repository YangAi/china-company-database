const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  resolve: {
    alias: {
      '@': resolve('../src'),
      '@src': resolve('../src'),
      '@pages': resolve('../src/pages'),
      '@layouts': resolve('../src/layouts'),
      '@config': resolve('./config')
    }
  }
}
