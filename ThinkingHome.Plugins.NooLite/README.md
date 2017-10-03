*ThinkingHome.Plugins.NooLite*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.NooLite.svg)]()

# NooLitePlugin

Предоставляет API для управления освещением и электроприборами с помощью адаптера nooLite [MTRF-64-USB](http://thinking-home.ru/product/71.aspx).

## Конфигурация

Вы можете настраивать название serial порта, к которому подключен адаптер nooLite.

```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.NooLite.NooLitePlugin": {
            "portName": "/dev/tty.usbserial-AL00HDFI"
        }
    }
}
```

## API

### `AdapterWrapper Open(bool fMode)`

Метод `Open` возвращает экземпляр класса `ThinkingHome.Plugins.NooLite.AdapterWrapper`, предоставляющего API для управления адаптером.

*Параметры:*

- `bool fMode` - режим отправки команд: `false` - стандартный режим nooLite, `true` - режим nooLite-F (с шифрованием и обратной связью)

#### Пример

```csharp
var adapter = Context.Require<NooLitePlugin>()
    .Open(true);

// set brightness 255 in channel 13
adapter.SetBrightness(13, 255);
```

## API `AdapterWrapper`

### `void On(byte channel)`

Включает нагрузку в заданном канале.

*Параметры:*

- `byte channel` - номер канала

#### Пример

```csharp
adapter.On(13);
```

### `void Off(byte channel)`

Выключает нагрузку в заданном канале.

*Параметры:*

- `byte channel` - номер канала

#### Пример

```csharp
adapter.Off(13);
```

### `void SetBrightness(byte channel, byte brightness)`

Устанавливает яркость в заданном канале.

*Параметры:*

- `byte channel` - номер канала
- `byte brightness` - уровень яркости

#### Пример

```csharp
adapter.SetBrightness(13, 120);
```

### `void TemporarySwitchOn(byte channel, byte minutes)`

Включает нагрузку в заданном канале на заданное время.

*Параметры:*

- `byte channel` - номер канала
- `byte minutes` - длительность периода (в минутах)

#### Пример

```csharp
adapter.TemporarySwitchOn(13, 5);
```

### `void ChangeLedColor(byte channel)`

Изменяет цвет светодиодной RGB ленты, подключенной через управляющий блок [SD-1-180](http://thinking-home.ru/product/32.aspx), на другой цвет из предопределенного набора цветов.

*Параметры:*

- `byte channel` - номер канала

#### Пример

```csharp
adapter.ChangeLedColor(13);
```

### `void SetLedColor(byte channel, byte r, byte g, byte b)`

Устанавливает заданный цвет светодиодной RGB ленты.

*Параметры:*

- `byte channel` - номер канала
- `byte r` - уровень красного цвета
- `byte g` - уровень зеленого цвета
- `byte b` - уровень синего цвета

#### Пример

```csharp
adapter.SetLedColor(15, 255, 255, 0); // yellow
```

### `void LoadPreset(byte channel)`

Применяет ранее запомненный сценарий освещения в заданном канале.

*Параметры:*

- `byte channel` - номер канала

#### Пример

```csharp
adapter.LoadPreset(13);
```
