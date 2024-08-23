const webpack = require('webpack');

module.exports = function override(config, env) {
  // Disable source maps by setting devtool to false
  config.devtool = false;
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/'),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    zlib: require.resolve("browserify-zlib"),
    url: require.resolve("url/"),
    // Add other polyfills as needed
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );
  return config;
};
