using System;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.NooLite;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.NooLite
{
    public class NooLitePlugin: PluginBase
    {
        private MTRFXXAdapter device;
        private AdapterWrapper wrapper;
        private AdapterWrapper wrapperF;

        public override void InitPlugin()
        {
            var portName = Configuration["portName"];

            if (string.IsNullOrEmpty(portName)) throw new Exception("noolite portName is required");

            Logger.LogInformation($"Use '{portName}' serial port");

            device = new MTRFXXAdapter(portName);
            device.Connect += OnConnect;
            device.Disconnect += OnDisconnect;
            device.ReceiveData += OnReceiveData;
            device.Error += OnError;

            wrapper = new AdapterWrapper(false, device, Logger);
            wrapperF = new AdapterWrapper(true, device, Logger);
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

        private void OnReceiveData(object obj, ReceivedData receivedData)
        {
            Logger.LogInformation(receivedData.ToString());
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