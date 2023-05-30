const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require("webpack");
module.exports = {
  mode: "production",//production
  devtool: "inline-source-map",
  entry: "./src/index.js", //入口
  output: {
    //出口
    filename: "webpackDemo.js", //打包完的js文件名称
    path: path.join(__dirname, "./dist"), // 路径
    // assetModuleFilename:'images/[hash][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(jpg|png)$/,
        use: ["file-loader"],
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "./dist"),
    },
    open: true,
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "css/[name].[hash].css",
    }),
    // new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin(),new TerserPlugin()],
    
  },
};
