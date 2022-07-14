const { resolve, join } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const plugins = [
  new HTMLWebpackPlugin({
    title: 'Youtube timestamp bookmarker',
    filename: 'popup.html',
    chunks: ['popup'],
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: resolve('public'), to: resolve('build') }],
  }),
  new CleanWebpackPlugin(),
];

const rules = [
  {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      },
    },
  },
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  },
  // {
  //   test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
  //   type: 'asset/resource',
  // },
  // {
  //   test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
  //   type: 'asset/inline',
  // },
];

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    popup: resolve('./src/index.tsx'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, 'build'),
  },
  module: {
    rules,
  },
  plugins,
};
