
namespace FeedHost.Mockable
{
    public class Context
    {
        public string APIKey { get; set; } // AKA: Consumer Key
        public string APISecret { get; set; }
        public string APIAccountName { get; set; }
        public int APIMaxResultCount { get; set; }
    }
}
