using System;
using System.IO;

namespace FeedHost.Helper
{
    public static class Logger
    {
        // TODO: Build a robust logging solution

        private const string _logFilePath = "~/log.txt";

        public static void LogError(Exception ex)
        {
            try
            {
                File.AppendAllText(System.Web.HttpContext.Current.Server.MapPath(_logFilePath), DateTime.UtcNow.ToString() + "  " + ex.Message + Environment.NewLine + Environment.NewLine);
            }
            catch
            {

            }

            // TODO: Setup Log Source

            //if (!EventLog.SourceExists(_appDomain))
            //{
            //    EventLog.CreateEventSource(new EventSourceCreationData(_appDomain, _appName));
            //}
            //if (EventLog.SourceExists(_appDomain))
            //{
            //    EventLog log = new EventLog(_appName);
            //    log.Source = _appDomain;
            //    log.WriteEntry(ex.Message, EventLogEntryType.Error);
            //}
        }

        public static void LogError(string message)
        {
            try
            {
                File.AppendAllText(System.Web.HttpContext.Current.Server.MapPath(_logFilePath), DateTime.UtcNow.ToString() + "  " + message + Environment.NewLine + Environment.NewLine);
            }
            catch
            {

            }
        }

        public static void LogInfo(string message)
        {
            try
            {
                File.AppendAllText(System.Web.HttpContext.Current.Server.MapPath(_logFilePath), DateTime.UtcNow.ToString() + "  " + message + Environment.NewLine + Environment.NewLine);
            }
            catch
            {

            }
        }
    }
}