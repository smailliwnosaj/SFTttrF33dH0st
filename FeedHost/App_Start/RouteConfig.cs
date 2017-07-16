
using System.Web.Mvc;
using System.Web.Routing;

namespace FeedHost
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "FeedRoute",
                url: "Feed/{id}",
                defaults: new { controller = "Feed", action = "Index", id = UrlParameter.Optional }
            );

            // This Route should be the last Route declared as it is less specific that all previous Routes.
            routes.MapRoute(
                name: "DefaultRoute",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
            
        }
    }
}
