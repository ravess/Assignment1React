// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//   entry: './src/index.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'bundle[contenthash].js',
//     // publicPath: '/',
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//         },
//       },
//       {
//         test: /\.css$/,
//         exclude: /node_modules/,
//         use: [
//           'style-loader',
//           {
//             loader: 'css-loader',
//             options: {
//               modules: true, // Enable CSS modules
//             },
//           },
//         ],
//         include: /src\/components/,
//       },
//     ],
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './public/index.html',
//     }),
//   ],
//   devServer: {
//     static: {
//       directory: path.resolve(__dirname, 'dist'),
//     },
//     port: 3000,
//     historyApiFallback: true,
//     hot: true,
//     liveReload: true,
//     headers: {
//       'Cache-Control': 'no-store',
//     },
//   },
// };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /\.module\.css$/, // Exclude CSS module files
      },
      {
        test: /\.module\.css$/, // Match CSS module files
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true, // Enable CSS modules for module files
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    historyApiFallback: true,
    hot: true,
    liveReload: true,
  },
};
