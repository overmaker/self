(function (window, $, layer, SELF) {
    SELF.getQueryString = SELF.getQueryString || (function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return unescape(r[2]);
        }
        return null;
    });

    /*
     * 加载动画
     */
    //var index;
    SELF.startLoadAnimation = SELF.startLoadAnimation || (function () {
//        if (index) {
//            layer.close(index);
//        }
//        index = layer.load(1);
    });
    SELF.stopLoadAnimation = SELF.stopLoadAnimation || (function () {
//        if (index) {
//            layer.close(index);
//        }
    });
    
    /*
     * 文件上传
     */
    SELF.fileUpload = SELF.fileUpload || (function (subPath, file, callback) {
        var xhr = new window.XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation;
        xhr.onloadend = SELF.stopLoadAnimation;
        xhr.onload = function () {
            if (xhr.status === 201) {
                callback(xhr.response);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function (evt) {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/files/" + subPath);
        xhr.setRequestHeader("Accept", "text/plain");

        var formData = new FormData();
        formData.append("file", file);
        xhr.send(formData);
    });
    /*
     * 错误处理
     */
    SELF.errorHandler = SELF.errorHandler || (function (error) {
        switch (error) {
            case 400 :
                layer.alert("数据请求错误", {icon: 2, title: false});
                break;
            case 401 :
                layer.alert("用户认证失败，请注销后重新登录", {icon: 2, title: false});
                break;
            case 500 :
                layer.alert("服务器内部错误", {icon: 2, title: false});
                break;
            case "error" :
                layer.alert("网络错误", {icon: 2, title: false});
                break;
            default :
                layer.alert("未知错误:" + error, {icon: 2, title: false});
                break;
        }
    });
    
    SELF.getUser = SELF.getUser || (function (callback) {
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
    
    SELF.isIE = SELF.isIE || (function () {
        return (window.ActiveXObject || "ActiveXObject" in window);
    });
})(window, $, layer, SELF);
