*ThinkingHome.Plugins.Cron.WebApi* 

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Cron.WebApi.svg)]()

# CronWebApiPlugin

Предоставляет HTTP API для управления расписанием запуска задач [cron](../ThinkingHome.Plugins.Cron/README.md).

## HTTP API

### `/api/cron/web-api/save`

Сохраняет в системе информацию о задаче cron.

#### Параметры и возвращаемое значение

- `id` (guid) - id ранее сохраненной задачи cron. Если этот параметр не указан, будет создана новая задача.  
- `name` (string, required) - название задачи для отображения в интерфейсе.
- `enabled` (boolean, required) - признак "задача активна".
- `eventName` (string) - имя пользовательского сценарного события. 
- `expression` (string, required) - [выражение cron](../ThinkingHome.Plugins.Cron/README.md#формат-выражения). Формат проверяется при сохранении: на некорректное выражение возвращается код ошибки 400.

В ответ на клиент возвращается id сохраненной задачи.

```js
{"taskId":"21222eed-5a92-42ad-b7c9-23f548482024"}
```


#### Пример

```bash
curl 'http://localhost:8080/api/cron/web-api/save?id=66f3015b-bd10-4962-9698-764f05372d00&name=mimi&enabled=true&expression=0%2013%20*%20*%20*'
```

### `/api/cron/web-api/get`

Получает информацию о ранее сохраненной задаче.

#### Параметры и возвращаемое значение

- `id` (guid, required) - id задачи.

В ответ на клиент возвражается объект, содержащий информацию о заданной задаче. Если задачу с заданным id не удалось найти, будет возвращен код ошибки 500.

```js
{
    "id":"05bc5fc2-5a96-4a00-bd45-ff1ade40d019",
    "name": "My task name",
    "eventName": "my:event",
    "enabled": true,
    "expression": "0 0 31 12 *",
    "description": "В 00:00, 31 декабря"
}
```

Поле `description` — человекочитаемое описание выражения на языке системы (см. [`describe`](#apicronweb-apidescribe)); `null`, если построить описание не удалось.

#### Пример

```bash
curl 'http://localhost:8080/api/cron/web-api/get?id=66f3015b-bd10-4962-9698-764f05372d00'
```

### `/api/cron/web-api/delete`

Удаляет задачу с указанным id.

#### Параметры и возвращаемое значение

- `id` (guid, required) - id задачи.

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
        "eventName": "my:event",
        "enabled": true,
        "expression": "0 0 31 12 *",
        "description": "В 00:00, 31 декабря"
    },
    ...    
]
```

#### Пример

```bash
curl 'http://localhost:8080/api/cron/web-api/list'
```

### `/api/cron/web-api/describe`

Проверяет формат выражения cron и строит его человекочитаемое описание.

Формат проверяется тем же парсером, который исполняет расписание (NCrontab). Описание строится библиотекой [CronExpressionDescriptor](https://www.nuget.org/packages/CronExpressionDescriptor) на языке системы (настройка `culture`); переводы описаний — стандартные satellite assemblies .NET, поэтому при добавлении нового языка в систему здесь ничего настраивать не нужно (если языка нет среди переводов библиотеки, описание будет на английском).

#### Параметры и возвращаемое значение

- `expression` (string, required) - выражение cron.

```js
{
    "valid": true,
    "description": "Каждые 5 минут"
}
```

Для некорректного выражения возвращается `{"valid": false, "description": null}`; `description` может быть `null` и для корректного выражения, если построить описание не удалось.

#### Пример

```bash
curl 'http://localhost:8080/api/cron/web-api/describe?expression=*%2F5%20*%20*%20*%20*'
```
