(function (window, $, layer, SELF) {

    var loginRequest = function (userName, password, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            callback(xhr.status);
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/auth/");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("user-name=" + userName + "&password=" + password);
    }, login = function (userName, password) {
        loginRequest(userName, password, function (status) {
            if (status !== 200) {
                SELF.errorHandler(status);
            } else {
                SELF.getUser(function (user) {
                    if (typeof user === "object") {
                        if (user["type"] === "admin") {
                            window.location = "/admin-console";
                        } else if (user["type"] === "user") {
                            window.location = "/";
                        }
                    } else {
                        SELF.errorHandler(user);
                    }
                });
            }
        });
    };

    $(document).ready(function () {
        $(".layui-btn").click(function () {
            var userName = $("input[type=text]").val(),
                    password = $("input[type=password]").val();
            login(userName, password);
        });
    });
})(window, $, layer, SELF);