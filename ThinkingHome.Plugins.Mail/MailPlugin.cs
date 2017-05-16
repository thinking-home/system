using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Scripts.Attributes;

namespace ThinkingHome.Plugins.Mail
{
    public class MailPlugin : PluginBase
    {
        #region options

        private string FromName => Configuration.GetValue<string>("fromName");
        private string FromMail => Configuration.GetValue<string>("fromMail");
        private string SmtpHost => Configuration.GetValue<string>("smtpHost");
        private int SmtpPort => Configuration.GetValue<int>("smtpPort");
        private bool UseSSL => Configuration.GetValue<bool>("useSSL");
		private bool DisableCertificateValidation => Configuration.GetValue<bool>("disableCertificateValidation");

		private string AuthLogin => Configuration.GetSection("auth").GetValue<string>("login");
		private string AuthPassword => Configuration.GetSection("auth").GetValue<string>("password");
        private bool UseAuth => !string.IsNullOrEmpty(AuthLogin) && !string.IsNullOrEmpty(AuthPassword);

        #endregion

        public override void InitPlugin()
        {
            base.InitPlugin();
        }

        [ScriptCommand("sendMail")]
		public void SendMail(string email, string subject, string message)
		{
			var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress(FromName, FromMail));
            emailMessage.To.Add(new MailboxAddress(string.Empty, email));
			emailMessage.Subject = subject;
			emailMessage.Body = new TextPart("plain") { Text = message };

			using (var client = new SmtpClient())
			{
                if (DisableCertificateValidation)
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;    
                }

                client.Connect(SmtpHost, SmtpPort, UseSSL);
				client.AuthenticationMechanisms.Remove("XOAUTH2"); // Must be removed for Gmail SMTP

                if (UseAuth)
                {
                    client.Authenticate(AuthLogin, AuthPassword);    
                }
				
				client.Send(emailMessage);
				client.Disconnect(true);
			}
		}
    }
}
