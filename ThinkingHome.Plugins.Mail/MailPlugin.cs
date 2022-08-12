using System;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Scripts.Attributes;
using Buffer = ThinkingHome.Plugins.Scripts.Buffer;

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
	        Logger.LogInformation("Use mail account {FromMail} with {SmtpHost} SMTP host", FromMail, SmtpHost);
        }

        #region private

        private void SendMailInternal(MimeMessage message)
        {
	        try {
		        using var client = new SmtpClient();

		        if (DisableCertificateValidation) {
			        client.ServerCertificateValidationCallback = (s, c, h, e) => true;
		        }

		        client.Connect(SmtpHost, SmtpPort, UseSSL);
		        client.AuthenticationMechanisms.Remove("XOAUTH2"); // Must be removed for Gmail SMTP

		        if (UseAuth) {
			        client.Authenticate(AuthLogin, AuthPassword);
		        }

		        client.Send(message);
		        client.Disconnect(true);
	        }
	        catch (Exception e) {
		        Logger.LogError(e, "Error when trying to send mail");
	        }
        }

        private MimeMessage CreateMessage(string email, string subject)
        {

            var message = new MimeMessage();

            message.From.Add(new MailboxAddress(FromName, FromMail));
            message.To.Add(new MailboxAddress(string.Empty, email));
            message.Subject = subject;

            return message;
        }

        #endregion

        [ScriptCommand("sendMail")]
        public void SendMail(string email, string subject, string body)
        {
			var message = CreateMessage(email, subject);

			message.Body = new TextPart("plain") { Text = body };

			SendMailInternal(message);
        }

		[ScriptCommand("sendMailWithAttachment")]
		public void SendMail(string email, string subject, string body, string fileName, Buffer fileContent)
		{
            SendMail(email, subject, body, fileName, fileContent.GetBytes());
		}

		public void SendMail(string email, string subject, string body, string fileName, byte[] fileContent)
		{
			var message = CreateMessage(email, subject);

			var builder = new BodyBuilder { TextBody = body };
			builder.Attachments.Add(fileName, fileContent);

			message.Body = builder.ToMessageBody();

			SendMailInternal(message);
		}
	}
}
