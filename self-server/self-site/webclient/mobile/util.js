(function (window, $, SELF) {

    SELF.startLoadAnimation = SELF.startLoadAnimation || (function () {
        $.showLoading();
    });

    SELF.stopLoadAnimation = SELF.stopLoadAnimation || (function () {
        $.hideLoading();
    });

    SELF.errorHandler = SELF.errorHandler || (function (error) {
        switch (error) {
            case 400 :
                $.toast("数据请求错误", "forbidden");
                break;
            case 401 :
                $.toast("用户认证失败，请注销后重新登录", "forbidden");
                break;
            case 500 :
                $.toast("服务器内部错误", "forbidden");
                break;
            case "error" :
                $.toast("网络错误", "forbidden");
                break;
            default :
                $.toast("未知错误 " + error, "forbidden");
                break;
        }
    });

    SELF.loadHtml = SELF.loadHtml || (function (uri, callback) {
        var html = window.sessionStorage.getItem(uri);
        if (html && html !== null) {
            callback(html);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function () {
                SELF.errorHandler("error");
            };
            xhr.onload = function () {
                if (xhr.status === 200) {
                    html = xhr.response;
                    window.sessionStorage.setItem(uri, html);
                    callback(html);
                } else {
                    SELF.errorHandler(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        }
    });

    SELF.getUser = SELF.getUser || (function (success, fail) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var user = window.JSON.parse(xhr.response);
                success(user);
            } else {
                success(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
            fail("error");
        };
        xhr.open("GET", "/site/user/");
        xhr.send();
    });

    SELF.getUserInfo = SELF.getUserInfo || (function (userId, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var user = window.JSON.parse(xhr.response);
                callback(user);
            } else {
                callback(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/user-info/" + userId);
        xhr.send();
    });

})(window, $, SELF);
