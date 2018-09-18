(function (window, $, layer, SELF) {

    /**
     * 格式化时间
     * @param {type} date 时间参数
     * @param {type} format 转换格式
     * @returns {String} 转换结果
     */
    function formatDate(date, format) {
        if (date === undefined || date === null) {
            return "";
        }
        if (!format) {
            format = "yyyy-MM-dd";
        }
        date = new Date(parseInt(date));
        var dict = {
            "yyyy": date.getFullYear(),
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "S": date.getMilliseconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(y+|M+|d+)/g, function (a) {
            return dict[a];
        });
    }

    var initUI = function(html, userId) {
            $("body").append(html);
            loadModifyInformation(userId);
        }, requestModifyInformation = function (userId, success, fail) {
        var uri = "/site/user-info/" + userId;
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onerror = function() {
            fail("error");
        };
        xhr.onload = function () {
            if (xhr.status === 200) {
                success(xhr.response);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.open("GET", uri);
        xhr.send();
    }, loadModifyInformation = function (userId) {
        requestModifyInformation(userId, function (response) {
            var userInfo = JSON.parse(response);
            console.log(userInfo);
            console.log(document.getElementsByName("title").value);
            if (userInfo["nick-name"] !== null && userInfo["nick-name"] !== "") {
//                document.getElementById("nickName").value = userInfo["nick-name"];
            }
        }, function (status) {
            SELF.errorHandler(status);
        });
    };

    SELF.subscribe("modify-information", function (userId) {
        SELF.loadHtml("module/activity/activity-detail.html", function (html) {
            initUI(html, userId);
//            loadModifyInformation(userId);
        });
    });
})(window, $, layer, SELF);