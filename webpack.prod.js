const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: '#source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue-audio-recorder.min.js',
    library: 'VueAudioRecorder',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false
    })
  ]
}
