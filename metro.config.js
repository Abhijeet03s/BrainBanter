const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add asset extensions for web
config.resolver.assetExts.push('ttf', 'otf', 'png', 'jpg', 'jpeg', 'gif', 'svg');

module.exports = withNativeWind(config, { input: './global.css' });