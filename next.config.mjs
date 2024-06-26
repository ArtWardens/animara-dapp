import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_PATH = path.join(__dirname, 'src');

const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (dev && !isServer) {
      config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    config.module.rules.push(
      {
        test: /\.(ts|js)x?$/,
        loader: 'ts-loader',
        include: [SRC_PATH],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
        },
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file-loader',
        include: SRC_PATH,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        issuer: { and: [/\.(js|ts|md)x?$/] },
        type: 'asset/resource',
        include: SRC_PATH,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.mp3$/,
        use: {
          loader: 'file-loader',
        },
      }
    );

    return config;
  },
};

export default nextConfig;
