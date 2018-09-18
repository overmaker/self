(function (window, $, SELF) {

    var initUI = function () {
          $("#user-info-window").popup();
        $("#mySaves header span").bind("click", function () {
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
        loadmySaves();
    }, /*我收藏的视频*/
            requestmySaves = function (userId, success, fail) {
                var uri = "/site/save?id=" + userId;
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
            }, loadmySaves = function () {
        SELF.getUser(function (user) {
            requestmySaves(user["id"], function (response) {
                var json = window.JSON.parse(response),
                        list = json["v1"],
                      total = json["v2"],
                        length = list.length,
                        i = 0,
                        obj = undefined,
                        html = "";
                for (; i < length; i++) {
                    obj = list[i];
                    html += "<li class='mui-table-view-cell mui-media mui-col-xs-6' data-video-id='" + obj["id"] + "'>";
                    html += "<a href='javascript:;'>";
                    html += "<img class='mui-media-object' src='" + obj["image"] + "' />";
                    html += "<div class='mui-media-body'>" + obj["title"] + "</div>";
                    html += "</a>";
                    html += "</li>";
                }
                $("#ul").append(html);
            }, function (status) {
                SELF.errorHandler(status);
            });
        });
    }, destroyUI = function () {
        $("#mySaves header span").unbind();
        $.closePopup();
        $("#mySaves").remove();
    };
    
    SELF.subscribe("show-mySaves", function (userId) {
        SELF.loadHtml("module/me/mySaves.html", function (html) {
            $("body").append(html);
            console.log($("body").append(html));
            $.closePopup();
            $("#mySaves").remove();
            
            $("#mySaves").popup();
            SELF.getUser(function (user) {
                initUI(userId, user);
            }, function (error) {
                initUI(userId, error);
            });
        });
    });

})(window, $, SELF);
