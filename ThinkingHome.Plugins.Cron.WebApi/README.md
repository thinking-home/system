*ThinkingHome.Plugins.Cron.WebApi* 

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Cron.WebApi.svg)]()

# CronWebApiPlugin

Предоставляет HTTP API для управления расписанием запуска задач [cron](../ThinkingHome.Plugins.Cron/README.md).

## HTTP API

### `/api/cron/web-api/list`

Возвращает список всех задач плагина [cron](../ThinkingHome.Plugins.Cron/README.md).

#### Параметры и возвращаемое значение

Метод `/api/cron/web-api/list` не имеет параметров. В ответ на клиент возвращается массив объектов, каждый из котрых содержит информацию об одной из задач.

```json
[
    {
        "id":"05bc5fc2-5a96-4a00-bd45-ff1ade40d019",
        "name": "My task name",
        "eventAlias": "my:event",
        "enabled": true,
        "month": 12,
        "day": 31,
        "hour": null,
        "minute": null
    },
    ...    
]
```

#### Пример

```bash
curl 'http://localhost:8080/api/cron/web-api/list'
```
