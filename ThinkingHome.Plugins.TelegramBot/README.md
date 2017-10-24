*ThinkingHome.Plugins.TelegramBot*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.TelegramBot.svg)]()

# TelegramBotPlugin

Telegram бот для умного дома. Предоставляет плагинам и сценариям возможность отправлять и обрабатывать полученные сообщения Telegram.

## Конфигурация

Для работы необходимо указать в настройках API token бота.

```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.TelegramBot.TelegramBotPlugin": {
            "token": "<YOUR_API_TOKEN>"
        }
    }
}
```

### Регистрация нового бота и получнеие токена

Зарегистрировать нового бота и получить его токен можно в приложении Telegram через специального бота [@BotFather](http://t.me/BotFather). Добавьте бота [@BotFather](http://t.me/BotFather) в свой список контактов и отправьте ему команду */start*, чтобы он прислал инструкцию, как с ним работать.

Чтобы зарегистрировать нового бота, отправьте боту [@BotFather](http://t.me/BotFather) команду */newbot*. [@BotFather](http://t.me/BotFather) задаст несколько вопросов о новом боте и пришлет его API token.
