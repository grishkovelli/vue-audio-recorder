const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: '#eval-source-map',
  entry: './demo/index.js',
  output: {
    path: path.resolve(__dirname, './demo')
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './demo/index.html'
    })
  ]
}

