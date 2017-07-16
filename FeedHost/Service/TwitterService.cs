
using FeedHost.Mockable;
using FeedHost.Interface;
using FeedHost.ViewModel;
using System.Web;
using Newtonsoft.Json.Linq;
using System.Net;
using System.IO;
using System.Collections.Generic;
using System;
using System.Globalization;

namespace FeedHost.Service
{
    public class TwitterService : IViewModelService<TwitterViewModel> 
    {
        public TwitterViewModel ViewModel { get; set; }
        private Context _context { get; set; }
        private string _bearerToken { get; set; }
        private readonly string _twitterDateFormat = "ddd MMM dd HH:mm:ss +ffff yyyy";
        private readonly DateTime _unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        #region Constructors

        protected TwitterService() { } // Hide parameterless constructor 

        public TwitterService(Context context, string searchString)
        {
            PreventNullRefExceptions();
            if (string.IsNullOrEmpty(this._bearerToken))
                SetBearerToken();
            if (!string.IsNullOrEmpty(this._bearerToken))
            {
                var searchResults = GetSearchResults(searchString);
                if (searchResults != null)
                {
                    SetItems(searchResults);
                }
            }
        }

        #endregion

        // Step 1
        private string GetOauthEncodedPair()
        {
            var token = string.Empty;
            if (!string.IsNullOrEmpty(this._context.APIKey) && !string.IsNullOrEmpty(this._context.APISecret))
            {
                // Twitter asks the Key and Secret be url encoded even though it currently does not change their values.
                var encodedAPIKey = HttpUtility.UrlEncode(this._context.APIKey);
                var encodedAPISecret = HttpUtility.UrlEncode(this._context.APISecret);
                
                // Base64 encode the string in this format: Key + ":" + Secret
                var bytes = System.Text.Encoding.UTF8.GetBytes(encodedAPIKey + ":" + encodedAPISecret);
                token = System.Convert.ToBase64String(bytes);
            }
            return token;
        }

        // Step 2
        private void SetBearerToken()
        {
            var bearerToken = string.Empty;
            const string apiRequestForBearerTokenPath = "https://api.twitter.com/oauth2/token";
            //const string apiSearchPath = "https://api.twitter.com/1.1/search/tweets.json";

            var requestForBearerToken = WebRequest.Create(apiRequestForBearerTokenPath);
            try
            {
                requestForBearerToken.Headers.Add("Authorization", "Basic " + GetOauthEncodedPair());
            }
            catch
            {
                // Could not append headers.  Request may have already been flushed;
                // TODO: Log error
            }
            try
            {
                requestForBearerToken.Method = "POST";
            }
            catch
            {
                // Could not change request method.  Request may have already been flushed;
                // TODO: Log error
            }
            try
            {
                requestForBearerToken.ContentType = "application/x-www-form-urlencoded;charset=UTF-8";
            }
            catch
            {
                // Could not set content type.  Request may have already been flushed;
                // TODO: Log exception
            }

            using (Stream requestForBearerTokenStream = requestForBearerToken.GetRequestStream())
            {
                string strRequestContent = "grant_type=client_credentials";
                byte[] bytearrayRequestContent = System.Text.Encoding.UTF8.GetBytes(strRequestContent);
                requestForBearerTokenStream.Write(bytearrayRequestContent, 0, bytearrayRequestContent.Length);
            }

            try
            {
                string responseJson = string.Empty;
                HttpWebResponse response = (HttpWebResponse)requestForBearerToken.GetResponse();
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    using (Stream responseStream = response.GetResponseStream())
                    {
                        responseJson = new StreamReader(responseStream).ReadToEnd();
                        JObject jobjectResponse = JObject.Parse(responseJson ?? string.Empty);
                        bearerToken = (jobjectResponse["access_token"] ?? string.Empty).ToString();
                        this._bearerToken = bearerToken;
                    }
                }
            }
            catch
            {
                // TODO: Log exception
            }
        }

        // Step 3
        private JObject GetSearchResults(string searchString)
        {
            JObject result = null;
            const string apiSearchPath = "https://api.twitter.com/1.1/search/tweets.json";

            var requestForSearchResults = WebRequest.Create(
                apiSearchPath + 
                "?q=" + HttpUtility.UrlEncode(
                    "@" + (this._context.APIAccountName) +
                    (string.IsNullOrEmpty(searchString) ? string.Empty : HttpUtility.UrlEncode(" " + searchString))
                )
            );
            try
            {
                requestForSearchResults.Headers.Add("Authorization", "Bearer " + (this._bearerToken ?? string.Empty));
            }
            catch
            {
                // Could not append headers.  Request may have already been flushed;
                // TODO: Log error
                return null;
            }
            try
            {
                requestForSearchResults.Method = "GET";
            }
            catch
            {
                // Could not change request method.  Request may have already been flushed;
                // TODO: Log error
                return null;
            }
            try
            {
                requestForSearchResults.ContentType = "application/x-www-form-urlencoded;charset=UTF-8";
            }
            catch
            {
                // Could not set content type.  Request may have already been flushed;
                // TODO: Log exception
                return null;
            }

            try
            {
                string responseJson = string.Empty;
                HttpWebResponse response = (HttpWebResponse)requestForSearchResults.GetResponse();
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    using (Stream responseStream = response.GetResponseStream())
                    {
                        responseJson = new StreamReader(responseStream).ReadToEnd();
                        result = JObject.Parse(responseJson ?? string.Empty);
                    }
                }
            }
            catch
            {
                // TODO: Log exception
                return null;
            }
            return result;
        }

        // Step 4
        private void SetItems(JObject searchResults)
        {
            if (searchResults == null) return;
            var counter = 0;
            foreach (var status in searchResults["statuses"])
            {
                counter++;
                if (counter > 10) break;
                SetItem(status);
            }
        }

        // Step 4
        private void SetItem(JToken searchResultItem)
        {
            Model.TwitterFeedItem item = null;
            try
            {
                var user = searchResultItem["user"];

                var retweets = 0;
                int.TryParse((searchResultItem["retweet_count"] ?? 0).ToString(), out retweets);

                CultureInfo culture = new CultureInfo("en-US");
                var createDateString = (searchResultItem["created_at"] ?? string.Empty).ToString();  // Sat Jul 15 18:16:41 +0000 2017
                var createDate = DateTime.ParseExact(createDateString, this._twitterDateFormat, culture);
                var createDateMillis = (long)(createDate - this._unixEpoch).TotalMilliseconds;

                item = new Model.TwitterFeedItem()
                {
                    Date = createDateMillis,
                    ProfileImagePath = user == null ? string.Empty : (user["profile_image_url_https"] ?? string.Empty).ToString(),
                    ScreenName = user == null ? string.Empty : (user["screen_name"] ?? string.Empty).ToString(),
                    Shares = retweets,
                    Text = (searchResultItem["text"] ?? string.Empty).ToString(),
                    UserName = user == null ? string.Empty : (user["name"] ?? string.Empty).ToString(),
                };
            }
            catch
            {
                // Trouble parsing Tweet
                // TODO: Log exception
            }
            if (item != null) this.ViewModel.Items.Add(item);
        }

        private void PreventNullRefExceptions()
        {
            if (this.ViewModel == null) { this.ViewModel = new TwitterViewModel(); }
            if (this.ViewModel.Items == null) this.ViewModel.Items = new List<Interface.IFeedItem>();

            if (this._context == null) { this._context = new Mockable.Context(); }
            if (this._context.APIKey == null) { this._context.APIKey = "pPWtFFyv8u6CPdpMwTL71ArXT"; }
            if (this._context.APISecret == null) { this._context.APISecret = "btf196qrBGnoyFMe5OXuWrk4fI7K4KIZSmKKNEzJfyOR6RSSXo"; }
            if (this._context.APIAccountName == null) { this._context.APIAccountName = "salesforce"; }
            if (this._context.APIMaxResultCount < 1) { this._context.APIMaxResultCount = 10; }
        }
    }
}
