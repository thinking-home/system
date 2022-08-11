using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.NooLite;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.NooLite
{
    using CommandAttribute = NooLiteCommandHandlerAttribute;
    using CommandDelegate = NooLiteCommandHandlerDelegate;
    using MicroclimateAttribute = NooLiteMicroclimateDataHandlerAttribute;
    using MicroclimateDelegate = NooLiteMicroclimateDataHandlerDelegate;

    public class NooLitePlugin : PluginBase
    {
        private readonly ScriptsPlugin scripts;
        private MTRFXXAdapter device;
        private AdapterWrapper wrapper;
        private AdapterWrapper wrapperF;

        private readonly List<CommandDelegate> cmdHandlers = new List<CommandDelegate>();
        private readonly List<MicroclimateDelegate> microclimateHandlers = new List<MicroclimateDelegate>();

        public NooLitePlugin(ScriptsPlugin scripts)
        {
            this.scripts = scripts;
        }

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
            SafeInvokeAsync(cmdHandlers, h => h((byte)cmd.Command, cmd.Channel, cmd.DataFormat,
                cmd.Data1, cmd.Data2, cmd.Data3, cmd.Data4));

            scripts.EmitScriptEvent(
                "noolite:data:received", (byte)cmd.Command, cmd.Channel,
                cmd.DataFormat, cmd.Data1, cmd.Data2, cmd.Data3, cmd.Data4);
        }

        private void OnReceiveMicroclimateData(object obj, MicroclimateData data)
        {
            SafeInvokeAsync(microclimateHandlers, h => h(data.Channel, data.Temperature, data.Humidity, data.LowBattery));

            scripts.EmitScriptEvent("noolite:microclimate-data:received", data.Channel, data.Temperature, data.Humidity, data.LowBattery);
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
