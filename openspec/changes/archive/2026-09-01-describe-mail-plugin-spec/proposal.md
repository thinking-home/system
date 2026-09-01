## Why

Плагин `Mail` (следующий по очереди после `Cron`/`Cron.WebApi`/`Cron.WebUi`) пока не описан спецификацией. Он предоставляет скриптовым обработчикам возможность отправлять электронную почту через SMTP, не завися от других ещё не описанных плагинов.

## What Changes

- Добавить спецификацию капабилити `plugins/mail/mail-sending`: конфигурация SMTP-соединения (хост, порт, SSL, проверка сертификата, опциональная аутентификация, отправитель), скриптовые команды `sendMail` и `sendMailWithAttachment`, формирование письма (тема, текстовое тело, вложение) и обработка ошибок отправки.

## Capabilities

### New Capabilities
- `plugins/mail/mail-sending`: отправка электронной почты через SMTP из скриптовых обработчиков, включая письма с вложениями

### Modified Capabilities
(нет)

## Impact

- `ThinkingHome.Plugins.Mail/MailPlugin.cs`
- Новая спецификация: `openspec/specs/plugins/mail/mail-sending/spec.md`
