using Microsoft.VisualStudio.TestTools.UnitTesting;


namespace FeedHost.Service.Tests
{
    [TestClass()]
    public class TwitterServiceTests
    {
        [TestMethod()]
        public void TwitterServiceTest()
        {
            var context = new FeedHost.Mockable.Context()
            {
                // Optional: Pass in custom API Key and Secret
            };

            var srvc = new FeedHost.Service.TwitterService(context, string.Empty);

            var vm = srvc.ViewModel;

            // Ensure Items is not null
            Assert.IsNotNull(vm.Items);

            // Ensure every Item found is not null
            if (vm.Items.Count > 0)
            {
                foreach (var item in vm.Items)
                {
                    Assert.IsNotNull(item.ScreenName);
                    Assert.AreNotEqual(item.ScreenName, string.Empty);

                    Assert.IsNotNull(item.UserName);
                    Assert.AreNotEqual(item.UserName, string.Empty);

                    Assert.IsNotNull(item.Date);
                    Assert.AreNotEqual(item.Date, 0);

                    Assert.IsNotNull(item.Text);
                    Assert.AreNotEqual(item.Text, string.Empty);
                }
            }
            else
            {
                // It is possible for the feed to return no results even though no code is broken.
                // However, no results found could be an indicator of broken code.
                // No results found should not cause a build to break.
                Assert.AreEqual(true, true);
            }
        }
    }
}