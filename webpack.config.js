const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

module.exports = (env, args) => {
  let conf = `./webpack.${env.NODE_ENV === 'production' ? 'prod' : 'dev'}.js`

  return merge(require(conf), {
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              'scss': [
                'vue-style-loader',
                'css-loader',
                'sass-loader'
              ]
            }
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: `"${process.env.NODE_ENV}"`
        },
        VERSION: JSON.stringify(require("./package.json").version)
      }),
    ],
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true
    },
    performance: {
      hints: false
    }
  })
}
