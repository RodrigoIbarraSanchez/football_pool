const { webpackConfig } = require('@rails/webpacker');
const { merge } = require('webpack-merge'); // Importa correctamente desde webpack-merge

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

module.exports = merge(webpackConfig, customConfig); // Usa merge para combinar configuraciones
