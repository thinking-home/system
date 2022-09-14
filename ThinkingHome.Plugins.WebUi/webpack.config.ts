import { Configuration } from 'webpack';
import { resolve } from 'path';
// import { externals, externalsType } from '@thinking-home/ui/build/initWebpackConfig';

const config: Configuration = {
    mode: 'production',
    entry: './frontend/index.tsx',
    // externals,
    // externalsType,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: resolve(__dirname, 'Resources/app'),
        filename: '[name].js',
        clean: true,
    },
};

export default config;
