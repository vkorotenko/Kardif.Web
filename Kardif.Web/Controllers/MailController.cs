#region License

// Разработано: Коротенко Владимиром Николаевичем (Vladimir N. Korotenko)
// email: koroten@ya.ru
// skype:vladimir-korotenko
// https://vkorotenko.ru
// Создано:  19.10.2019 7:51

#endregion

using Kardif.Web.Extensions;
using Kardif.Web.Helpers;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Web.Mvc;

namespace Kardif.Web.Controllers
{
    public class MailController : Controller
    {
        private static readonly string Message;

        static MailController()
        {
            using (var streamReader =
                new StreamReader(HostingEnvironment.MapPath(ConfigurationManager.AppSettings["TemplatePath"])))
                MailController.Message = streamReader.ReadToEnd();
        }

        [HttpPost]
        public JsonResult Send()
        {
            var dictionary = this.HttpContext.Request.Params.ToDictionary();
            var message = MailController.Message;
            foreach (KeyValuePair<string, string> keyValuePair in dictionary)
            {
                if (!string.IsNullOrEmpty(keyValuePair.Value))
                {
                    message = message.Replace("<!--" + keyValuePair.Key, string.Empty);
                    message = message.Replace("{{" + keyValuePair.Key + "}}", keyValuePair.Value);
                    message = message.Replace(keyValuePair.Key + "-->", string.Empty);
                }
            }

            return this.Json((object) MailHelper.SendMail(message, (string) null));
        }
    }
}