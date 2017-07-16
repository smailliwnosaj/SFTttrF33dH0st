using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Mvc;

namespace FeedHost.Controllers.Tests
{
    [TestClass()]
    public class FeedControllerTests
    {
        [TestMethod()]
        public void FeedControllerIndexTest()
        {
            var context = new FeedHost.Mockable.Context() {
                // Optional: Pass in custom API Key and Secret
            };

            // Arrange
            var controller = new FeedController(context);

            // Act
            JsonResult result1 = controller.Index("") as JsonResult;

            // Assert
            Assert.IsNotNull(result1);

            // Act
            JsonResult result2 = controller.Index("salesforce") as JsonResult;

            // Assert
            Assert.IsNotNull(result2);
        }
    }
}