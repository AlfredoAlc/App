const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts;
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;
const _ = require('underscore');
require('dotenv').config();

const defaultConfig = getDefaultConfig(__dirname);

const isUsingMockAPI = process.env.E2E_TESTING === 'true';
if (isUsingMockAPI) {
    // eslint-disable-next-line no-console
    console.warn('⚠️ Using mock API');
}

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        assetExts: _.filter(defaultAssetExts, (ext) => ext !== 'svg'),
        sourceExts: [...defaultSourceExts, 'jsx', 'svg'],
        resolveRequest: (context, moduleName, platform) => {
            const resolution = context.resolveRequest(context, moduleName, platform);
            if (isUsingMockAPI && moduleName.includes('/API')) {
                return {
                    ...resolution,
                    filePath: resolution.filePath.replace(/src\/libs\/API.ts/, 'src/libs/E2E/API.mock.ts'),
                };
            }
            return resolution;
        },
    },
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
};

module.exports = mergeConfig(defaultConfig, config);
