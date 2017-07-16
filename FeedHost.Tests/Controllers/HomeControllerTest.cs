using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using FeedHost.Controllers;

namespace FeedHost.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTest
    {
        [TestMethod]
        public void HomeControllerIndexTest()
        {
            var context = new FeedHost.Mockable.Context()
            {
                // Optional: Pass in custom context parameters
            };

            // Arrange
            HomeController controller = new HomeController(context);

            // Act
            ViewResult result = controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Salesforce Twitter Challenge - Jason Williams", result.ViewBag.Title);
        }
    }
}
