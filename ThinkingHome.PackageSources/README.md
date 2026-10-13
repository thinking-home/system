# Клиент источников пакетов

Клиент получает версии, метаданные и архивы NuGet V3. Он не устанавливает плагины, не разрешает граф зависимостей и не изменяет appsettings. Метаданные, включая nuspec, доступны в результате `DownloadAsync` для последующего построения графа.

## Конфигурация

Скопируйте и настройте [sources.example.json](sources.example.json):

```json
{
  "pluginSources": ["http://127.0.0.1:5088/v3/index.json"],
  "librarySources": ["https://api.nuget.org/v3/index.json"]
}
```

Каждый адрес — HTTP(S) service index. Порядок внутри массива определяет приоритет. Неизвестные поля JSON, повтор источника в группе и URL другой схемы отклоняются. Учётные данные в URL не поддерживаются.

Плагин ищется только в pluginSources, библиотека — только в librarySources. Первый источник, где найден package ID, закрепляется за этим запросом. Список версий берётся из него; отсутствие нужной версии не переключает клиента на менее приоритетный источник. Это исключает смешивание версий одного ID из разных источников без явного изменения конфигурации.

404 списка версий означает отсутствие пакета и позволяет перейти к следующему источнику. Ошибки HTTP, сети и формата ответа завершают операцию; они не считаются отсутствием пакета. Отсутствие самого service index также является ошибкой конфигурации источника.

При скачивании клиент проверяет ту же ID/версию во всех остальных источниках выбранной группы. Одинаковые байты допустимы; разные SHA-512 означают конфликт и отказ. Недоступность дополнительного источника тоже останавливает проверку, поскольку отсутствие конфликта не подтверждено. Из другой группы источников пакет никогда не подставляется.

## Команды

Из корня репозитория:

```powershell
dotnet build ThinkingHome.PackageSources/ThinkingHome.PackageSources.csproj -m:1 -p:UseSharedCompilation=false
dotnet run --project ThinkingHome.PackageSources/ThinkingHome.PackageSources.csproj --no-build -- versions plugin ThinkingHome.PackageSources/sources.example.json ThinkingHome.Plugins.Timer
dotnet run --project ThinkingHome.PackageSources/ThinkingHome.PackageSources.csproj --no-build -- download plugin ThinkingHome.PackageSources/sources.example.json ThinkingHome.Plugins.Timer 4.0.0-alpha34 artifacts/downloads
dotnet run --project ThinkingHome.PackageSources/ThinkingHome.PackageSources.csproj --no-build -- download library ThinkingHome.PackageSources/sources.example.json Newtonsoft.Json 13.0.3 artifacts/downloads
```

Для первых двух запросов запустите [сервер репозитория](../ThinkingHome.Repository/README.md). Library-команда не обращается к серверу плагинов.

Команда download проверяет identity архива и, для plugin, метаданные плагина. Архив появляется в выходной папке только после успешной проверки, через временный файл. Существующий файл не перезаписывается. Имена архивов формируются из проверенных ID и нормализованных версий; конфигурация установки не создаётся.

## API

- `FindAsync(kind, id)` возвращает выбранный service index, обнаруженный PackageBaseAddress и версии.
- `DownloadAsync(kind, id, version)` возвращает источник, метаданные, исходные байты и SHA-512.
- `DownloadLockedAsync(source, kind, id, version)` скачивает точную версию из записанного в lock источника, независимо от нового приоритета. Источник должен присутствовать в соответствующей группе конфигурации. Сравнение с хешем lock выполняет менеджер пакетов.
- `DownloadToAsync(...)` сохраняет проверенный архив без перезаписи существующего файла.

HttpClient передаётся вызывающей стороной, что позволяет настраивать сеть и тестировать ответы. Каждый запрос ограничен 60 секундами, включая чтение тела; поддерживается CancellationToken. JSON-ответ ограничен 4 MiB, архив — 64 MiB. Полный обход распакованного архива ограничен 256 MiB. В минимальном профиле HTTP-запросы реализованы непосредственно через HttpClient, версии нормализуются библиотекой NuGet.Versioning.

## Проверки

Тесты входят в ThinkingHome.Packaging.Tests. Проверяются HTTP-цикл с локальным сервером, разделение источников, приоритеты, обработка 404 и ошибок сервера, конфликт содержимого, отказ принимать библиотеку как плагин, нормализация версии и сохранение файлов без перезаписи. Тесты не требуют внешней сети.

Дополнительно 13 октября 2026 года команда download успешно получила настоящий Newtonsoft.Json 13.0.3 с nuget.org в `artifacts/source-downloads`, без установки пакета в приложение. Linux отдельно не проверялся.
