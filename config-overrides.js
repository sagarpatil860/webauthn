const { override, addWebpackPlugin } = require("customize-cra");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = override(
  addWebpackPlugin(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/service-worker.js"),
          to: "service-worker.js",
        },
        {
          from: path.resolve(__dirname, "src/indexedDB-worker.js"),
          to: "indexedDB-worker.js",
        },
        {
          from: path.resolve(__dirname, "src/idb-bundle.js"),
          to: "idb-bundle.js",
        },
        {
          from: path.resolve(
            __dirname,
            "modules/authn/generateRegistrationOptions/generateRegistrationOptions.js"
          ),
          to: "generateRegistrationOptions.js",
        },
      ],
    }),
    new webpack.ProvidePlugin({ idb: "idb" })
  )
);
