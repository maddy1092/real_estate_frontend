module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  lintOnSave: false,
  configureWebpack: {
    stats: { warnings: false },
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      disableHostCheck: true,
      sockPort: 8083,
      sockHost: "localhost",
      port: 8083
    },
    externals: ["vue", "vue-router", /^@ottu-mf\/.+/]
  },
  filenameHashing: false
};
