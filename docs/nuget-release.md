# Выпуск пакетов на nuget.org

Версию всех проектов решения задают `VersionPrefix` и `VersionSuffix` в корневом `Package.xml`. Например, значения `5.0.0` и `alpha.1` дают `5.0.0-alpha.1`. Для стабильного выпуска оставьте суффикс пустым.

Скрипт выпускает проекты из `ThinkingHome.sln` со свойством MSBuild `IsPackable=true`. В комплект входят инструмент `ThinkingHome.Console` (команда `th`), библиотеки и публичные плагины. Тесты, сервер `ThinkingHome.Repository` и локальный плагин `ThinkingHome.Plugins.Tmp` имеют `IsPackable=false`.

## GitHub Actions

1. В настройках репозитория GitHub создайте environment `nuget`. Добавьте в него секрет `NUGET_USER` со значением **имени профиля nuget.org**.
2. На nuget.org откройте **Trusted Publishing** и создайте политику для владельца выпускаемых пакетов. Укажите GitHub owner `thinking-home`, repository `system`, workflow file `publish-nuget.yml` и environment `nuget`. Выберите область `ThinkingHome.*` и разрешите публикацию новых пакетов и версий. [Настройка Trusted Publishing](https://learn.microsoft.com/en-us/nuget/nuget-org/trusted-publishing)
3. Когда файл workflow появится в основной ветке, откройте **Actions → Publish NuGet packages → Run workflow** и выберите ветку выпуска. По умолчанию workflow собирает пакеты, проверяет их метаданные, устанавливает CLI и Timer в изолированное окружение и сохраняет артефакт `nuget-release`.
4. Для выпуска включите **Publish the verified packages to nuget.org** при запуске. После успешной приёмки отдельное задание скачает проверенный артефакт, обменяет OIDC-токен GitHub на краткоживущий ключ NuGet и передаст его скрипту через переменную окружения `NUGET_API_KEY`.

## Локальная сборка и публикация

Нужны Bash 4+, GNU coreutils, unzip, yq v4 от Mike Farah, .NET SDK 10 и версия Node.js из `ThinkingHome.Plugins.WebUi/.nvmrc` с npm. На Windows используйте Git Bash и установите yq командой `winget install --id MikeFarah.yq --exact`. Из корня репозитория соберите комплект в пустой каталог. Для сборки ключ не требуется.

```sh
bash tools/publish-nuget.sh build
```

Архивы и файл контрольных сумм SHA-256 `release.json` появятся в `artifacts/nuget-release/<версия>/`. Проверку CLI и Timer можно повторить по [инструкции по локальной приёмке](cli-release.md).

Для публикации подготовленного комплекта задайте `NUGET_API_KEY` в окружении процесса. В Bash ключ можно ввести со скрытым вводом. Используйте ключ с правами на выпуск нужных идентификаторов. [Ключи API nuget.org](https://learn.microsoft.com/en-us/nuget/nuget-org/publish-a-package)

```bash
(
    read -rsp 'NuGet API key: ' NUGET_API_KEY
    echo
    export NUGET_API_KEY
    bash tools/publish-nuget.sh push
)
```

Команда `bash tools/publish-nuget.sh publish` выполняет сборку и отправку за один запуск. Все три команды принимают `--output <каталог>`. Перед первым запросом к NuGet скрипт сверяет состав, версию, метаданные и контрольные суммы комплекта. Внутренние зависимости отправляются раньше зависящих от них пакетов.

Если отправка прервалась, сохраните исходный каталог или скачайте артефакт того же запуска Actions. После проверки уже опубликованных идентификаторов и версий продолжите с тем же коммитом командой `bash tools/publish-nuget.sh push --output <каталог> --resume`. В этом режиме NuGet пропускает конфликты уже существующих версий. Для выпуска изменённых файлов поднимите общую версию и соберите новый комплект.

## Добавление проекта в выпуск

Добавьте проект в решение, подключите `Package.xml`, задайте предметное `Description`, дополните общие `PackageTags` и положите в каталог проекта `README.md` для страницы NuGet. Проект может указать другой файл через `PackageReadmeFile` и включить его в корень пакета. Общий файл задаёт версию, автора, лицензию и ссылки. Плагины импортируют `ThinkingHome.Plugin.targets`, по которому скрипт выбирает упаковщик с проверкой публичного контракта. Для локального приложения или тестов укажите `IsPackable=false`.
