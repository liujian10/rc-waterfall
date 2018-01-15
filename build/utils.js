const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const config = require('../config')

const inProject = path.resolve.bind(path, __dirname)
const inProjectSrc = (file) => inProject('src', file)
const NODE_ENV = process.env.NODE_ENV || config.dev.env.NODE_ENV
const __DEV__ = NODE_ENV.env === config.dev.env.NODE_ENV
const __SOURCE_MAP__ = config.dev.cssSourceMap

exports.extractStyles = new ExtractTextPlugin({
  filename: 'styles/[name].[contenthash].css',
  allChunks: true,
  disable: __DEV__
})

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssRules = [
  {
    test: /\.css$/,
    loader: 'css-loader'
  }, {
    test: /\.less$/,
    loader: exports.extractStyles.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: __SOURCE_MAP__,
            minimize: {
              autoprefixer: {
                add: true,
                remove: true,
                browsers: ['last 2 versions']
              },
              discardComments: {
                removeAll: true
              },
              discardUnused: false,
              mergeIdents: false,
              reduceIdents: false,
              safe: true,
              sourcemap: __SOURCE_MAP__
            }
          }
        },
        {
          loader: 'less-loader',
          options: {
            sourceMap: __SOURCE_MAP__,
            includePaths: [
              inProjectSrc('styles')
            ]
          }
        }
      ]
    })
  }]