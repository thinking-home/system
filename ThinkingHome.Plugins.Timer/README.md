*ThinkingHome.Plugins.Timer*

# TimerPlugin

Предоставляет API для периодического выполнения действий по таймеру.

## API для плагинов

Плагин, желающий выполнять действия по таймеру, должен реализовать интерфейс `ThinkingHome.Plugins.Timer` и в методе `RegisterTimers` добавить нужные таймеры. 

```c#
public class MyPLugin: PluginBase, ITimerOwner
{
    public void RegisterTimers(RegisterTimerDelegate addTimer)
    {
        // запускать каждые 7 секунд
        addTimer(MyTimerHandler, 7000);
    }
    
    public void MyTimerHandler(DateTime now)
    {
        Logger.Info("hello!");
    }
}
```
