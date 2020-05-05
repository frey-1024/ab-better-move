const path = require('path');
const { getProjectPath } = require('./utils');
const includePaths = [getProjectPath('/stories'), getProjectPath('/src')];

module.exports = {
  stories: ['../stories/index.stories.js'],
  addons: ['@storybook/addon-knobs/register'],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push( {
      test: /\.(js|ts|tsx)$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter'),
        eslintPath: require.resolve('eslint'),
        failOnWarning: false,
        failOnError: false
      },
      include: includePaths
    });

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      ]
    });

    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve.extensions.push('.ts', '.tsx', '.scss', '.css', '.md', '.png', '.jpg', '.svg');
    config.resolve.alias['src'] = getProjectPath('src');

    return config;
  },
};