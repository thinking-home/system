import { Configuration } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import { resolve as resolvePath } from 'path';
import { externals, externalsType, module, resolve } from '@thinking-home/ui/dist/tools/build';

const config: Configuration = {
    // mode: 'production',
    mode: 'development',
    entry: './frontend/index.tsx',
    externals,
    externalsType,
    module,
    resolve,
    output: {
        path: resolvePath(__dirname, 'Resources/app'),
        filename: '[name].js',
        publicPath: '/',
        clean: true,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "node_modules/@thinking-home/ui/dist/vendor.js", to: "vendor.js" },
            ],
        }),
    ],
};

export default config;
