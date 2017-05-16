using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Scripts.Attributes;

namespace ThinkingHome.Plugins.Mail
{
    public class MailPlugin : PluginBase
    {
        private string FromName => Configuration.GetValue<string>("fromName");
        private string FromMail => Configuration.GetValue<string>("fromMail");
        private string SmtpHost => Configuration.GetValue<string>("smtpHost");
        private int SmtpPort => Configuration.GetValue<int>("smtpPort");

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
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                client.Connect(SmtpHost, SmtpPort, true);
				client.AuthenticationMechanisms.Remove("XOAUTH2"); // Must be removed for Gmail SMTP

                var auth = Configuration.GetSection("auth");
                if (auth != null)
                {
                    client.Authenticate(auth.GetValue<string>("login"), auth.GetValue<string>("password"));    
                }
				
				client.Send(emailMessage);
				client.Disconnect(true);
			}
		}
    }
}
