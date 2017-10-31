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

## API

### `void SendMessage(long chatId, string text)`

Отправляет сообщение в указанный чат.

#### Параметры

- `long chatId` - ID чата (можно узнать его, из полученного сообщения).
- `string text` - такст сообщения.

#### Пример

```csharp
long chatId = ...

Context.Require<TelegramBotPlugin>()
    .SendMessage(chatId, $"Привет!");

```

### `void SendPhoto(long chatId, string filename, Stream content)`

Отправляет изображение в указанный чат.

#### Параметры

- `long chatId` - ID чата (можно узнать его, из полученного сообщения).
- `string filename` - имя файла с изображением (который можно скачать).
- `Stream content` - содержимое файла с изображением.

#### Пример

```csharp
long chatId = ...

using (var stream = System.IO.File.OpenRead("/Users/username/photo.jpg"))
{
    Context.Require<TelegramBotPlugin>()
        .SendPhoto(chatId, "photo.jpg", stream);
}

```

### `void SendPhoto(long chatId, Uri url)`

Отправляет в указанный чат изображение, расположенное по заданному URL.

#### Параметры

- `long chatId` - ID чата (можно узнать его, из полученного сообщения).
- `Uri url` - URL изображения.

#### Пример

```csharp
long chatId = ...

Context.Require<TelegramBotPlugin>()
    .SendPhoto(chatId, new Uri("http://example.com/images/котики.jpg"));

```

### `void SendFile(long chatId, string filename, Stream content)`

Отправляет файл в указанный чат.

#### Параметры

- `long chatId` - ID чата (можно узнать его, из полученного сообщения).
- `string filename` - имя файла.
- `Stream content` - содержимое файла.

#### Пример

```csharp
long chatId = ...

using (var stream = System.IO.File.OpenRead("/Users/username/user-manual.pdf"))
{
    Context.Require<TelegramBotPlugin>()
        .SendFile(chatId, "user-manual.pdf", stream);
}

```

### `void SendFile(long chatId, Uri url)`

Отправляет в указанный чат файл, расположенный по заданному URL.

#### Параметры

- `long chatId` - ID чата (можно узнать его, из полученного сообщения).
- `Uri url` - URL файла.

#### Пример

```csharp
long chatId = ...

Context.Require<TelegramBotPlugin>()
    .SendFile(chatId, new Uri("http://example.com/user-manual.pdf"));

```

### `[TelegramMessageHandler]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.TelegramBot.TelegramMessageHandlerAttribute`. Метод вашего плагина будет автоматически вызываться при получении сообщений через Telegram.

В качестве параметра атрибута необходимо указать команду бота, которую следует обрабатывать. Например, если указать значение `"test"`, то ваш метод будет вызван для всех сообщений, котрые начинаются с `/test`.

Команды бота могут содержать английские и русские буквы, цифры, символы "дефис" `-` и "подчеркивание" `_`. В начале команды должен быть слэш `/`.

Если параметр атрибута не указан, метод будет вызываться для всех сообщений. Чтобы обрабатывать только сообщения, которые в тексте не содержат ни одной команды, передайте в качестве значения параметра пустую строку.

Сигнатура метода должна соответствовать делегату `ThinkingHome.Plugins.TelegramBot.TelegramMessageHandlerDelegate`:

```csharp
public delegate void TelegramMessageHandlerDelegate(string command, Message message);
```

#### Параметры

- `string command` - команда, с которой начинается сообщение (последовательность букв и цифр, в начале слэш `/`).
- `Telegram.Bot.Types.Message message` - полученное сообщение.

#### Пример

```csharp
// обработка сообщений, которые начинаются с команды 'test'
[HubMessageHandler("test")]
public void TestMessageHandler1(string command, Message msg)
{
    // command == "test"

    Logger.LogInformation($"Получено новое сообщение: {msg.Text}");
}

// обработка сообщения, которое не содержит команду
[HubMessageHandler("")]
public void TestMessageHandler2(string command, Message msg)
{
    // command == ""

    Logger.LogInformation($"Получено новое сообщение: {msg.Text}");
}

// обработка всех сообщений
[HubMessageHandler]
public void TestMessageHandler3(string command, Message msg)
{
    switch (command)
    {
        case: "test":
            Logger.LogInformation("Tested");
            break;
        case: "say-hello":
            Logger.LogInformation("Hello!");
            break;
        default:
            Logger.LogInformation("Unknown command");
            break;
    }
}

```
