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
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app/javascript'), // Ajusta esto según tu estructura de proyecto
    },
  },
};

module.exports = merge(webpackConfig, customConfig);
