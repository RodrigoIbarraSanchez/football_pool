const path = require('path');
const { merge } = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge({
  mode: 'production',
  entry: './src/index.js', // Asegúrate de que esta línea apunta al archivo correcto
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js(\?.*)?$/i,
    }),
  ],
});
