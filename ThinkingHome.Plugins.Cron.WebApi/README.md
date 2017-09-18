*ThinkingHome.Plugins.Cron.WebApi* 

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Cron.WebApi.svg)]()

# CronWebApiPlugin

Предоставляет HTTP API для управления расписанием запуска задач [cron](../ThinkingHome.Plugins.Cron/README.md).

## HTTP API

### `/api/cron/web-api/save`

Сохраняет в системе информацию о задаче cron.

#### Параметры и возвращаемое значение

- `id` (guid) - id ранее сохраненной задачи cron. Если этот параметр не указан, будет создана новая задача.  
- `name` (string) - название задачи для отображения в интерфейсе.
- `eventAlias` (string) - название сценарного события. 
- `month` (int) - номер месяца, начиная с 1.
- `day` (int) - номер дня месяца, начиная с 1.
- `hour` (int) - номер часа, начиная с 0.
- `minute` (int) - номер минуты, начиная с 0.
- `enabled` (boolean) - признак "задача активна".

В ответ на клиент возвращается строка, содержащая id сохраненной задачи.

```js
"21222eed-5a92-42ad-b7c9-23f548482024"
```


#### Пример

```bash
curl 'http://localhost:8080/api/cron/web-api/save?id=66f3015b-bd10-4962-9698-764f05372d00&name=mimi&enabled=true&hour=13'
```

### `/api/cron/web-api/get`

Получает информацию о ранее сохраненной задаче.

#### Параметры и возвращаемое значение

- `id` (guid) - id задачи.

В ответ на клиент возвражается объект, содержащий информацию о заданной задаче. Если задачу с заданным id не удалось найти, будет возвращен код ошибки 500.

```js
{
    "id":"05bc5fc2-5a96-4a00-bd45-ff1ade40d019",
    "name": "My task name",
    "eventAlias": "my:event",
    "enabled": true,
    "month": 12,
    "day": 31,
    "hour": null,
    "minute": null
}
```

#### Пример

```bash
curl 'http://localhost:8080/api/cron/web-api/get?id=66f3015b-bd10-4962-9698-764f05372d00'
```

### `/api/cron/web-api/delete`

Удаляет задачу с указанным id.

#### Параметры и возвращаемое значение

- `id` (guid) - id задачи.

В ответ на клиент возвражается `null`. Если задачу с заданным id не удалось найти, будет возвращен код ошибки 500. 

```js
null
```

#### Пример

```bash
curl 'http://localhost:8080/api/cron/web-api/delete?id=8c976936-1312-4aed-9939-b7b5140ac4b6'
```

### `/api/cron/web-api/list`

Возвращает список всех задач cron.

#### Параметры и возвращаемое значение

Метод `/api/cron/web-api/list` не имеет параметров. В ответ на клиент возвращается массив объектов, каждый из котрых содержит информацию об одной из задач.

```js
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
