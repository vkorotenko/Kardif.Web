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


            dictionary = CleanUpDict(dictionary);

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

        private Dictionary<string, string> CleanUpDict(Dictionary<string, string> dictionary)
        {
            var outdict = new Dictionary<string,string>();
            foreach (var kv in dictionary)
            {
                switch (kv.Key)
                {
                    case "action":
                        outdict.Add(kv.Key, CleanComma(kv.Value));
                        break;
                    case "token":
                        outdict.Add(kv.Key, CleanComma(kv.Value));
                        break;
                    case "selectedYear":
                        outdict.Add(kv.Key, CleanComma(kv.Value));
                        break;
                    case "selectedPrice":
                        outdict.Add(kv.Key, CleanComma(kv.Value));
                        break;
                    case "mileage":
                        outdict.Add(kv.Key, CleanComma(kv.Value));
                        break;
                default:
                        outdict.Add(kv.Key,kv.Value);
                        break;
                }
            }

            return outdict;
        }

        private string CleanComma(string kvValue)
        {
            return kvValue.Split(',').First();
        }
    }
}