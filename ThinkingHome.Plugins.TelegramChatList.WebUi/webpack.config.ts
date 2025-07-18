import {resolve} from "path";
import {initWebpackConfig} from '@thinking-home/ui/dist/tools/build';
const pages = {
    telegramChatList: './frontend/telegram-chat-list.tsx',
};
const resultPath = resolve(__dirname, 'Resources/app');
export default initWebpackConfig(pages, resultPath);