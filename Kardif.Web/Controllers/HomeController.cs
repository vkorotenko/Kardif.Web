#region License

// Разработано: Коротенко Владимиром Николаевичем (Vladimir N. Korotenko)
// email: koroten@ya.ru
// skype:vladimir-korotenko
// https://vkorotenko.ru
// Создано:  19.10.2019 11:58

#endregion

using System.Web.Mvc;

namespace Kardif.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}