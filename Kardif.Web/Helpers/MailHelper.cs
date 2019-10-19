#region License

// Разработано: Коротенко Владимиром Николаевичем (Vladimir N. Korotenko)
// email: koroten@ya.ru
// skype:vladimir-korotenko
// https://vkorotenko.ru
// Создано:  19.10.2019 8:35

#endregion

using Kardif.Web.Models;
using System;
using System.Configuration;
using System.Net;
using System.Net.Mail;

namespace Kardif.Web.Helpers
{
    public static class MailHelper
    {
        public static string SmtpServer = ConfigurationManager.AppSettings["SmtpServer"];
        public static int Port = Convert.ToInt32(ConfigurationManager.AppSettings["Port"]);
        public static bool EnableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);
        public static string MailFrom = ConfigurationManager.AppSettings["MailFrom"];
        public static string Password = ConfigurationManager.AppSettings["Password"];
        public static string MailTo = ConfigurationManager.AppSettings["MailTo"];
        public static string Caption = ConfigurationManager.AppSettings["Caption"];
        public static bool IsBodyHtml = Convert.ToBoolean(ConfigurationManager.AppSettings["IsBodyHtml"]);

        public static MailModel SendMail(string message, string attachFile = null)
        {
            try
            {
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(MailHelper.MailFrom),
                    Subject = MailHelper.Caption,
                    Body = message,
                    IsBodyHtml = MailHelper.IsBodyHtml
                };

                mailMessage.To.Add(new MailAddress(MailHelper.MailTo));
                
                if (!string.IsNullOrEmpty(attachFile))
                    mailMessage.Attachments.Add(new Attachment(attachFile));


                using (var client = new SmtpClient())
                {
                    client.Host = MailHelper.SmtpServer;
                    client.Port = MailHelper.Port;
                    client.EnableSsl = MailHelper.EnableSsl;
                    client.Credentials = new NetworkCredential(MailHelper.MailFrom, MailHelper.Password);
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                    client.Send(mailMessage);
                }
                return new MailModel()
                {
                    Status = true,
                    Error = string.Empty
                };
            }
            catch (Exception ex)
            {
                return new MailModel()
                {
                    Status = false,
                    Error = "Mail.Send: " + ex.Message
                };
            }
        }
    }
}