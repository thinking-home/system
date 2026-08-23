*ThinkingHome.Plugins.WebUi*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.WebUi.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.WebUi)

# WebUiPlugin

Реализует инфраструктуру веб-интерфейса системы.

Технически, веб-интерфейс представляет собой модульное одностраничное приложение на [React](https://reactjs.org/) и [Mantine](https://mantine.dev/).

В плагине WebUiPlugin реализованы:

- общая разметка страницы (вертикальное навигационное меню и область для контента),
- набор готовых UI-компонентов (кит), доступный разделам интерфейса,
- светлая и темная цветовые схемы с переключением,
- загрузка разделов интерфейса с сервера по требованию и отображение их содержимого,
- роутинг (механизм перехода между разделами, в зависимости от адреса в адресной строке),
- локализация (механизм для отображения в интерфейсе текстов на выбранном в настройках языке),
- API для получения данных с сервера с возможностью валидации формата данных
- API для работы с клиент-серверной шиной сообщений (message hub)
- API для показа всплывающих сообщений
- API для логирования

Веб-интерфейс открывается по корневому адресу веб-сервера.

Каждый раздел интерфейса — это самодостаточный ES-модуль (бандл), который хост
загружает по требованию через нативный `import(url)`. Общие библиотеки (React,
react-router, `@thinking-home/ui`, `@mantine/core` и т. д.) не вшиваются в бандлы
разделов — хост раздаёт их как отдельные ESM-модули и подключает через
[import map](https://developer.mozilla.org/docs/Web/HTML/Element/script/type/importmap),
так что все разделы используют один общий экземпляр React и один экземпляр кита.

Список общих модулей задаёт `@thinking-home/ui` и обновляется вместе с этим пакетом.

## API

### `[ConfigureWebUi]`

Вы можете пометить метод своего плагина атрибутом `ThinkingHome.Plugins.WebUi.Attributes.ConfigureWebUiAttribute` и внутри этого метода через специальный API добавить дополнительные разделы в веб-интерфейс. Сигнатура метода должна соответствовать делегату `ThinkingHome.Plugins.WebUi.Attributes.ConfigureWebUiDelegate`: метод должен принимать один параметр типа `ThinkingHome.Plugins.WebUi.WebUiConfigurationBuilder` и не должен возвращать никакое значение. Вы можете добавить дополнительные разделы в веб-интерфейс с помощью метода `RegisterPage` объекта `WebUiConfigurationBuilder`.

#### Пример

```csharp
[ConfigureWebUi]
public void RegisterWebUiPages(WebUiConfigurationBuilder config)
{
    config.RegisterPage("/page1", "ThinkingHome.Plugins.Tmp.Resources.app.page1.js");
    config.RegisterPage("/page2", "ThinkingHome.Plugins.Tmp.Resources.app.page2.js");
}
```

В качестве значения первого параметра нужно передать URL добавляемой страницы. Вторым параметром нужно передать путь к файлу в ресурсах DLL, который реализует интерфейс добавляемого раздела.

Сборщик `th-build` кладет рядом с каждым бандлом его сжатые копии (`.gz` и `.br`). Чтобы клиент получал их вместо исходного файла, укажите пути к копиям вместе с бандлом — второй параметр `RegisterPage` принимает `ThinkingHome.Plugins.WebServer.Handlers.StaticResource`:

```csharp
private const string APP = "ThinkingHome.Plugins.Tmp.Resources.app.";

private static StaticResource Bundle(string name) =>
    new($"{APP}{name}", $"{APP}{name}.gz", $"{APP}{name}.br");

[ConfigureWebUi]
public void RegisterWebUiPages(WebUiConfigurationBuilder config)
{
    config.RegisterPage("/page1", Bundle("page1.js"));
    config.RegisterPage("/page2", Bundle("page2.js"));
}
```

Подробнее — в описании [предсжатых ресурсов](../ThinkingHome.Plugins.WebServer/README.md#предсжатые-ресурсы).

## Клиентская инфраструктура

Любая страница веб-интерфейса системы – это небольшая программа на языке JavaScript. Она описывает, что именно должен видеть пользователь на экране и какие действия должны быть выполнены, когда пользователь взаимодействует с элементами интерфейса.

### Подготовка окружения для разработки

Сборку клиентского кода целиком берёт на себя `@thinking-home/ui` — вам **не нужно**
добавлять в проект Vite, webpack или конфиги сборки. Достаточно раннера `th-build`,
который поставляется вместе с библиотекой.

1. Создайте в корне проекта файл `package.json`. Лёгкий вариант его создания — запустить в терминале команду `npm init -y`.
2. Добавьте в свой проект необходимые клиентские библиотеки:
   ```shell
   $ npm i @thinking-home/ui @thinking-home/i18n react react-router-dom valibot @mantine/core @mantine/hooks
   $ npm i -D typescript @types/react
   ```
   (React, react-router, `@thinking-home/ui` и пакеты кита `@mantine/core` и
   `@mantine/hooks` при сборке помечаются как внешние и резолвятся хостом через
   import map, поэтому нужны только для проверки типов; `valibot` для валидации
   данных вшивается в бандл раздела.)
3. Создайте в корне файл `tsconfig.json` со следующим содержимым:
   ```json
   {
     "compilerOptions": {
       "target": "es2020",
       "module": "esnext",
       "moduleResolution": "bundler",
       "jsx": "react",
       "allowJs": true,
       "allowSyntheticDefaultImports": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "noImplicitAny": true,
       "noEmit": true
     },
     "include": ["frontend"]
   }
   ```
4. Создайте файл с расширением `.tsx`, который будет основным файлом страницы (например, `./frontend/myPage.tsx`).
5. Опишите точки входа и команды сборки в `package.json`. Точки входа задаются в поле
   `thPlugin.entries` (имя бандла → путь к файлу раздела), а сборка запускается
   раннером `th-build` — он собирает каждую точку входа в отдельный ESM-бандл в папку,
   указанную в `--outDir`:
   ```json
   {
     "thPlugin": {
       "entries": {
         "myPage": "frontend/myPage.tsx"
       }
     },
     "scripts": {
       "build:development": "th-build --mode development --outDir Resources/app",
       "build:production": "th-build --outDir Resources/app"
     }
   }
   ```
6. Настройте сборку клиентского кода при сборке DLL и включение собранных файлов в ресурсы.
   Для этого отредактируйте `.csproj` файл своего плагина:
   ```xml
   <Project Sdk="Microsoft.NET.Sdk">
       <!-- ... -->
       <Target Name="NpmInstall" Inputs="package.json" Outputs="node_modules/.install-stamp">
           <Exec Command="npm ci" />
           <Touch Files="node_modules/.install-stamp" AlwaysCreate="true" />
       </Target>
       <Target Name="BuildClient" DependsOnTargets="NpmInstall" BeforeTargets="Build">
           <Exec Command="npm run build:production" Condition="'$(Configuration)' == 'Release'" />
           <Exec Command="npm run build:development" Condition="'$(Configuration)' != 'Release'" />
       </Target>
       <ItemGroup>
           <None Remove="Resources\**\*" />
       </ItemGroup>
       <ItemGroup>
           <EmbeddedResource Include="Resources\**\*" />
       </ItemGroup>
   </Project>
   ```

Теперь мы можем писать в файле, созданном на 4 шаге, код, который реализует наш новый раздел интерфейса. При сборке DLL (`dotnet build`) сначала запустится `th-build` — из исходного кода на TypeScript будет собран клиентский бандл, — а затем собранный файл попадёт в ресурсы DLL.

В коде своего плагина вы можете передать путь к собранному файлу в ресурсах DLL в метод `RegisterPage` и новый раздел, который вы реализовали, начнет отображаться в интерфейсе.

### Как добавить раздел в веб-интерфейс

Для добавления новой страницы в веб-интерфейс создайте react-компонент, который будет отображать её содержимое. Далее при помощи хелпера `createModule` нужно создать модуль — специальную обертку, благодаря которой новый раздел встраивается в веб-интерфейс системы. Созданный экземпляр модуля нужно экспортировать по умолчанию (`export default`).

#### Пример

```tsx
import * as React from 'react';
import {FC} from 'react';
import {createModule} from '@thinking-home/ui';

const MySection: FC = () => {
    return (
        <div>
            <p>This is the <strong>Test page</strong></p>
        </div>
    );
};

export default createModule(MySection);
```

Для переходов между страницами используйте компонент `Link` из библиотеки `react-router-dom`.

#### Как загрузить данные и провалидировать их формат

Библиотека `@thinking-home/ui` предоставляет хук `useAppContext`, позволяющий получить экземпляр API для загрузки данных с сервера. Методы API получают первым параметром [схему valibot](https://valibot.dev/), которая будет валидировать формат данных, полученных от сервера. Если сервер пришлёт данные не в том формате, то будет сгенерировано исключение.

#### Пример

```tsx
import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import * as v from 'valibot';
import {createModule, useAppContext} from '@thinking-home/ui';

// описываем формат данных
const myResponseSchema = v.object({
   id: v.string(),
   name: v.string(),
   size: v.number(),
});

// получаем из схемы тип данных
type MyResponse = v.InferOutput<typeof myResponseSchema>;

const ExampleSection: FC = () => {
   const [data, setData] = useState<MyResponse>();

   // получаем экземпляр API из хука useAppContext
   const {api} = useAppContext();

   useEffect(() => {
      // делаем запрос за данными на заданный url
      // первым параметром передаем схему, которая провалидирует полученные данные
      api.get(myResponseSchema, {url: '/get/my/data'}).then(setData)
   }, []);

   if (!data) {
       return <div>LOADING...</div>;
   }

   // если данные уже загружены, отображаем их, иначе отображаем "LOADING"
   return <div>Name: {data.name}, size: {data.size}</div>
};

export default createModule(ExampleSection);
```

### UI-кит

Для разметки разделов используется кит [Mantine](https://mantine.dev/). Его компоненты и хуки хост раздаёт как общие модули, поэтому в бандл раздела они не попадают — пишите обычные импорты:

```tsx
import * as React from 'react';
import {FC} from 'react';
import {Button, Group, Title} from '@mantine/core';
import {createModule} from '@thinking-home/ui';

const MySection: FC = () => (
    <>
        <Title order={1}>Пример раздела</Title>
        <Group>
            <Button>Кнопка</Button>
        </Group>
    </>
);

export default createModule(MySection);
```

Оборачивать раздел в `MantineProvider` и импортировать стили кита не нужно — это уже сделано в приложении.

Общими раздаются только `@mantine/core` и `@mantine/hooks`. Остальные пакеты Mantine (например, `@mantine/dates` или `@mantine/charts`) вы можете использовать, но они вместе со своими стилями увеличат бандл раздела.

#### Цветовая схема

В интерфейсе есть светлая и темная цветовые схемы. Схему выбирает пользователь кнопкой в навигационном меню, выбор сохраняется в `localStorage` браузера; при первом открытии интерфейса используется светлая схема.

Компоненты кита подстраиваются под текущую схему автоматически. Если в разделе нужно узнать значение схемы (например, чтобы выбрать вариант картинки), используйте хук `useComputedColorScheme` из `@mantine/core`.

### Локализация

В инфрастуктуре веб-интерфейса реализован API для локализации. Для работы с переводами используется мини-библиотека [@thinking-home/i18n](https://github.com/thinking-home/i18n). В интерфейсе вам автоматически будут доступны все ключи, которые есть в ресурсах текущего плагина.

Чтобы использовать в компонентах интерфейса строки на нужном языке, необходимо описать набор ключей с текстами по умолчанию:

```ts
import {Keyset, text} from '@thinking-home/i18n';

const keyset = new Keyset('en', {
   hello: text('Hello, {name}!'),
   sendMessage: text('Send message'),
});
```

Внутри компонента используйте хук `useKeyset` из библиотеки `@thinking-home/ui`:

```tsx
import {useKeyset} from '@thinking-home/ui';

const MyComponent: FC = () => {
    const {t} = useKeyset(keyset);
    
    return <button>{t('sendMessage')}</button>;
}
```

Вы можете добавлять в тексты значения параметров (в том числе, сложные объекты, например, react компоненты) и описывать тексты, которые зависят от числового значения. Узнайте в [документации](https://github.com/thinking-home/i18n#readme), как это сделать.

### Настройки стартовой страницы (TBD)

### Шина сообщений

Из контекста приложения, который предоставляет `useAppContext` из библиотеки `@thinking-home/ui`, вы также можете получить экземпляр API для работы с клиент-серверной шиной сообщений, которую предоставляет плагин `WebServerPlugin`.

```tsx
import {createModule, useAppContext} from '@thinking-home/ui';

const ExampleSection: FC = () => {
    const {messageHub} = useAppContext();
    
    const onClick = useCallback(() => {
        // отправляем сообщение в канал 'my-topic'
        messageHub.send('my-topic', {name: 'John', age: 42});
    }, [messageHub.send]);
    
    return <button onClick={onClick}>Send</button>;
}

export default createModule(ExampleSection);
```

Также библиотека `@thinking-home/ui` предоставляет хук `useMessageHandler`, при помощи которого вы можете подписываться на сообщения в шине. Когда компонент удаляется со страницы, подписка будет отменена. 

```tsx
import {useMessageHandler} from '@thinking-home/ui';
import * as v from 'valibot';

const ExampleSection: FC = () => {
   const [lastMessage, setLastMessage] = useState<string>();

   useMessageHandler(
       'my-topic',      // топик шины сообщений, в котором нужно слушать сообщения
       v.string(),      // valibot-схема для валидации данных полученного сообщения
       msg => setLastMessage(msg.data), // callback, который будет вызван для каждого сообщения
       [setLastMessage], // список зависимостей callback (аналогично useCallback)
   );

   return <p>Last message: {lastMessage}</p>;
}
```

### Нотификация

Контекст приложения, полученный через хук `useAppContext`, содержит также API для показа всплывающих сообщений пользователю. Сообщения показывает кит — [@mantine/notifications](https://mantine.dev/x/notifications/); в разделе достаточно вызвать нужный метод.

```tsx
import {useAppContext} from '@thinking-home/ui';

const MySection: FC = () => {
    const {toaster: {show, showError}} = useAppContext();

    const onMessage = useCallback(() => show("Example message"), [show]);
    const onError = useCallback(() => showError(<b>Example error</b>), [showError]);

    return (
        <p>
            <button onClick={onMessage}>Example message</button>
            <button onClick={onError}>Example error</button>
        </p>
    );
}
```

### Клиентское логирование

Платформа предоставляет API для клиентского логирования. Вы можете получить экземпляр логгера с помощью хука `useLogger`. Для каждого сообщения в логе нужно указать уровень логирования (`Trace`, `Debug`, `Information`, `Warning`, `Error`, `Fatal`) и текст сообщения (`string`).

```tsx
import {LogLevel, useLogger} from '@thinking-home/ui';

const MyContent: FC = () => {
   const logger = useLogger();

   logger.log(LogLevel.Debug, "render: MyContent")

   const onClick = useCallback(
           () => logger.log(LogLevel.Information, "click: Example button"),
           [logger],
   );

   return <button onClick={onClick}>Click me</button>;
}
```

### Повторная инициализация приложения

После старта приложения будет создана глобальная функция `__RELOAD_TH_APP__`. При вызове этой функции текущее приложение будет удалено со страницы (размонтированы react компоненты, остановлены ajax активные запросы, закрыто соединение с шиной сообщений), а сразу после этого приложение будет проинициализировано заново. Функция `__RELOAD_TH_APP__` возвращает `Promise<void>`.

```tsx
window.__RELOAD_TH_APP__().then(() => console.log('DONE'))
```
