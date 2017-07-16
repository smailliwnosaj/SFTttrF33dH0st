
// Namespace for FeedHost Feed Module
; fh.module.feed = {

    _elementId: "",

    search: function (searchString) {
        console.log("fh.module.feed.search('" + searchString + "')");
        $(".fh-search-box").val(searchString || $(".fh-search-box").val());
        $(".fh-search-button").trigger("click");
    },

    getFeedResults: function () {
        console.log("fh.module.feed.getFeedResults()");
        $("#" + fh.module.feed._elementId).html("");
        fh.module.feed.loadingSpinner(true);

        var success = function (data) {
            console.log(data);
            fh.module.feed.loadingSpinner(false);

            //console.log($template);
            if (data && data.Items && data.Items.length > 1) {
                //console.log(data.Items);
                for (var i = 0; i < data.Items.length; i++) {

                    var textArray = (data.Items[i].Text || "").split(' ');
                    var text = "";
                    for (var x = 0; x < textArray.length; x++) {
                        var s = textArray[x];
                        if (s.length > 0) {
                            if (s[0] == "@" || s[0] == "#") {
                                s = "<a href='javascript:void(0);' onclick='fh.module.feed.search($(this).text().substring(1, $(this).text().length))'>" + s + "</a>";
                            }
                            else if (s.length > 4 && s.substring(0, 4).toLowerCase() == "http" && s[s.length - 1] != "…") {
                                s = "<a href='" + s + "' target='_blank'>" + s + "</a>";
                            }
                            text += (s + " ");
                        }
                    }

                    var $template = "<div class='fh-feed-item'>" +

                        "<div class='col-sm-2 col-md-2 col-lg-2'>" +
                          "<div class='profileimage'>" +
                            "<img src='" + data.Items[i].ProfileImagePath + "'>" +
                          "</div>" +
                        "</div>" +

                        "<div class='col-sm-9 col-md-9 col-lg-9'>" +
                          "<div class='name'>" + data.Items[i].UserName + "</div>" +
                          "<div class='screenname'>" +
                            "<a href='javascript:void(0);' onclick='fh.module.feed.search($(this).text().substring(1, $(this).text().length))'>@" + data.Items[i].ScreenName + "</a>" +
                          "</div>" +
                          "<div class='date'>" +
                              fh.utility.getDateString(new Date(data.Items[i].Date || 0), "yyyy/MM/dd") + "  " +
                              fh.utility.getTimeString(new Date(data.Items[i].Date || 0), "hh:mm tt") +
                          "</div>" + // Localized time string

                          "<div class='clear'></div>" +
                          "<div class='text'>" + text + "</div>" +
                          "<div class='clear'></div>" +
                          "<div class='shares'><span class=''><i class='glyphicon glyphicon-comment'></i>&nbsp;" + data.Items[i].Shares + "</span></div>" +
                          "<div class='clear'></div>" +
                        "</div>" +

                        "<img class='logo' src='https://abs.twimg.com/a/1404172626/images/oauth_application.png'/>" +

                        "<div class='clear'></div>" +
                        "</div>";

                    $("#" + fh.module.feed._elementId).append($template);
                }
            }
            else {
                $("#" + fh.module.feed._elementId).append("No results found"); // TODO: Localize
                console.log("Info: No results found.")
            }
        };
        var error = function (err) {
            console.log(err);
            fh.module.feed.loadingSpinner(false);
        };
        var then = function () {
            
        };

        fh.utility.ajaxPost("/feed", success, error, then, $(".fh-search-box").val(), "searchString");
    },

    loadingSpinner: function (show) {
        if (show) {
            $("#" + fh.module.feed._elementId).prepend(
                "<div class='loader'><span>Loading ... <i class='glyphicon glyphicon-refresh spinner'></i></span></div>"  // TODO: Localize
            );
        }
        else {
            $("#" + fh.module.feed._elementId).html("");
        }
    },

    initialize(elementId, searchString) {
        console.log("fh.module.feed.initialize()");
        fh.module.feed._elementId = elementId;
        fh.module.feed.initializeEvents();
        fh.module.feed.search(searchString);

        // Check for new results every 60 seconds.
        // NOTE: This solution is poor UI design.
        // Interval timer should be replaced with a web socket approach.
        // Use Twitter's Stream API, instead.
        setInterval(function () {
            fh.module.feed.search($(".fh-search-box").val());
        }, 60000);
    },

    initializeEvents: function () {
        $(".fh-search-button").off("click").on("click", function () {
            console.log("event: .fh-search-button click");
            fh.module.feed.getFeedResults();
        });

        $(".fh-search-box").off("keypress").on("keypress", function (e) {
            if (e.keyCode === 13) {
                console.log("event: .fh-search-box onkeypress=[Enter]");
                $(".fh-search-button").trigger("click");
            }
        });
    }

}