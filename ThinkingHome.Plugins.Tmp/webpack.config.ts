import {resolve} from "path";
import {initWebpackConfig} from '@thinking-home/ui/dist/tools/build';

export default initWebpackConfig('./frontend/index.tsx', resolve(__dirname, 'Resources/app'));
