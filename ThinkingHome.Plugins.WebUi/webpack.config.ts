import { Configuration } from 'webpack';
import { resolve } from 'path';
import { externals, externalsType } from '@thinking-home/ui/dist/build';

delete (externals as any)['@thinking-home/ui'];

const config: Configuration = {
    // mode: 'production',
    mode: 'development',
    entry: './frontend/index.tsx',
    externals,
    externalsType,
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
        publicPath: '/',
        clean: true,
    },
};

export default config;
