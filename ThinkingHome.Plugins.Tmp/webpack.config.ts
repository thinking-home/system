import {resolve} from "path";
import {initWebpackConfig} from '@thinking-home/ui/dist/tools/build';

export default initWebpackConfig({
    page1: './frontend/page1.tsx',
    page2: './frontend/page2.tsx'
}, resolve(__dirname, 'Resources/app'));
