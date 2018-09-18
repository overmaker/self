(function (window, $, SELF) {

    var initUI = function () {
        SELF.loadHtml("module/me/login-window.html", function (html) {
            $("body").append(html);
            $("#login-window").popup();
            $("#login-window header > span").bind("click", function () {
                destroyUI();
            });

            /*提交*/
            $("#login-window-submit").bind("click", function () {
                var userName = $("#login-window-user").val().trim(),
                        password = $("#login-window-pwd").val().trim();
                doLogin(userName, password);
            });

        });
    }, destroyUI = function () {
        $("#login-window header > span").unbind();
        $("#login-window-submit").unbind();
        $.closePopup();
        $("#login-window").remove();
    }, requestLogin = function (userName, password, success, fail) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.onload = function () {
            if (xhr.status === 204) {
                success();
            } else {
                fail(xhr.status);
            }
        };

        xhr.open("POST", "/site/auth/self");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("user-name=" + userName + "&password=" + password);
    },
        /*提交方法*/
        doLogin = function (userName, password) {
            if (userName === "" || password === "") {
                $.toptip("请填写用户名和密码", "warning");
                return;
            }
            requestLogin(userName, password, function () {
                $("#login-window-submit").unbind(); // 提前解绑提交事件，防止再次登录
                $("#login-window-user").val("");
                $("#login-window-pwd").val("");
                $.toast("登录成功", 1500, function () {
                SELF.publish("user-login");
                    destroyUI();
                });
            }, function (status) {
                if (status === 401) {
                    $.toptip("用户名或密码错误", "error");
                } else {
                    SELF.errorHandler(status);
                }
            });
        };

    SELF.subscribe("show-login-window", function () {
        initUI();
    });

})(window, $, SELF);
