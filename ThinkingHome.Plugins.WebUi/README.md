*ThinkingHome.Plugins.WebUi*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.WebUi.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.WebUi)

# WebUiPlugin

Реализует инфраструктуру веб-интерфейса системы.

Технически, веб-интерфейс представляет собой модульное одностраничное приложение на [React](https://reactjs.org/) и [Twitter Bootstrap](https://getbootstrap.com/).

В плагине WebUiPlugin реализованы:

- общая разметка страницы (навигационное меню и область для контента),
- загрузка разделов интерфейса с сервера по требованию и отображение их содержимого,
- роутинг (механизм перехода между разделами, в зависимости от адреса в адресной строке),
- локализация (механизм для отображения в интерфейсе текстов на выбранном в настройках языке),
- API для получения данных с сервера с возможностью валидации формата данных
- API для работы с клиент-серверной шиной сообщений (message hub)
- API для показа всплывающих сообщений
- API для логирования

Веб-интерфейс открывается по корневому адресу веб-сервера.

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

## Клиентская инфраструктура

Любая страница веб-интерфейса системы – это небольшая программа на языке JavaScript. Она описывает, что именно должен видеть пользователь на экране и какие действия должны быть выполнены, когда пользователь взаимодействует с элементами интерфейса.

### Подготовка окружения для разработки

1. Создайте в корне проекта файл `package.json`. Лёгкий вариант его создания — запустить в терминале команду `npm init -y`.
2. Добавьте в свой проект необходмые клиентские библиотеки:
   ```shell
   $ npm i typescript react @types/react react-router-dom webpack webpack-cli ts-node @types/node io-ts fp-ts @thinking-home/ui @thinking-home/i18n
   ```
3. Создайте в корне файл tsconfig.json со следующим содержимым:
   ```json
   {
     "compilerOptions": {
       "noImplicitAny": true,
       "module": "esnext",
       "target": "es6",
       "jsx": "react",
       "allowJs": true,
       "moduleResolution": "node",
       "allowSyntheticDefaultImports": true
     },
     "ts-node": {
       "compilerOptions": {
         "module": "CommonJS",
         "esModuleInterop": true
       }
     }
   }
   ```
4. Создайте файл с расширением `.tsx`, который будет основным файлом страницы (например, `./frontend/myPage.tsx`).
5. Создайте в корне проекта конфиг для сборки — файл `webpack.config.ts`, импортируйте в нем хелпер `initWebpackConfig` из библиотеки `@thinking-home/ui` и с его помощью подготовьте конфигурацию сборки.
   ```typescript
   import {resolve} from "path";
   import {initWebpackConfig} from '@thinking-home/ui/dist/tools/build';
   
   // список корневых файлов разделов
   const pages = {
       myPage: './frontend/myPage.tsx',
   };
   
   // путь к папке, куда нужно поместить собранный бандл
   const resultPath = resolve(__dirname, 'Resources/app');
   
   // генерируем конфигурацию сборки и экспортируем её
   export default initWebpackConfig(pages, resultPath);
   ``` 

6. Добавьте в package.json команду для сборки клиентского кода:
   ```json lines
   {
       // ...
       "scripts": {
           "build": "webpack --mode=production",
       }
   }
   ```
7. Настройте включение собранных файлов в ресурсы DLL. Для этого отредактируйте `.csproj` файл своего плагина:
   ```xml
   <Project Sdk="Microsoft.NET.Sdk">
       <!-- ... -->
       <ItemGroup>
           <None Remove="Resources\**\*" />
       </ItemGroup>
       <ItemGroup>
           <EmbeddedResource Include="Resources\**\*" />
       </ItemGroup>
   </Project>
   ```

Теперь мы можем писать в файле, созданном на 4 шаге, код, который реализует наш новый раздел интерфейса. При запуске команды `npm run build` из исходного кода на TypeScript будет собран клиентский бандл, содержащий код на JavaScript. Далее при сборке DLL (`dotnet build`) собранный файл попадет в ресурсы DLL.

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

Библиотека `@thinking-home/ui` предоставляет хук `useAppContext`, позволяющий получить экземпляр API для загрузки данных с сервера. Методы API получают первым параметром [decoder](https://gcanti.github.io/io-ts/modules/Decoder.ts.html), который будет валидировать формат данных, полученных от сервера. Если сервер пришлёт данные не в том формате, то будет сгенерировано исключение.

#### Пример

```tsx
import * as d from 'io-ts/Decoder';
import {createModule, useAppContext} from '@thinking-home/ui';

// описываем формат данных
const myResponseDecoder = d.struct({
   id: d.string,
   name: d.string,
   size: d.number,
});

// получаем из декодера тип данных 
type MyResponse = d.TypeOf<typeof myResponseDecoder>;

const ExampleSection: FC = () => {
   const [data, setData] = useState<MyResponse>();
   
   // получаем экземпляр API из хука useAppContext
   const {api} = useAppContext();

   useEffect(() => {
      // делаем запрос за данными на заданный url
      // первым параметром передаем декодер, который будет валидировать полученные данные
      api.get(myResponseDecoder, {url: '/get/my/data'}).then(setData)
   }, []);
   
   if (!data) {
       return <div>LOADING...</div>;
   }

   // если данные уже загружены, отображаем их, иначе отображаем "LOADING"
   return <div>Name: {data.name}, size: {data.size}</div>
};

export default createModule(ExampleSection);
```

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
import * as d from 'io-ts/Decoder';

const ExampleSection: FC = () => {
   const [lastMessage, setLastMessage] = useState<string>();

   useMessageHandler(
       'my-topic',      // топик шины сообщений, в котором нужно слушать сообщения
       d.string,        // декодер io-ts для обработки полученных данных
       msg => setLastMessage(msg.data), // callback, который будет вызван для каждого сообщения
       [setLastMessage], // список зависимостей callback (аналогично useCallback)
   );

   return <p>Last message: {lastMessage}</p>;
}
```

### Нотификация

Контекст приложения, полученный через хук `useAppContext`, содержит также API для показа всплывающих сообщений пользователю. Сообщения реализованы с помощью библиотеки [react-toastify](https://fkhadra.github.io/react-toastify).

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
