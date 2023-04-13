
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports =
{
  mode: 'development',
  //entry: './src/main.js',
  entry: {
    index: './src/main.js',
  },

  output:
  {
    //path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },

  module:
  {
    rules:
    [

      {
        /* need to use this type to load fonts not file loader or the font will not load */
        test: /\.(ttf|wasm)$/,
        type: 'asset/resource'
      },

      {
        test: /\.(jpg|fbx|svg|png|pdf|glb|gltf|jpeg|drc)$/,
        loader: "file-loader"
      },

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

  plugins: [new HtmlWebpackPlugin({
    meta: {
      description: 'Top rated IT company specializing in installation, repair integration and consulting'
    }
  })],

  devServer:
  {
    hot: true,
    port: 3000,
    static:{
      directory: path.join(__dirname, 'src'),
    },
  }
}
