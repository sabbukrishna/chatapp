const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable Hermes
config.transformer.hermesCommand = 'hermes';

// Ensure proper module resolution
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// Add specific alias for react-dom to fix "use is not a function" on web
config.resolver.alias = {
  ...config.resolver.alias,
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom/index.js'),
};

module.exports = config;