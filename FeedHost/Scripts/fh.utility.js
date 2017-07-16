
// Namespace for FeedHost
; fh = {};

// Namespace for FeedHost Modules
; fh.module = {}

// Namespace for FeedHost Utility module
;fh.utility = {

    ajaxGet: function (path, successfunction, errorfunction, thenfunction) {
        return this._ajax("json",
            "GET",
            path,
            successfunction,
            errorfunction,
            thenfunction,
            null,
            null,
            true);
    },

    ajaxPost: function (path, successfunction, errorfunction, thenfunction, jsonpayload, jsonpayloadname) {
        return this._ajax("json",
            "POST",
            path,
            successfunction,
            errorfunction,
            thenfunction,
            jsonpayload,
            jsonpayloadname,
            true);
    },

    _ajax: function (datatype,
        verb,
        path,
        successfunction,
        errorfunction,
        thenfunction,
        jsonpayload,
        jsonpayloadname,
        updateSessionTimer) {
        var haspayload = true;
        if (jsonpayload == null) {
            haspayload = false;
            jsonpayload = {}; // Set empty payload
            console.log(verb + " to " + path);
        } else {
            console.log(verb + " with payload to " + path);
            console.log(jsonpayload);
        };
        var postdata;
        if (jsonpayloadname != null) {
            postdata = eval("JSON.stringify({" + jsonpayloadname + ": jsonpayload })");
        } else {
            postdata = jsonpayload;
        }
        var rqst = $.ajax({
            url: path,
            method: verb,
            data: postdata,
            contentType: "application/json",
            // The W3C XMLHttpRequest specification dictates that the charset is always UTF-8; specifying another charset will not force the browser to change the encoding.
            dataType: datatype,
            async: true,
            processData: haspayload,
            statusCode: {
                401: function () {
                    console.log("exec: fh.utility status code 401 redirect to sign out page.");
                    window.location = fh.appPath + "account/logout";
                },
                404: function () {
                    fh.utility._fileNotFoundErrorOccurred = true;
                    console.log("exec: fh.utility status code 404 occurred.");
                }
            },
            cache: false
        })
            .done(function (data) {
                if (rqst.ignoreResponse == null || rqst.ignoreResponse === false) {
                    successfunction(data);
                }
                else {
                    console.log("ajax response ingnored: " + path);
                }
            })
            .fail(function (request, status, error) {
                var errorMessage = fh.resources.common.message.applicationError;
                try {
                    console.error("exec: fh.utility fail status: " + request.status);
                    // In some cases, "error" is retruned as an HTML error page instead of a json error response.
                    // If an error is thrown parsing responseText, responseText may be an html response as opposed to a json error response and, more than likely, there an error has already been logged on the server.
                    if (request.responseText !== "") {
                        var errorObject = JSON.parse(request.responseText);

                        if (errorObject != undefined) {
                            errorMessage = errorObject.errorMessage || "";
                            console.warn((error || "error") + ": " + errorMessage);
                            console.warn({
                                "datatype": datatype,
                                "verb": verb,
                                "path": path,
                                "request": errorObject,
                                "status": status,
                                "error": error
                            });
                        }
                    }
                } catch (e) {
                    console.warn(e);
                    // SWALLOW ERROR: An error could be thrown when posting the orignial error to the server logs.  Re throwing could cause an endless loop.
                }
                fh.utility.ajaxErrorDisplay(errorMessage, errorfunction);
            })
            //.always(function () {})
            .then(thenfunction || function () { });

        fh.utility._ajaxRequestArray.push(rqst);
        return rqst;
    },

    _ajaxRequestArray: [],

    //ajaxIgnoreAllPendingResponses: function () {
    //    console.log("fh.utility ajaxIgnoreAllPendingResponses()")
    //    for (var i = 0; i < fh.utility._ajaxRequestArray.length; i++) {
    //        fh.utility._ajaxRequestArray[i].ignoreResponse = true; // injecting "ignoreResponse" property
    //    }
    //},

    //convertObjectToPropertyArray: function (object, emptyItem) {
    //    var array = [];
    //    for (var prop in object) {
    //        if (object.hasOwnProperty(prop)) {
    //            array.push({ "name": object[prop], "value": prop });
    //        }
    //    }
    //    // Alphabetize dropdown list items
    //    array.sort(function (a, b) {
    //        return (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    //    });
    //    if (emptyItem && emptyItem.length > 0) {
    //        // Insert dropdown option for no parent
    //        array.splice(0, 0, { "name": emptyItem, "value": "" });
    //    }
    //    return array;
    //},

    //convertTimeZoneObjectToPropertyArray: function (object, emptyItem) {
    //    var array = [];
    //    for (var prop in object) {
    //        if (object.hasOwnProperty(prop)) {
    //            array.push({ "name": object[prop], "value": prop });
    //        }
    //    }
    //    //
    //    // 20160616 - Do not alphabetize timezone dropdown list items...
    //    //
    //    //array.sort(function (a, b) {
    //    //    return (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    //    //});
    //    //
    //    if (emptyItem && emptyItem.length > 0) {
    //        // Insert dropdown option for no parent
    //        array.splice(0, 0, { "name": emptyItem, "value": "" });
    //    }
    //    return array;
    //},

    //convert12HourTimeTo24HourTime: function (strtimex) {
    //    // NOTE: check isValidTimeString() before calling this method
    //    var rxAm = new RegExp("^[01][0-9][:][0-5][0-9]\\s[Aa][Mm]$");
    //    if (rxAm.test(strtimex)) {
    //        var x1; // = parseInt(x.split(":")[0] == "12" ? "00" : x.split(":")[0]) + ":" + x.split(":")[1].split(" ")[0];
    //        var x1Hours = parseInt(strtimex.split(":")[0] == "12" ? "00" : strtimex.split(":")[0]);
    //        if (x1Hours < 10) {
    //            x1 = "0" + x1Hours.toString() + ":" + strtimex.split(":")[1].split(" ")[0];
    //        } else {
    //            x1 = x1Hours.toString() + ":" + strtimex.split(":")[1].split(" ")[0];
    //        }
    //        return x1;
    //    }
    //    var rxPm = new RegExp("^[01][0-9][:][0-5][0-9]\\s[Pp][Mm]$");
    //    if (rxPm.test(strtimex)) {
    //        var x1Hours = parseInt(strtimex.split(":")[0] == "12" ? "00" : strtimex.split(":")[0]) + 12;
    //        x1 = x1Hours.toString() + ":" + strtimex.split(":")[1].split(" ")[0];
    //        return x1;
    //    }
    //},

    //timeXBeforeTimeY: function (strtimex, strtimey, format) {
    //    if (this.isValidTimeString(strtimex, format) === false || this.isValidTimeString(strtimey, format) === false) {
    //        return false;
    //    };
    //    if (format === "hh:mm tt") {
    //        var x1 = this.convert12HourTimeTo24HourTime(strtimex);
    //        var y1 = this.convert12HourTimeTo24HourTime(strtimey);
    //        return this.timeXBeforeTimeY(x1, y1, "HH:mm");
    //    } else if (format === "HH:mm") {
    //        var x1 = new Date(2010, 1, 1, strtimex.split(":")[0], strtimex.split(":")[1], 0);
    //        var y1 = new Date(2010, 1, 1, strtimey.split(":")[0], strtimey.split(":")[1], 0);
    //        return x1 <= y1;
    //    }
    //},

    //dateXBeforeDateY: function (strdatex, strdatey, format) {
    //    if (format == "yyyy-MM-dd") {
    //        if (this.isValidDateString(strdatex, format) == false || this.isValidDateString(strdatey, format) == false) {
    //            return false;
    //        }
    //        var x1 = this.getDateFromString(strdatex, format);
    //        var y1 = this.getDateFromString(strdatey, format);
    //        return x1 <= y1;
    //    }
    //    console.log("error: incorrect date format");
    //    return false;
    //},

    isValidTimeString: function (strtime, format) {
        if (strtime == null || strtime === "") return false;
        if (format === "hh:mm tt") {
            var rxam = new RegExp("^[01][0-9][:][0-5][0-9]\\s[aA][mM]$");
            if (rxam.test(strtime) === true) {
                var hours = parseInt(strtime.split(":")[0]) === 12 ? 0 : parseInt(strtime.split(":")[0]);
                var minutes = parseInt(strtime.split(":")[1]);
                var x1 = new Date(2010, 1, 1, strtime.split(":")[0], minutes, 0);
                if (hours > 11 || hours < 0 || minutes > 59 || minutes < 0 || x1 == new Date()) {
                    console.log("error: badly formatted Time(" + format + "): " + strtime);
                    return false;
                }
            }
            var rxpm = new RegExp("^[01][0-9][:][0-5][0-9]\\s[pP][mM]$");
            if (rxpm.test(strtime) === true) {
                var hours = parseInt(strtime.split(":")[0]) === 12 ? 12 : (parseInt(strtime.split(":")[0]) + 12);
                var minutes = parseInt(strtime.split(":")[1]);
                var x1 = new Date(2010, 1, 1, hours, minutes, 0);
                if (hours > 23 || hours < 12 || minutes > 59 || minutes < 0 || x1 == new Date()) {
                    console.log("error: badly formatted Time(" + format + "): " + strtime);
                    return false;
                }
            }
            var x1 = this.convert12HourTimeTo24HourTime(strtime);
            return this.isValidTimeString(x1, "HH:mm");
        } else if (format === "HH:mm") {
            var rx = new RegExp("^[012][0-9][:][0-5][0-9]$");
            if (rx.test(strtime) === false) {
                console.log("error: badly formatted Time(" + format + "): " + strtime);
                return false;
            }
            var x1 = new Date(2010, 1, 1, strtime.split(":")[0], strtime.split(":")[1], 0);
            if (x1 == new Date()) {
                console.log("error: badly formatted Tme(" + format + "): " + strtime);
                return false;
            }
            return true;
        } else {
            console.log("error: incorrect Time format" + format);
            return false;
        }
    },

    isValidDateString: function (strdate, format) {
        if (strdate == null || strdate === "") return false;
        if (format == null || format == "yyyy-MM-dd") {
            var rx = new RegExp("^[0-9]{4}[-][01][0-9][-][0-3][0-9]$");
            if (rx.test(strdate) === false) {
                console.log("error: badly formatted Date(" + format + "): " + strdate);
                return false;
            }
            var year = parseInt(strdate.split("-")[0]);
            var month = parseInt(strdate.split("-")[1]);
            var day = parseInt(strdate.split("-")[2]);
            if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1) {
                console.log("error: badly formatted Date(" + format + "): " + strdate);
                return false;
            }
            if ((month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) && day > 31) {
                console.log("error: badly formatted Date(" + format + "): " + strdate);
                return false;
            }
            if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
                console.log("error: badly formatted Date(" + format + "): " + strdate);
                return false;
            }
            if ((month === 2) && day > 29) { //NOTE: No handling for non-leap years
                console.log("error: badly formatted Date(" + format + "): " + strdate);
                return false;
            }
            var x1 = new Date(strdate);
            if (x1 == new Date()) {
                console.log("error: badly formatted Date(" + format + "): " + strdate);
                return false;
            }
            return true;
        }
        console.log("error: incorrect Date format: " + format);
        return false;
    },

    getDateFromString: function (strdate, format) {
        // NOTE: check isValidDateString() before calling this method
        //if (this.isValidDateFormat(date, format) === true) {
        return new Date(strdate);
        //}
        //return new Date();
    },

    //durationXBeforeDurationY: function (strdurx, strdury, format) {
    //    if (format == null || format === "00:00:00") {
    //        var x = this.getDurationSeconds(strdurx, format);
    //        var y = this.getDurationSeconds(strdury, format);
    //        if (x >= 0 && y >= 0) {
    //            return x <= y;
    //        }
    //    }
    //    console.log("error: incorrect duration format");
    //    return false;
    //},

    //getDurationSeconds: function (strduration, format) {
    //    //NOTE:  returns -1 if invalid
    //    if (format == null || format === "00:00:00") {
    //        var rx = new RegExp("^[0-9]{2}:[0-5][0-9]:[0-5][0-9]$");
    //        if (rx.test(strduration)) {
    //            var x = strduration.split(":");
    //            if (x.length === 3) {
    //                //console.log(x + " : " + (x[0] * 60 * 60 + x[1] * 60 + x[2]));
    //                return parseInt(x[0] * 60 * 60 + x[1] * 60 + x[2]);
    //            }
    //        }
    //    }
    //    console.log("error: incorrect duration format");
    //    return -1;
    //},

    //getDurationString: function (seconds) {
    //    if (seconds == null) return "";
    //    if (seconds <= 0) return "00:00:00";
    //    //console.log("seconds: " + seconds);
    //    var hrs = Math.floor(seconds / 60 / 60);
    //    var mts = Math.floor((seconds - (hrs * 60 * 60)) / 60);
    //    var sds = Math.floor((seconds - (hrs * 60 * 60) - (mts * 60)));
    //    hrs = Math.min(hrs, 99);

    //    var h = (hrs + 100).toString().slice(-2);
    //    var m = (mts + 100).toString().slice(-2);
    //    var s = (sds + 100).toString().slice(-2);
    //    //console.log(h + ":" + m + ":" + s);
    //    return h + ":" + m + ":" + s;
    //},

    getDateString: function (date, format) {
        if (date == null) return false;

        if (format === "yyyy-MM-dd") {
            return date.getFullYear() + "-" + (101 + date.getMonth()).toString().slice(-2) + "-" + (100 + date.getDate()).toString().slice(-2);
        }
        return date.getFullYear() + "/" + (101 + date.getMonth()).toString().slice(-2) + "/" + (100 + date.getDate()).toString().slice(-2);
    },

    getTimeString: function (date, format) {
        //console.log("getTimeString(" + date + ", " + format + ")");
        if (date == null) return false;

        if (format === "hh:mm tt") {
            //console.log(date.getHours());
            if (date.getHours() === 0) {
                var ts = "12:" + (100 + date.getMinutes()).toString().slice(-2) + " AM";
                //console.log(ts);
                return ts;
            }
            else if (date.getHours() <= 12) {
                var ts = (100 + date.getHours()).toString().slice(-2) + ":" + (100 + date.getMinutes()).toString().slice(-2) + " AM";
                //console.log(ts);
                return ts;
            }
            else if (date.getHours() < 24) {
                var ts = (88 + date.getHours()).toString().slice(-2) + ":" + (100 + date.getMinutes()).toString().slice(-2) + " PM";
                //console.log(ts);
                return ts;
            } else {
                return false;
            }

        } else if (format === "hh:mm:ss tt") {
            //console.log(date.getHours());
            if (date.getHours() === 0) {
                var ts = "12:" + (100 + date.getMinutes()).toString().slice(-2) + ":" + (100 + date.getSeconds()).toString().slice(-2) + " AM";
                //console.log(ts);
                return ts;
            }
            else if (date.getHours() <= 12) {
                var ts = (100 + date.getHours()).toString().slice(-2) + ":" + (100 + date.getMinutes()).toString().slice(-2) + ":" + (100 + date.getSeconds()).toString().slice(-2) + " AM";
                //console.log(ts);
                return ts;
            }
            else if (date.getHours() < 24) {
                var ts = (88 + date.getHours()).toString().slice(-2) + ":" + (100 + date.getMinutes()).toString().slice(-2) + ":" + (100 + date.getSeconds()).toString().slice(-2) + " PM";
                //console.log(ts);
                return ts;
            } else {
                return false;
            }

        } else if (format === "HH:mm") {
            var ts = (100 + date.getHours()).toString().slice(-2) + ":" + (100 + date.getMinutes()).toString().slice(-2);
            //console.log(ts);
            return ts;

        } else if (format === "HH:mm:ss") {
            var ts = (100 + date.getHours()).toString().slice(-2) + ":" + (100 + date.getMinutes()).toString().slice(-2) + ":" + (100 + date.getSeconds()).toString().slice(-2);
            //console.log(ts);
            return ts;

        }
        return false;
    }

    //getDayString: function (date, format) {
    //    if (Date == null) return "";
    //    var d = new Date(date);
    //    var weekday = new Array(7);
    //    weekday[0] = format === "ddd" ? fh.resources.common.label.sun : fh.resources.common.label.sunday;
    //    weekday[1] = format === "ddd" ? fh.resources.common.label.mon : fh.resources.common.label.monday;
    //    weekday[2] = format === "ddd" ? fh.resources.common.label.tue : fh.resources.common.label.tuesday;
    //    weekday[3] = format === "ddd" ? fh.resources.common.label.wed : fh.resources.common.label.wednesday;
    //    weekday[4] = format === "ddd" ? fh.resources.common.label.thur : fh.resources.common.label.thursday;
    //    weekday[5] = format === "ddd" ? fh.resources.common.label.fri : fh.resources.common.label.friday;
    //    weekday[6] = format === "ddd" ? fh.resources.common.label.sat : fh.resources.common.label.saturday;
    //    return weekday[d.getDay()];
    //},

    //currentDate: function () {
    //    var today = new Date();
    //    var todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    //    return todayDateOnly;
    //},

    //currentDateTime: function () {
    //    return new Date();
    //},

    //currentDateString: function (format) {
    //    var today = new Date();
    //    var dd = today.getDate();
    //    var MM = today.getMonth() + 1; //January is 0!
    //    var yyyy = today.getFullYear();
    //    if (dd < 10) {
    //        dd = "0" + dd.toString();
    //    }
    //    if (MM < 10) {
    //        MM = "0" + MM.toString();
    //    }
    //    if (format === "yyyy/MM/dd") {
    //        today = yyyy + "/" + MM + "/" + dd;
    //    } else {
    //        today = yyyy + "/" + MM + "/" + dd;
    //    }
    //    return today;
    //},

    //htmlDecode: function (value) {
    //    return $("<textarea/>").html(value).text();
    //},

    //htmlEncode: function (value) {
    //    return $("<textarea/>").text(value).html();
    //},

    //Navigate: function (path) {
    //    if (path && path.length > 0) {
    //        window.location.href = path;
    //    }
    //}

}



