const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const Package = require("./package.json");

const isProd = process.argv[process.argv.indexOf("--mode") + 1] === "production";

console.info(`Mode: ${((isProd) ? "Production" : "Development")}`);

module.exports = {
  entry: ["./src/index.js"],
  context: __dirname,
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "mockoDB.js",
    publicPath: "/dist/",
    library: "mockoDB",
    globalObject: "this",
    libraryTarget: "commonjs",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  stats: "errors-only",
  devtool: isProd ? false : "cheap-source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(Package.version)
    })
  ]
  // optimization
  // optimization: {
  //   providedExports: true,
  //   usedExports: true,
  //   runtimeChunk: "single",
  //   splitChunks: {
  //     chunks: "all",
  //     maxInitialRequests: Infinity,
  //     minSize: 0,
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name(module) {
  //           // get the name. E.g. node_modules/packageName/not/this/part.js
  //           // or node_modules/packageName
  //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
  //
  //           // npm package names are URL-safe, but some servers don"t like @ symbols
  //           return `vendor.${packageName.replace("@", "")}`;
  //         }
  //       }
  //     }
  //   }
  // }
};
