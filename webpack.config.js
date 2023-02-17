
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
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/'
  },
/*
  resolve: {
       fallback: {
         "fs": false,
    //     "tls": false,
    //     "net": false,
    //     "http": require.resolve("stream-http"),
    //     "https": false,
    //     "zlib": require.resolve("browserify-zlib") ,
         "path": require.resolve("path-browserify"),
    //     "stream": require.resolve("stream-browserify"),
    //     "util": require.resolve("util/"),
       }
    },
*/
  module:
  {
    rules:
    [
      /*
      {
        test: /\.js?$/,
        include:
        [
          path.resolve(__dirname, 'src/draco')
        ]
      },
      */
      {
        /* need to use this type to load fonts not file loader or the font will not load */
        test: /\.(ttf|wasm)$/,
        type: 'asset/resource'
      },

      {
        test: /\.(jpg|fbx|svg|png|pdf|glb|gltf|jpeg|drc)$/,
        loader: "file-loader"
      },
/*
      {
        test: /\.exec\.js$/,
        use:[ 'script-loader' ],
        include: [
          path.resolve(__dirname, 'src/draco/')
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
      directory: path.join(__dirname, 'src'),
    },
    hot: true
  }
}
