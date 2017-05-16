*ThinkingHome.Plugins.Mail* 

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Mail.svg)]()

# MailPlugin

Позволяет отправлять сообщения по электронной почте.

## Конфигурация

```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.Mail.MailPlugin": {
            "fromName": "Cow",
            "fromMail": "cow@example.com",
            "smtpHost": "localhost",
            "smtpPort": "1025",
            "auth": {
                "login": "cow@example.com",
                "password": "password"
            }
        }
    }
}
```

## API

### `void SendEmail(string email, string subject, string message)`

Отправляет письмо с указанными темой и текстом на указанный адрес.

#### Пример

```csharp
Context.Require<MailPlugin>()
    .SendEmail("test@example.com", "My subject", "My message body.");

```

## API сценариев

### sendMail

Отправляет письмо с указанными темой и текстом на указанный адрес.

#### Пример

```js
host.api.sendMail('test@example.com', 'My subject', 'My message body.');

```
