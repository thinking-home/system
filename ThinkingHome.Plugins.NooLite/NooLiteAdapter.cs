using System;
using Microsoft.Extensions.Logging;
using ThinkingHome.NooLite;

namespace ThinkingHome.Plugins.NooLite
{
    public class NooLiteAdapter
    {
        private readonly ILogger logger;

        private readonly MTRFXXAdapter device;

        private readonly bool fMode;

        public NooLiteAdapter(bool fMode, MTRFXXAdapter device, ILogger logger)
        {
            this.fMode = fMode;
            this.device = device;
            this.logger = logger;
        }

        #region scripts API

        // ReSharper disable once InconsistentNaming
        public void on(byte channel) => On(channel);

        // ReSharper disable once InconsistentNaming
        public void off(byte channel) => Off(channel);

        // ReSharper disable once InconsistentNaming
        public void setBrightness(byte channel, byte brightness) => SetBrightness(channel, brightness);

        // ReSharper disable once InconsistentNaming
        public void temporarySwitchOn(byte channel, byte minutes) => TemporarySwitchOn(channel, minutes);

        // ReSharper disable once InconsistentNaming
        public void changeLedColor(byte channel) => ChangeLedColor(channel);

        // ReSharper disable once InconsistentNaming
        public void setLedColor(byte channel, byte r, byte g, byte b) => SetLedColor(channel, r, g, b);

        // ReSharper disable once InconsistentNaming
        public void loadPreset(byte channel) => LoadPreset(channel);

        #endregion

        #region plugins API

        public void On(byte channel)
        {
            Exec(a => a.On(channel), a => a.OnF(channel));
        }

        public void Off(byte channel)
        {
            Exec(a => a.Off(channel), a => a.OffF(channel));
        }

        public void SetBrightness(byte channel, byte brightness)
        {
            Exec(a => a.SetBrightness(channel, brightness), a => a.SetBrightnessF(channel, brightness));
        }

        public void TemporarySwitchOn(byte channel, byte minutes)
        {
            var interval = (ushort)(minutes * 12);
            Exec(a => a.TemporarySwitchOn(channel, interval), a => a.TemporarySwitchOnF(channel, interval));
        }

        public void ChangeLedColor(byte channel)
        {
            Exec(a => a.ChangeLedColor(channel), a => a.ChangeLedColorF(channel));
        }

        public void SetLedColor(byte channel, byte r, byte g, byte b)
        {
            Exec(a => a.SetLedColor(channel, r, g, b), a => a.SetLedColorF(channel, r, g, b));
        }

        public void LoadPreset(byte channel)
        {
            Exec(a => a.LoadPreset(channel), a => a.LoadPresetF(channel));
        }

        #endregion

        private void Exec(Action<MTRFXXAdapter> action, Action<MTRFXXAdapter> actionF)
        {
            try
            {
                device.Open();

                if (fMode)
                {
                    actionF(device);
                }
                else
                {
                    action(device);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error on command sending");
            }
        }
    }
}
