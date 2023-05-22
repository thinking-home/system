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
public class MyPlugin : PluginBase
{
    private readonly MailPlugin mail;
    
    private void MyMethod()
    {
        mail.SendEmail("test@example.com", "My subject", "My message body.");
    }
}
```

### `void SendEmail(string email, string subject, string message, string fileName, byte[] fileContent)`

Отправляет письмо с прикрепленным файлом.

#### Пример

```csharp
public class MyPlugin : PluginBase
{
    private readonly MailPlugin mail;
    
    private void MyMethod()
    {
        var bytes = File.ReadAllBytes("image.jpg");
        
        mail.SendEmail("test@example.com", "My subject", "My message body.", "image.jpg", bytes);
    }
}
```

### `void SendEmail(string email, string subject, string message, string fileName, Buffer fileContent)`

Отправляет письмо с прикрепленным файлом. Этот метод принимает содержимое файла в виде 
экземпляра класса `ThinkingHome.Plugins.Scripts.Buffer` (нужен для использования в сценариях).

#### Пример

```csharp
public class MyPlugin : PluginBase
{
    private readonly MailPlugin mail;
    
    private void MyMethod()
    {
        var bytes = File.ReadAllBytes("image.jpg");
        var buffer = new Buffer(bytes);
        
        mail.SendEmail("test@example.com", "My subject", "My message body.", "image.jpg", buffer);
    }
}
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

Обратите внимание, для отправки писем через Яндекс нужно включить в настройках почты возможность доступа из почтовых клиентов:

> Все настройки → Почтовые программы → Разрешить доступ к почтовому ящику с помощью почтовых клиентов → С сервера imap.yandex.ru по протоколу IMAP

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
