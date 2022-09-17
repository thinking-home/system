import {initWebpackConfig} from '@thinking-home/ui/dist/build/initWebpackConfig';
import {resolve} from "path";

export default initWebpackConfig('./frontend/index.tsx', resolve(__dirname, 'Resources/app'));
