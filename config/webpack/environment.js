const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

environment.plugins.prepend('Provide', 
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    Popper: ['popper.js', 'default']
  })
)

environment.plugins.prepend('DefinePlugin', 
  new webpack.DefinePlugin({
    'process.env.NODE_OPTIONS': JSON.stringify('--openssl-legacy-provider')
  })
)

module.exports = environment
