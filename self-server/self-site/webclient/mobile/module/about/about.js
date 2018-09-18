(function (window, $, SELF) {
    var initUI = function () {

        SELF.loadHtml("module/me/me.html", function (html) {
            $("body").append(html);
            $("#about-window").popup();
            $("#about-window header > span").bind("click", function () {
                destroyUI();
            });
            loadKnowhow();
            loadPolicy();
        });
    }, requestKnowhow = function (success, fail) {
        var uri = "/site/knowhow?offset=0&count=10",
                response = null;
        if (response && response !== null) {
            success(response);
        } else {
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
        }
    }, loadKnowhow = function () {
        requestKnowhow(function (response) {
            var json = window.JSON.parse(response),
                    list = json["v1"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
            for (; i < length; i++) {
                obj = list[i];
                html += "<ul class='mui-table-view mui-table-view-chevron'>";
                html += "<ul class='mui-table-view mui-table-view-chevron'><li class='mui-table-view-cell mui-collapse'>";
                html += "<a class='mui-navigate-right' href='#'>";
                html += obj["type"];
                html += "</a> <ul class='mui-table-view mui-table-view-chevron'>";
                html += obj["introduction"];
                html += "</ul> </li> </ul>";
            }

            $("#ul-1").append(html);
        }, function (status) {
            $("body > article").pullToRefreshDone();
            SELF.errorHandler(status);
        });
    }, requestPolicy = function (success, fail) {
        var uri = "/site/policy/selectAll",
                response = null;
        if (response && response !== null) {
            success(response);
        } else {
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
        }
    }, loadPolicy = function () {
        requestPolicy(function (response) {
            var json = window.JSON.parse(response),
                    list = json,
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
            for (; i < length; i++) {
                obj = list[i];
                html += "<ul class='mui-table-view mui-table-view-chevron'>";
                html += "<ul class='mui-table-view mui-table-view-chevron'><li class='mui-table-view-cell mui-collapse'>";
                html += "<a class='mui-navigate-right' href='#'>";
                html += obj["title"];
                html += "</a> <ul class='mui-table-view mui-table-view-chevron'>";
                html += obj["content"];
                html += "</ul> </li> </ul> ";
            }
            $("#ul-2").append(html);

        }, function (status) {
            $("body > article").pullToRefreshDone();
            SELF.errorHandler(status);
        });
    }, destroyUI = function () {
        $("#about-window header > span").unbind();
        $.closePopup();
        $("#about-window").remove();
    };

    SELF.subscribe("show-about-window", function () {
        initUI();
    });

})(window, $, SELF);
