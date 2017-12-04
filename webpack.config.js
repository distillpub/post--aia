const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    "index": "./bundles/index.js"
  },
  resolve: {
    extensions: [ ".js", ".html" ],
    modules: [
      path.resolve(__dirname, "components"),
      path.resolve(__dirname, "assets"),
      path.resolve(__dirname, "figures"),
      "node_modules"
    ]
  },
  output: {
    path: __dirname + "/public",
    filename: "[name].bundle.js",
    chunkFilename: "[name].[id].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        loader: "svelte-loader"
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin({
      parallel: true,
      uglifyOptions: {
        ecma: 6
      }
    })
  ],
  devServer: {
    historyApiFallback: true,
    overlay: true,
    compress: true,
    contentBase:  __dirname + "/public"
  },
  stats: {
    maxModules: 100,
    modulesSort: "!size",
    excludeModules: ""
  },
  devtool: "inline-source-map"
};
