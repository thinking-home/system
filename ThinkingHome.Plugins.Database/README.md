*ThinkingHome.Plugins.Database* [![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Database.svg)]()

# DatabasePlugin

Предоставляет другим плагинам API для хранения их информации в БД. Работа с БД реализована средствами [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core).

## Конфигурация

Строка подключения к БД настраивается с помощью параметра `connectionString` в файле appsettings.json.
В текущий момент поддерживается только СУБД PostgreSQL.

```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.Database.DatabasePlugin": {
            "connectionString": "host=localhost;port=5432;database=postgres;user name=postgres;password=123"
        }
    }
}
```

## API

### `[DbModelBuilder]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.Database.DbModelBuilderAttribute` и реализовать там логику по настройке мэппинга вашей модели на структуру БД, используя EF Fluent API.

Сигнатура метода, вызываемого по таймеру, должна соответствовать делегату `DbModelBuilderDelegate`:

```csharp
public delegate void DbModelBuilderDelegate(ModelBuilder modelBuilder);
```

#### Пример

```csharp
[DbModelBuilder]
public void InitModel(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<User>();
    modelBuilder.Entity<Sensor>();
}
```

### `DbContext OpenSession()`

Метод `OpenSession` возвращает экземпляр `DbContext` для получения и сохранения данных в БД.

#### Пример

```csharp
using (var db = Context.Require<DatabasePlugin>().OpenSession())
{
    foreach (var user in db.Set<Users>())
    {
        Logger.LogInformation($"{user.Name} ({user.Id})");
    }
}

```

## Миграция структуры БД

Для миграции структуры БД используется библиотека [ThinkingHome.Migrator](https://github.com/thinking-home/migrator).
С ее помощью вы можете настроить автоматическое создание необходимых объектов БД (таблиц, ограничений, индексов и т.д.)

### Схема использования

1. Подключите в проект своего плагина пакет [ThinkingHome.Migrator.Framework](https://www.nuget.org/packages/ThinkingHome.Migrator.Framework).

1. Для каждой порции изменений БД создайте миграцию - класс, унаследованный от `ThinkingHome.Migrator.Framework.Migration`.

1. Отметьте каждый класс миграции атрибутом `ThinkingHome.Migrator.Framework.MigrationAttribute` и укажите в его параметрах номер версии. Миграции будут применяться в порядке возрастания номера версии.

1. Реализуйте для каждого класса миграции метод `public void Apply()`, в котором с помощью специального API укажите, какие изменения БД нужно выполнить в рамках миграции.

При старте приложения нужные изменения БД будут выполнены автоматически.

#### Пример

```csharp
[Migration(1)]
public class Migration01 : Migration
{
    public override void Apply()
    {
        Database.AddTable("User",
            new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
            new Column("Name", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull),
            new Column("Age", DbType.Int32, ColumnProperty.NotNull)
        );
    }
}
```
