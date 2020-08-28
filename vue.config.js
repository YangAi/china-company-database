const alias = require('./config/alias.config').resolve.alias

module.exports = {
  configureWebpack: {
    resolve: {
      alias: alias
    }
  },
  pluginOptions: {
    autoRouting: {
      chunkNamePrefix: 'page-'
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
