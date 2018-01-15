// base config

const path = require('path');
const config = require('./index');
const utils = require('../build/utils');

let webpackConfig = {
  entry: {
    main: './demo/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  module: {
    rules: []
  },
  plugins:[]
};

webpackConfig.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        plugins: [
          [
            'import',
            {
              style: true,
              libraryName: 'antd'
            }
          ],
          'babel-plugin-transform-class-properties',
          'babel-plugin-syntax-dynamic-import',
          [
            'babel-plugin-transform-runtime',
            {
              helpers: true,
              polyfill: false, // we polyfill needed features in src/normalize.js
              regenerator: true
            }
          ],
          [
            'babel-plugin-transform-object-rest-spread',
            {
              useBuiltIns: true // we polyfill Object.assign in src/normalize.js
            }
          ]
        ],
        presets: [
          'babel-preset-react',
          [
            'babel-preset-env', {
            targets: {
              ie9: true,
              uglify: true,
              modules: false
            }
          }]
        ]
      }
    }]
});

webpackConfig.module.rules.push(...utils.cssRules);
webpackConfig.plugins.push(utils.extractStyles);

module.exports = webpackConfig;