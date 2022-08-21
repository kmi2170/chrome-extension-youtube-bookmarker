const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const getHtmlPlugins = (chunks) => {
  return chunks.map(
    (chunk) =>
      new HTMLWebpackPlugin({
        title: 'Youtube timestamp bookmarker',
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
};

const plugins = [
  ...getHtmlPlugins(['popup', 'options']),
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
        // plugins: ['@babel/plugin-transform-runtime'],
      },
    },
  },
  {
    test: /\.css$/i,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: [tailwindcss, autoprefixer],
          },
        },
      },
    ],
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  },
];

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    popup: resolve('./src/popup/index.tsx'),
    options: resolve('./src/options/index.tsx'),
    background: resolve('./src/background/background.ts'),
    contentScript: resolve('./src/content-script/contentScript.ts'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules,
  },
  plugins,
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
