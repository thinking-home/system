import { Configuration } from 'webpack';
import { resolve as resolvePath } from 'path';
import { externals, externalsType, module, resolve } from '@thinking-home/ui/dist/build';

delete (externals as any)['@thinking-home/ui'];

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
};

export default config;
