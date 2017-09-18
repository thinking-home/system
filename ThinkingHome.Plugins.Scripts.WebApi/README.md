*ThinkingHome.Plugins.Scripts.WebApi*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Scripts.WebApi.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.Scripts.WebApi)

# ScriptsWebApiPlugin

Предоставляет HTTP API для управления сценариями и сценарными событиями. 

## HTTP API

### `/api/scripts/web-api/save`

Сохраняет в системе информацию о сценарии: его название и текст.

#### Параметры и возвращаемое значение

- `id` (guid) - id ранее сохраненного сценария. Если этот параметр не указан, будет создан новый сценарий.  
- `name` (string) - название сценария, по которому к нему можно будет обращаться из других сценариев и плагинов.
- `body` (string) - текст сценария на языке JavaScript.

В ответ на клиент возвращается строка, содержащая id сохраненного сценария.

```js
"21222eed-5a92-42ad-b7c9-23f548482024"
```

#### Пример

```bash
curl 'http://localhost:8080/api/scripts/web-api/save?name=say-hello&body=host.log.fatal(%22hello%20world%22);'
```

### `/api/scripts/web-api/get`

Получает информацию о ранее сохраненном сценарии.

#### Параметры и возвращаемое значение

- `id` (guid) - id сценария.

В ответ на клиент возвражается объект, содержащий id, название и текст заданного сценария.

```js
{
    "id":"21222eed-5a92-42ad-b7c9-23f548482024",
    "name":"say-hello",
    "body":"host.log.fatal(\"hello world\");"
}
```

#### Пример

```bash
curl 'http://localhost:8080/api/scripts/web-api/get?id=21222eed-5a92-42ad-b7c9-23f548482024'
```

### `/api/scripts/web-api/delete`

Удаляет сценарий с указанным id.

#### Параметры и возвращаемое значение

- `id` (guid) - id сценария.

В ответ на клиент возвражается `null`. Если сценарий с заданным id не удалось найти, будет возвращен код ошибки 500. 

```js
null
```

#### Пример

```bash
curl 'http://localhost:8080/api/scripts/web-api/delete?id=21222eed-5a92-42ad-b7c9-23f548482024'
```

### `/api/scripts/web-api/list`

Возвращает список сценариев, сохраненных в системе.

#### Параметры и возвращаемое значение

Для этого запроса не нужно передавать никаких параметров.

В ответ на клиент возвражается список сценариев, содержащий их id и названия.

```js
[
    {
        "id":"a634a269-d250-40bc-a9ca-0e76b19d84b5",
        "name":"debug-tool"
    },
    {
        "id":"57a79a81-3045-46f0-a76c-6f0f2fafde24",
        "name":"say-hello"
    }
]
```

#### Пример

```bash
curl 'http://localhost:8080/api/scripts/web-api/list'
```

### `/api/scripts/web-api/execute`

Запускает сценарий с указанным id.

#### Параметры и возвращаемое значение

- `id` (guid) - id сценария.

В ответ на клиент возвражается значение, которое было возвращено из сценария через `return`. Если сценарий не имеет возвращаемого значения, на клиент будет возвращен `null`. 

#### Пример

```bash
curl 'http://localhost:8080/api/scripts/web-api/execute?id=c91f45c6-2da1-4cc6-a2b8-8190adf5144f'
```

### `/api/scripts/web-api/subscription/list`

Возвращает список сценариев, подписанных на сценарные события.

#### Параметры и возвращаемое значение

Для этого запроса не нужно передавать никаких параметров.

В ответ на клиент возвражается список, содержащий id *подписки на событие*, название события, а также id и название сценария.

```js
[
    {
        "id":"b308f0e7-7f0c-4599-ba89-65cff22ae043",
        "scriptId":"a634a269-d250-40bc-a9ca-0e76b19d84b5",
        "scriptName":"say-hello",
        "eventAlias":"я дома"
    },
    {
        "id":"ab4ef0e7-7f0c-4599-ba89-65cff22ae756",
        "scriptId":"57a79a81-3045-46f0-a76c-6f0f2fafde24",
        "scriptName":"debug-tool",
        "eventAlias":"my-event"
    }
]
```

### `/api/scripts/web-api/subscription/add`

Добавляет подписку сценария на заданное сценарное событие.

#### Параметры и возвращаемое значение

- `scriptId` (guid) - id сценария.
- `eventAlias` (string) - название события.

В ответ на клиент возвращается строка, содержащая id добавленной подписки.

```js
"fa170f1a-4665-40df-884b-307f0731fa86"
```

#### Пример

```bash
curl 'http://localhost:8080/api/scripts/web-api/subscription/add?scriptId=a634a269-d250-40bc-a9ca-0e76b19d84b5&eventAlias=my-event'
```

### `/api/scripts/web-api/subscription/delete`

Удаляет подписку сценария на сценарное событие.

#### Параметры и возвращаемое значение

- `subscriptionId` (guid) - id удаляемой подписки.

В ответ на клиент возвражается `null`. Если подписка с заданным id не найдена, будет возвращен код ошибки 500. 

```js
null
```

#### Пример

```bash
curl 'http://localhost:8080/api/scripts/web-api/subscription/delete?subscriptionId=fa170f1a-4665-40df-884b-307f0731fa86'
```
