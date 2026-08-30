using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.NooLite;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Scripts.Events;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.NooLite
{
    using CommandAttribute = NooLiteCommandHandlerAttribute;
    using CommandDelegate = NooLiteCommandHandlerDelegate;
    using MicroclimateAttribute = NooLiteMicroclimateDataHandlerAttribute;
    using MicroclimateDelegate = NooLiteMicroclimateDataHandlerDelegate;

    public class NooLitePlugin : PluginBase {
        /// <summary>Название события, которое генерируется при получении данных от адаптера</summary>
        public const string DataReceivedEventName = "noolite:data:received";

        /// <summary>Название события, которое генерируется при получении данных о микроклимате</summary>
        public const string MicroclimateDataReceivedEventName = "noolite:microclimate-data:received";

        /// <summary>Ключ словаря meta, в котором передается номер канала</summary>
        public const string ChannelMetaKey = "channel";

        /// <summary>Ключ словаря meta, в котором передается код команды</summary>
        public const string CommandMetaKey = "command";

        private MTRFXXAdapter device;
        private AdapterWrapper wrapper;
        private AdapterWrapper wrapperF;

        private readonly List<CommandDelegate> cmdHandlers = new List<CommandDelegate>();
        private readonly List<MicroclimateDelegate> microclimateHandlers = new List<MicroclimateDelegate>();

        private ScriptEventEmitter<NooLiteDataEventArgs> dataReceived;
        private ScriptEventEmitter<NooLiteMicroclimateEventArgs> microclimateDataReceived;

        public override void InitPlugin()
        {
            var portName = Configuration["portName"];

            if (string.IsNullOrEmpty(portName)) throw new Exception("noolite portName is required");

            Logger.LogInformation("Use {PortName} serial port", portName);

            device = new MTRFXXAdapter(portName);
            device.Connect += OnConnect;
            device.Disconnect += OnDisconnect;
            device.ReceiveData += OnReceiveData;
            device.ReceiveMicroclimateData += OnReceiveMicroclimateData;
            device.Error += OnError;

            wrapper = new AdapterWrapper(false, device, Logger);
            wrapperF = new AdapterWrapper(true, device, Logger);

            #region register handlers

            foreach (var plugin in Context.GetAllPlugins())
            {
                var pluginType = plugin.GetType();

                foreach (var mi in plugin
                    .FindMethods<CommandAttribute, CommandDelegate>())
                {
                    Logger.LogInformation(
                        "register noolite command handler: {Method} ({PluginType})",
                        mi.Method.Method.Name,
                        pluginType.FullName);
                    cmdHandlers.Add(mi.Method);
                }

                foreach (var mi in plugin
                    .FindMethods<MicroclimateAttribute, MicroclimateDelegate>())
                {
                    Logger.LogInformation(
                        "register noolite microclimate handler: {Method} ({PluginType})",
                        mi.Method.Method.Name,
                        pluginType.FullName);
                    microclimateHandlers.Add(mi.Method);
                }
            }

            #endregion
        }

        [ConfigureScriptEvents]
        public void RegisterScriptEvents(ScriptEventsConfigurationBuilder config)
        {
            dataReceived = config.RegisterEvent<NooLiteDataEventArgs>(DataReceivedEventName);
            microclimateDataReceived = config.RegisterEvent<NooLiteMicroclimateEventArgs>(MicroclimateDataReceivedEventName);
        }

        #region events

        private void OnError(object obj, Exception ex)
        {
            Logger.LogError(ex, "MTRF adapter error");
        }

        private void OnConnect(object obj)
        {
            Logger.LogInformation("MTRF adapter connected");
        }

        private void OnDisconnect(object obj)
        {
            Logger.LogInformation("MTRF adapter disconnected");
        }

        private void OnReceiveData(object obj, ReceivedData cmd)
        {
            _ = SafeInvokeAsync(cmdHandlers, h => h((byte)cmd.Command, cmd.Channel, cmd.DataFormat,
                cmd.Data1, cmd.Data2, cmd.Data3, cmd.Data4));

            var args = new NooLiteDataEventArgs
            {
                Command = (byte)cmd.Command,
                Channel = cmd.Channel,
                Format = cmd.DataFormat,
                Data1 = cmd.Data1,
                Data2 = cmd.Data2,
                Data3 = cmd.Data3,
                Data4 = cmd.Data4
            };

            // если плагина сценариев нет в системе, события не зарегистрированы
            dataReceived?.Invoke(args, new Dictionary<string, string>
            {
                [ChannelMetaKey] = args.Channel.ToString(),
                [CommandMetaKey] = args.Command.ToString()
            });
        }

        private void OnReceiveMicroclimateData(object obj, MicroclimateData data)
        {
            _ = SafeInvokeAsync(microclimateHandlers, h => h(data.Channel, data.Temperature, data.Humidity, data.LowBattery));

            var args = new NooLiteMicroclimateEventArgs
            {
                Channel = data.Channel,
                Temperature = data.Temperature,
                Humidity = data.Humidity,
                LowBattery = data.LowBattery
            };

            // если плагина сценариев нет в системе, события не зарегистрированы
            microclimateDataReceived?.Invoke(args, new Dictionary<string, string>
            {
                [ChannelMetaKey] = args.Channel.ToString()
            });
        }

        #endregion

        public override void StartPlugin()
        {
            device.Open();
        }

        public override void StopPlugin()
        {
            device.Dispose();
        }

        [TimerCallback(20000)]
        public void Reconnect(DateTime now)
        {
            device.Open();
        }

        [ScriptCommand("noolite")]
        public AdapterWrapper Open(bool fMode)
        {
            return fMode ? wrapperF : wrapper;
        }
    }
}
