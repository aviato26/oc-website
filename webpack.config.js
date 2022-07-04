
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports =
{
  mode: 'development',
  entry: './src/main.js',

  output:
  {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },

  module:
  {
    rules:
    [
      {
        test: /\.js?$/,
        include:
        [
          path.resolve(__dirname, 'src')
        ]
      },

      {
        test: /\.(jpg|fbx|svg|png|pdf|glb|gltf|wasm|jpeg)$/,
        loader: "file-loader"
      },
/*
      {
        test: /\.exec\.js$/,
        use:[ 'script-loader' ],
        include: [
          path.resolve(__dirname, 'node_modules/three/examples/js/libs/ammo.wasm.js')
        ]
      },
*/
      {
        test: /\.css$/i,
        use: ["style-loader","css-loader"],
        include:
        [
          path.resolve(__dirname, 'src')
        ]
      }
    ]
  },

  plugins: [new HtmlWebpackPlugin({})],

  devServer:
  {
    port: 3000,
    static:{
      directory: path.join(__dirname, 'dist'),
    },
    hot: true
  }
}
