using System;
using FeedHost.Interface;

namespace FeedHost.Model
{
    public class TwitterFeedItem : IFeedItem
    {
        public long Date { get; set; }

        public string ProfileImagePath { get; set; }

        public string ScreenName { get; set; }

        public int Shares { get; set; }

        public string Text { get; set; }

        public string UserName { get; set; }
    }
}
