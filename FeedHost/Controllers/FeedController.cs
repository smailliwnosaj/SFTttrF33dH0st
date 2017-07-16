
using System.Web.Mvc;
using FeedHost.Service;
using FeedHost.Mockable;

namespace FeedHost.Controllers
{
    public class FeedController : Controller
    {
        Context _context { get; set; }

        public FeedController() { }
        public FeedController(Context context)
        {
            this._context = context;
        }

        // POST api/feed  {"value":"[[search string]]"}
        [HttpPost]
        public JsonResult Index(string searchString)
        {
            var srvc = new TwitterService(this._context, searchString);
            return Json(srvc.ViewModel, JsonRequestBehavior.DenyGet);
        }

    }
}
