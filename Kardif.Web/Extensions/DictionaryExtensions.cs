#region License

// Разработано: Коротенко Владимиром Николаевичем (Vladimir N. Korotenko)
// email: koroten@ya.ru
// skype:vladimir-korotenko
// https://vkorotenko.ru
// Создано:  19.10.2019 11:58

#endregion

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;

namespace Kardif.Web.Extensions
{
    public static class DictionaryExtensions
    {
        public static Dictionary<string, string> ToDictionary(this NameValueCollection nvc)
        {
            return ((IEnumerable<string>) nvc.AllKeys).ToDictionary<string, string, string>(
                (Func<string, string>) (k => k), (Func<string, string>) (k => nvc[k]));
        }
    }
}