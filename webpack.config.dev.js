const path = require('path')
const webpack = require('webpack')
const ip = require('internal-ip')
const portFinderSync = require('portfinder-sync')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const dotenv = require('dotenv')


module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.vue$/,
        loader: 'vue-loader'
      },
      { test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [[
              '@babel/preset-env', {
                // Webxr is only supported by very new browsers. It doesn't make
                // any sense to polyfill js features older than webxr for old browsers.
                // In particular, async/await shouldn't be compiled to a regenerator polyfill.
                // see: https://caniuse.com/webxr, https://caniuse.com/async-functions
                targets: {
                  "chrome": "79",
                },
              }],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },

    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed)
    }),
  ],
  stats: {
    modules: false,
    assetsSort: '!size',
  },
  devServer: {
    host: '0.0.0.0',
    port: portFinderSync.getPort(8000),
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
    open: false,
    https: false,
    useLocalIp: true,
    disableHostCheck: true,
    overlay: true,
    after: function(app, server, compiler) {
        const port = server.options.port
        const https = server.options.https ? 's' : ''
        const localIp = ip.v4.sync()
        const domain1 = `http${https}://${localIp}:${port}`
        const domain2 = `http${https}://localhost:${port}`
        console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
    },
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}


function infoColor(message) {
    return `\u001b[1m\u001b[34m${message}\u001b[39m\u001b[22m`
}
