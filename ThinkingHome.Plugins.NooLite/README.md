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

Метод `Open` возвращает экземпляр класса `ThinkingHome.Plugins.NooLite.AdapterWrapper`, предоставляющего API для управления адаптером nooLite.

#### Параметры

- `bool fMode` - режим отправки команд: `false` - стандартный режим nooLite, `true` - режим nooLite-F (с шифрованием и обратной связью)

#### Пример

```csharp
var adapter = Context.Require<NooLitePlugin>()
    .Open(true);

// set brightness 255 in channel 13
adapter.SetBrightness(13, 255);
```

### `[NooLiteCommandHandler]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.NooLite.NooLiteCommandHandlerAttribute`. Метод вашего плагина будет автоматически вызываться при получении адаптером nooLite команд от других устройств.

Сигнатура метода, вызываемого при получении команды nooLite, должна соответствовать делегату `ThinkingHome.Plugins.NooLite.NooLiteCommandHandlerDelegate`:

```csharp
public delegate void NooLiteCommandHandlerDelegate(byte command, int channel, byte format, byte d1, byte d2, byte d3, byte d4);
```

#### Параметры

- `byte command` - код команды.
- `int channel` - канал, в котором получена команда.
- `byte format` - код формата данных.
- `byte d1` - данные, передаваемые с командой - байт 1
- `byte d2` - данные, передаваемые с командой - байт 2
- `byte d3` - данные, передаваемые с командой - байт 3
- `byte d4` - данные, передаваемые с командой - байт 4

Коды команд и форматов данных описаны в [документации](https://www.noo.com.by/assets/files/PDF/MTRF-64-USB.pdf) по API nooLite.

#### Пример

```csharp
[NooLiteCommandHandler]
public void MyNooLiteHandler(byte command, int channel, byte format, byte d1, byte d2, byte d3, byte d4)
{
    ...
}
```

### `[NooLiteMicroclimateDataHandler]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.NooLite.NooLiteMicroclimateDataHandlerAttribute`. Метод вашего плагина будет автоматически вызываться при получении адаптером nooLite данных о микроклимате (температуре/влажности).

Сигнатура метода, вызываемого при получении команды nooLite, должна соответствовать делегату `ThinkingHome.Plugins.NooLite.NooLiteMicroclimateDataHandlerDelegate`:

```csharp
public delegate void NooLiteMicroclimateDataHandlerDelegate(int channel, decimal temperature, int? humidity, bool lowBattery);
```

#### Параметры

- `int channel` - канал, в котором получена команда.
- `decimal temperature` - значение температуры в градусах, с точностью до 0.1°.
- `int? humidity` - значение влажности в % (для датчиков PT112, не измеряющих влажность, это поле будет содержать значение `null`).
- `bool lowBattery` - признак низкого уровня заряда батарейки датчика (`true` - низкий, `false` - нормальный).

#### Пример

```csharp
[NooLiteMicroclimateDataHandler]
public void MyNooLiteHandler(int channel, decimal temperature, int? humidity, bool lowBattery)
{
    ...
}
```

## API класса `AdapterWrapper`

### `void On(byte channel)`

Включает нагрузку в заданном канале.

#### Параметры

- `byte channel` - номер канала

#### Пример

```csharp
adapter.On(13);
```

### `void Off(byte channel)`

Выключает нагрузку в заданном канале.

#### Параметры

- `byte channel` - номер канала

#### Пример

```csharp
adapter.Off(13);
```

### `void SetBrightness(byte channel, byte brightness)`

Устанавливает яркость в заданном канале.

#### Параметры

- `byte channel` - номер канала
- `byte brightness` - уровень яркости

#### Пример

```csharp
adapter.SetBrightness(13, 120);
```

### `void TemporarySwitchOn(byte channel, byte minutes)`

Включает нагрузку в заданном канале на заданное время.

#### Параметры

- `byte channel` - номер канала
- `byte minutes` - длительность периода (в минутах)

#### Пример

```csharp
adapter.TemporarySwitchOn(13, 5);
```

### `void ChangeLedColor(byte channel)`

Изменяет цвет светодиодной RGB ленты, подключенной через управляющий блок [SD-1-180](http://thinking-home.ru/product/32.aspx), на другой цвет из предопределенного набора цветов.

#### Параметры

- `byte channel` - номер канала

#### Пример

```csharp
adapter.ChangeLedColor(13);
```

### `void SetLedColor(byte channel, byte r, byte g, byte b)`

Устанавливает заданный цвет светодиодной RGB ленты.

#### Параметры

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

#### Параметры

- `byte channel` - номер канала

#### Пример

```csharp
adapter.LoadPreset(13);
```

## API сценариев

### `noolite`

Возвращает объект, предоставляющий API для управления адаптером nooLite.

- `arguments[0]` -  режим отправки команд (`boolean`):
  - `false` - стандартный режим nooLite,
  - `true` - режим nooLite-F (с шифрованием и обратной связью)

API адаптера имеет набор команд/параметров, полностью аналогичный API для плагинов.

#### Пример

```js
var adapter = host.api.noolite(true);

// включить свет в 13 канале
adapter.on(13);

// выключить свет в 25 канале
adapter.off(25);

// установить яркость 99 в 3 канале
adapter.setBrightness(3, 99);

// включить свет в 10 канале на 5 минут
adapter.temporarySwitchOn(10, 5);

// изменить цвет светодиодной RGB ленты в 20 канале на другой
adapter.changeLedColor(20);

// установить зеленый цвет светодиодной RGB ленты в 20 канале
adapter.setLedColor(20, 0, 255, 0); // r: 0, g: 255, b: 0

// применить ранее запомненный световой сценарий в 50 канале
adapter.loadPreset(50);

```
