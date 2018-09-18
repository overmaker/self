(function (window, $, SELF) {

    var initUI = function () {
        $("#myHits header span").bind("click", function () {
            destroyUI();
        });
        $("#video-list ul").bind("click", function (event) {
            var target = $(event.target),
                    videoId = target.attr("data-video-id");
            while (!target.is("article") && videoId === undefined) {
                target = target.parent();
                videoId = target.attr("data-video-id");
            }
            if (videoId) {
                SELF.publish("show-video-detail", videoId);
            }
        });
        loadmyHits();
    }, /*我看过的视频*/
            requestmyHits = function (userId, success, fail) {
                var uri = "/site/video-hits?id=" + userId;
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
            }, loadmyHits = function () {
        SELF.getUser(function (user) {
            requestmyHits(user["id"], function (response) {
                var json = window.JSON.parse(response),
                        list = json["v1"],
//                    total = json["v2"],
                        length = list.length,
                        i = 0,
                        obj0 = undefined,
                        obj = undefined,
                        html = "";
                for (; i < length; i++) {
                    obj0 = list[i];
                    obj = obj0["video"];
                    html += "<li class='mui-table-view-cell mui-media mui-col-xs-6' data-video-id='" + obj["id"] + "'>";
                    html += "<a href='javascript:;'>";
                    html += "<img class='mui-media-object' src='" + obj["thumbnail"] + "' />";
                    html += "<div class='mui-media-body'>" + obj["title"] + "</div>";
                    html += "</a>";
                    html += "</li>";
                }
                $("#video-list > ul").append(html);
            }, function (status) {
                SELF.errorHandler(status);
            });
        });
    }, destroyUI = function () {
        $("#myHits header span").unbind();
        $.closePopup();
        $("#myHits").remove();
    };
    
    
        SELF.subscribe("show-myHits", function (userId) {
        SELF.loadHtml("module/me/myHits.html", function (html) {
            $("body").append(html);
            console.log($("body").append(html));
            $.closePopup();
            $("#myHits").remove();
            
            $("#myHits").popup();
            SELF.getUser(function (user) {
                initUI(userId, user);
            }, function (error) {
                initUI(userId, error);
            });
        });
    });

})(window, $, SELF);
