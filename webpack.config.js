const { webpackConfig } = require('@rails/webpacker');
const { merge } = require('webpack-merge');

if (!webpackConfig) {
  throw new Error("webpackConfig is not defined. Make sure @rails/webpacker is properly installed and configured.");
}

const customConfig = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

module.exports = merge(webpackConfig, customConfig);
