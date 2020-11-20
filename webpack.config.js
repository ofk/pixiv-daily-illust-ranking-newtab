const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const manifest = require('./src/manifest.json');

const NODE_ENV = process.env.NODE_ENV || 'development';

const scriptPaths = [];
const htmlPaths = [];
const assetPaths = [];

const addPath = (localPath) => {
  if (!localPath) return;
  const extname = path.extname(localPath);
  if (/^\.(js|html?)$/.test(extname)) {
    scriptPaths.push(localPath.replace(/\.\w+$/, ''));
    if (/^\.html?$/.test(extname)) {
      htmlPaths.push(localPath);
    }
  } else {
    assetPaths.push(localPath);
  }
};

// cf. https://developer.chrome.com/extensions/manifest
Object.values(manifest.icons || {}).forEach(addPath);

if (manifest.browser_action) {
  addPath(manifest.browser_action.default_popup);
}

if (manifest.page_action) {
  addPath(manifest.page_action.default_popup);
}

if (manifest.background) {
  (manifest.background.scripts || []).forEach(addPath);
}

Object.values(manifest.chrome_url_overrides || {}).forEach(addPath);

(manifest.content_scripts || []).forEach((contentScript) => {
  (contentScript.js || []).forEach(addPath);
});

addPath(manifest.devtools_page);

addPath(manifest.options_page);

if (manifest.options_ui) {
  addPath(manifest.options_ui.page);
}

const entry = {};
const outputPath = path.resolve(__dirname, 'dist');

scriptPaths.forEach((scriptPath) => {
  entry[path.basename(scriptPath)] = path.resolve(__dirname, 'src', scriptPath);
});

const htmlPlugins = [];

htmlPaths.forEach((htmlPath) => {
  const name = path.basename(htmlPath, path.extname(htmlPath));
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      title: name,
      filename: htmlPath,
      template: path.resolve(__dirname, 'src', 'template.ejs'),
      chunks: [name],
    })
  );
});

const copyPatterns = [
  {
    from: path.resolve(__dirname, 'src', 'manifest.json'),
    to: outputPath,
    transform: (content) =>
      Buffer.from(
        JSON.stringify(
          {
            name: process.env.npm_package_name,
            version: process.env.npm_package_version,
            description: process.env.npm_package_description,
            ...JSON.parse(content.toString()),
          },
          null,
          '  '
        )
      ),
  },
];

assetPaths.forEach((assetPath) => {
  copyPatterns.push({
    from: path.resolve(__dirname, 'src', assetPath),
    to: outputPath,
  });
});

module.exports = {
  mode: NODE_ENV,
  ...(NODE_ENV === 'development'
    ? {
        devtool: 'inline-source-map',
      }
    : {}),
  entry,
  output: {
    path: outputPath,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.PACKAGE_NAME': JSON.stringify(process.env.npm_package_name),
      'process.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
    }),
    new CopyWebpackPlugin({
      patterns: copyPatterns,
    }),
    ...htmlPlugins,
  ],
};
