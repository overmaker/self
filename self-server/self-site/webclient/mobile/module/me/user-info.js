(function(window, $, SELF) {
    var userId = "";
    
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

    var initUI = function() {
            SELF.loadHtml("module/me/user-info.html", function(html) {
                $("body").append(html);
                $("#user-info-window").popup();
                $("#user-info-window header > span").bind("click", function() {
                    destroyUI();
                });
                $("#user-info-logout").bind("click", function() {
                    logout();
                });
                //修改资料
                $("#inform").bind("click", function() {
                    SELF.publish("modify-information", userId);
                layer.open({
                    title: '修改个人资料',
                    type: 2,
                    content: 'module/me/modify-information.html?id='+userId,
                    area: ['100%', '100%']
                });
            });
                loadUserInfo();

            });
        },
        destroyUI = function() {
            $("#user-info-window header span").unbind();
            $("#user-info-logout").unbind();
            $.closePopup();
            $("#user-info-window").remove();
        },
        loadUserInfo = function() {
            SELF.getUser(function(user) {
                if(typeof user === "object") {
                    $("#me-user-info .aui-card-list-user-info").text("登录账号：" + user["user-name"]);
                    SELF.getUserInfo(user["id"], function(userInfo) {
                        if(typeof userInfo === "object") {
                            userId = user["id"];
                            $("#me-user-info img").attr("src", userInfo["photo"]);
                            $("#me-user-info .aui-card-list-user-name > div").text(userInfo["nick-name"]);
                            $("#login-num").text(user["user-name"]);
                            if(userInfo["gender"] === true) {
                                $("#gender").text("男");
                            } else {
                                $("#gender").text("女");
                            }
                            if(userInfo["birth-date"] !== null & userInfo["birth-date"] !== "") {
                                $("#birthdate").text(formatDate(userInfo["birth-date"]));
                            } else {
                                $("#birthdate").text("未填写");
                            }
                            if(userInfo["address"] !== null & userInfo["address"] !== "") {
                                $("#address").text(userInfo["address"]);
                            } else {
                                $("#address").text("未填写");
                            }
                            if(userInfo["mobile"] !== null & userInfo["mobile"] !== "") {
                                $("#mobile").text(userInfo["mobile"]);
                            } else {
                                $("#mobile").text("未填写");
                            }
                            if(userInfo["email"] !== null & userInfo["email"] !== "") {
                                $("#email").text(userInfo["email"]);
                            } else {
                                $("#email").text("未填写");
                            }
                            $("#score").text(userInfo["score"]);
                            if(userInfo["vip"] === true) {
                                $("#vipORnot").text("会员");
                            } else {
                                $("#vipORnot").text("普通用户");
                            }
                            if(userInfo["volunteer"] === true) {
                                $("#volunteerORnot").text("志愿者");
                            } else {
                                $("#volunteerORnot").text("非志愿者");
                            }
                        }
                    });
                } else if(user === 401) {
                    $.toptip("用户认证失败，请注销后重新登录", "warning");
                } else {
                    $.toptip("获取用户信息失败", "error");
                }
            });
        };
    logout = function() {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onerror = function() {
            SELF.publish("user-logout");
            destroyUI();
        };
        xhr.onload = function() {
            SELF.publish("user-logout");
            destroyUI();
        };
        xhr.open("DELETE", "/site/auth");
        xhr.send();
    };
    SELF.subscribe("show-user-info-window", function() {
        initUI();
    });

})(window, $, SELF);