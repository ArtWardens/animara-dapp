const webpack = require('webpack');
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

module.exports = function override(config, webpackEnv) {
  console.log('overriding webpack config...');

  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const loaders = config.module.rules[1].oneOf;

  // Insert the custom Babel loader
  loaders.splice(loaders.length - 1, 0, {
    test: /\.(js|mjs|cjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve('babel-preset-react-app/dependencies'),
          { helpers: true },
        ],
      ],
      cacheDirectory: true,
      cacheCompression: false,
      cacheIdentifier: getCacheIdentifier(
        isEnvProduction
          ? 'production'
          : isEnvDevelopment && 'development',
        [
          'babel-plugin-named-asset-import',
          'babel-preset-react-app',
          'react-dev-utils',
          'react-scripts',
        ]
      ),
      sourceMaps: shouldUseSourceMap,
      inputSourceMap: shouldUseSourceMap,
    },
  });

  // Disable source maps by setting devtool to false
  config.devtool = false;

  // Add polyfills for Node.js core modules
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

  // Add the ProvidePlugin to inject polyfills globally
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
