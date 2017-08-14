*ThinkingHome.Plugins.Mail* 

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Mail.svg)]()

# MailPlugin

Позволяет отправлять сообщения по электронной почте.

## Конфигурация

Вы можете настраивать параметры SMTP сервера, параметры аутентификации и информацию об отправителе сообщений.


```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.Mail.MailPlugin": {
            "fromName": "Cow",
            "fromMail": "cow@example.com",
            "smtpHost": "localhost",
            "smtpPort": 1025,
            "useSSL": true,
            "disableCertificateValidation": false,
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

### `void SendEmail(string email, string subject, string message, string fileName, byte[] fileContent)`

Отправляет письмо с прикрепленным файлом.

#### Пример

```csharp
var bytes = File.ReadAllBytes("image.jpg");

Context.Require<MailPlugin>()
    .SendEmail("test@example.com", "My subject", "My message body.", "image.jpg", bytes);

```

### `void SendEmail(string email, string subject, string message, string fileName, Buffer fileContent)`

Отправляет письмо с прикрепленным файлом. Этот метод принимает содержимое файла в виде 
экземпляра класса `ThinkingHome.Plugins.Scripts.Buffer` (нужен для использования в сценариях).

#### Пример

```csharp
var bytes = File.ReadAllBytes("image.jpg");
var buffer = new Buffer(bytes);

Context.Require<MailPlugin>()
    .SendEmail("test@example.com", "My subject", "My message body.", "image.jpg", buffer);

```

## API сценариев

### `sendMail`

Отправляет письмо с указанными темой и текстом на указанный адрес.

#### Пример

```js
host.api.sendMail('test@example.com', 'My subject', 'My message body.');

```

### `sendMailWithAttachment`

Отправляет письмо с прикрепленным файлом.

#### Пример

```js
var file = host.api.getExampleImage(); // Buffer

host.api.sendMailWithAttachment(
    'test@example.com',
    'My subject',
    'My message body.',
    'my-file.jpg',
    file);

```

## Примеры подключения к почтовым сервисам

### Яндекс Почта

```js
{
    "smtpHost": "smtp.yandex.com",
    "smtpPort": 465,
    "useSSL": true,
    "auth": {
        "login": "example@yandex.ru",
        "password": "<пароль>"
    }
}
```

### GMail

```js
{
    "smtpHost": "smtp.gmail.com",
    "smtpPort": 465,
    "useSSL": true,
    "disableCertificateValidation": true,
    "auth": {
        "login": "example@gmail.com",
        "password": "<пароль для приложений>"
    }
}
```
