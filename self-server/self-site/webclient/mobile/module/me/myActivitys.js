(function (window, $, SELF) {

    var initUI = function () {
        $("#myActivitys header span").bind("click", function () {
            destroyUI();
        });
        $("#activity-list ul").bind("click", function (event) {
            var target = $(event.target),
                    activityId = target.attr("data-activity-id");
            while (!target.is("article") && activityId === undefined) {
                target = target.parent();
                activityId = target.attr("data-activity-id");
            }
            if (activityId) {
                SELF.publish("show-activity-detail", activityId);
            }
        });
        loadmyActivitys();
    }, /*我参加的活动*/
            requestmyActivitys = function (userId, success, fail) {
                var uri = "/site/activity-join?id=" + userId;
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function () {
                    fail("error");
                };
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        success(xhr.response);
                    } else {
                        fail(xhr.status);
                    }
                };
                xhr.open("GET", uri);
                xhr.send();
            }, loadmyActivitys = function () {
        SELF.getUser(function (user) {
            requestmyActivitys(user["id"], function (response) {
                var json = window.JSON.parse(response),
                        list = json["v1"],
                        length = list.length,
                        i = 0,
                        obj0 = undefined,
                        obj = undefined,
                        html = "";
                for (; i < length; i++) {
                    obj0 = list[i];
                    obj = obj0["activity"];
                    var time = new Date(obj["start-time"]).toLocaleString();
                    html += "<div class='mui-row'>";
                    html += "<div class='mui-col-xs-6' data-activity-id='" + obj["id"] + "'>";
                    html += "  <li class='mui-table-view-cell'>";
                    html += "<a href='javascript:;'>";
                    html += "<img class='mui-media-object' src='" + obj["thumbnail"] + "' />";
                    html += "</a></li></div>";
                    html += "<div class='mui-col-xs-6'>";
                    html += "<li class='mui-table-view-cell>  <a style='margin-top: 2%;'>";
                    html += "<p style='line-height: 2em;'>" + obj["title"] + "</p>";
                    html += "<p style='line-height: 2em;'>" + obj["place"] + "</p>";
                    html += "<p style='line-height: 2em;'>" + time + "</p>";
                    html += "</a></li></div></div>";
                }
                $("#activity-list > ul").append(html);
            }, function (status) {
                SELF.errorHandler(status);
            });
        });
    }, destroyUI = function () {
        $("#myActivitys header span").unbind();
        $.closePopup();
        $("#myActivitys").remove();
    };
    SELF.subscribe("show-myActivitys", function (userId) {
        SELF.loadHtml("module/me/myActivitys.html", function (html) {
            $("body").append(html);
            console.log($("body").append(html));
            $.closePopup();
            $("#user-info-window").remove();
            
            $("#myActivitys").popup();
            SELF.getUser(function (user) {
                initUI(userId, user);
            }, function (error) {
                initUI(userId, error);
            });

        });
    });

})(window, $, SELF);
