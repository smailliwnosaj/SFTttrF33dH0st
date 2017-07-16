

namespace FeedHost.Interface
{
    public interface IFeedItem
    {
        string UserName { get; set; }
        string ScreenName { get; set; }
        string ProfileImagePath { get; set; }
        string Text { get; set; }
        int Shares { get; set; }
        long Date { get; set; }
    }
}
