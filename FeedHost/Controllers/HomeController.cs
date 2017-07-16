
using FeedHost.Mockable;
using System.Web.Mvc;

namespace FeedHost.Controllers
{
    public class HomeController : Controller
    {
        Context _context { get; set; }

        public HomeController() { }
        public HomeController(Context context)
        {
            this._context = context;
        }

        public ActionResult Index()
        {
            ViewBag.Title = "Salesforce Twitter Challenge - Jason Williams";

            return View();
        }
    }
}
