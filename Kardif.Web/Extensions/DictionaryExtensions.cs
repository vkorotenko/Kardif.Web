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
            return ((IEnumerable<string>)nvc.AllKeys).ToDictionary<string, string, string>((Func<string, string>)(k => k), (Func<string, string>)(k => nvc[k]));
        }
    }
}