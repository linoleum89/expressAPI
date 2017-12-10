const path = require('path');
const webpack = require('webpack');
const sharedPlugins = require('./sharedPlugins');

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
];

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, '/../app/src/main.js'),
    //path.join(__dirname, '/../app/src/main.jsx'),
  ],
  output: {
    path: path.join(__dirname, '/../dist/'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  plugins: plugins.concat(sharedPlugins),
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.js$/,
      //test: /\.jsx$/,
      use: [
      //   {
      //   loader: 'babel-loader',
      //   options: {
      //     //presets: ['latest'],
      //     presets: ['react','es2015'],
      //     //presets: ['@babel/preset-env']
      //   },
      // }
    
      {
        loader: 'babel-loader',
        options: {
          presets: ['react'],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
        },
      },
    ],
    }, {
      //test: /\.scss/,
      test: /\.css/,
      use: [
        'style-loader', {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [path.join(__dirname, '/../app/src/styles/')],
          },
        },
      ],
    }],
  },
};
