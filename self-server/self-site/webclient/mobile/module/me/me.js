(function(window, $, SELF) {

    var initUI = function() {
            $("#me-login").bind("click", function() {
                SELF.publish("show-login-window");
            });
            $("#photo").bind("click", function() {
                SELF.publish("show-user-info-window");
            });
            $("#mySaves header > span").bind("click", function () {
                destroyUI();
            });
            refresh();
            refreshUserInfo();
            /*注册*/
            $("#register").bind("click", function() {
                layer.open({
                    title: '注册',
                    type: 2,
                    content: 'module/me/login-window.html',
                    area: ['100%', '100%']
                });
            });
            /*我收藏的视频*/
            SELF.getUser(function(user) {
                var userId = user["id"];
                $("#mySaves-list").click(function() {
                    SELF.publish("show-mySaves", userId);
                });
            });
            /*我看过的视频*/
            SELF.getUser(function(user) {
                var userId = user["id"];
                $("#myHits-list").click(function() {
                    SELF.publish("show-myHits", userId);
                });
            });
            /*我参加过的活动*/
            SELF.getUser(function(user) {
                var userId = user["id"];
                $("#myActivitys-list").click(function() {
                    SELF.publish("show-myActivitys", userId);
                });
            });

            loadPolicy();

            /*提交*/
            $("#login-window-submit").bind("click", function() {
                var userName = $("#login-window-user").val().trim(),
                    password = $("#login-window-pwd").val().trim();
                doLogin(userName, password);
            });
        },
        destroyUI = function() {
            $("#me-login").unbind();
            $("#me-user-info").unbind();
            $("#about").unbind();
            $("#self-me").pullToRefreshDone();
        },
        refreshUserInfo = function() {
            SELF.getUser(function(user) {
                if(typeof user === "object") {
                    $("#me-user-info .aui-card-list-user-info").text("登录账号：" + user["user-name"]);
                    window.sessionStorage.setItem("user", window.JSON.stringify(user));
                    SELF.getUserInfo(user["id"], function(userInfo) {
                        if(typeof userInfo === "object") {
                            $("#me-user-info img").attr("src", userInfo["photo"]);
                            $("#photo .name").text(userInfo["nick-name"]);
                            if(userInfo["vip"] === true) {
                                $("#me-user-info .aui-card-list-user-name > small").text("会员");
                            } else {
                                $("#me-user-info .aui-card-list-user-name > small").text("普通用户");
                            }
                            window.sessionStorage.setItem("user-info", window.JSON.stringify(userInfo));
                            $("#self-me").pullToRefreshDone();
                        } else {
                            $("#self-me").pullToRefreshDone();
                        }
                    });
                } else {
                    $("#self-me").pullToRefreshDone();
                }
            });
        },

        //提交方法调用
        requestLogin = function(userName, password, success, fail) {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function() {
                SELF.errorHandler("error");
            };
            xhr.onload = function() {
                if(xhr.status === 204) {
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
        doLogin = function(userName, password) {
            if(userName === "" || password === "") {
                $.toptip("请填写用户名和密码", "warning");
                return;
            }
            requestLogin(userName, password, function() {
                $("#login-window-submit").unbind(); // 提前解绑提交事件，防止再次登录
                $("#login-window-user").val("");
                $("#login-window-pwd").val("");
                $.toast("登录成功", 1500, function() {
                    SELF.publish("user-login");
                    destroyUI();
                });
            }, function(status) {
                if(status === 401) {
                    $.toptip("用户名或密码错误", "error");
                } else {
                    SELF.errorHandler(status);
                }
            });
        };

    refresh = function() {
        $("#me-user-info").hide();
        $("#me-to-login").hide();
        $("#me-to-login").hide();
        var cacheUser = window.sessionStorage.getItem("user"),
            cacheUserInfo = window.sessionStorage.getItem("user-info"),
            userJson = undefined,
            userInfoJson = undefined;
        if(cacheUser && cacheUserInfo && cacheUser !== null && cacheUserInfo !== null) {
            userJson = window.JSON.parse(cacheUser);
            userInfoJson = window.JSON.parse(cacheUserInfo);
            $("#me-user-info .aui-card-list-user-info").text("登录账号：" + userJson["user-name"]);
            $("#me-user-info img").attr("src", userInfoJson["photo"]);
            $("#me-user-info .aui-card-list-user-name > div").text(userInfoJson["nick-name"]);
            if(userInfoJson["vip"] === true) {
                $("#me-user-info .aui-card-list-user-name > small").text("会员");
            } else {
                $("#me-user-info .aui-card-list-user-name > small").text("普通用户");
            }
            $("#me-user-info").show();
        } else {
            SELF.getUser(function(user) {
                if(typeof user === "object") {
                    $("#me-user-info .aui-card-list-user-info").text("登录账号：" + user["user-name"]);
                    window.sessionStorage.setItem("user", window.JSON.stringify(user));
                    SELF.getUserInfo(user["id"], function(userInfo) {
                        if(typeof userInfo === "object") {
                            $("#me-user-info img").attr("src", userInfo["photo"]);
                            $("#me-user-info .aui-card-list-user-name > div").text(userInfo["nick-name"]);
                            if(userInfo["vip"] === true) {
                                $("#me-user-info .aui-card-list-user-name > small").text("会员");
                            } else {
                                $("#me-user-info .aui-card-list-user-name > small").text("普通用户");
                            }
                            window.sessionStorage.setItem("user-info", window.JSON.stringify(userInfo));
                            $("#me-user-info").show();
                        } else {
                            $("#me-to-login").show();
                        }
                    });
                } else {
                    $("#me-to-login").show();
                }
            });
        }
    }, requestKnowhow = function(success, fail) {
        var uri = "/site/knowhow?offset=0&count=10",
            response = null;
        if(response && response !== null) {
            success(response);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function() {
                fail("error");
            };
            xhr.onload = function() {
                if(xhr.status === 200) {
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        }
    }, loadKnowhow = function() {
        requestKnowhow(function(response) {
            var json = window.JSON.parse(response),
                list = json["v1"],
                length = list.length,
                i = 0,
                obj = undefined,
                html = "";
            for(; i < length; i++) {
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
        }, function(status) {
            $("body > article").pullToRefreshDone();
            SELF.errorHandler(status);
        });
    }, requestPolicy = function(success, fail) {
        var uri = "/site/policy/selectAll",
            response = null;
        if(response && response !== null) {
            success(response);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function() {
                fail("error");
            };
            xhr.onload = function() {
                if(xhr.status === 200) {
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        }
    }, loadPolicy = function() {
        requestPolicy(function(response) {
            var json = window.JSON.parse(response),
                list = json,
                length = list.length,
                i = 0,
                obj = undefined,
                html = "";
            for(; i < length; i++) {
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

        }, function(status) {
            $("body > article").pullToRefreshDone();
            SELF.errorHandler(status);
        });
    };

    SELF.subscribe("unload-me", function() {
        destroyUI();
        $("body > article").empty();
    })("load-me", function() {
        SELF.loadHtml("module/me/me.html", function(html) {
            $("body > article").empty().html(html);
            initUI();
        });
    })("user-login", function() {
        window.sessionStorage.removeItem("user");
        window.sessionStorage.removeItem("user-info");
        $("#me-user-info .aui-card-list-user-info").empty();
        $("#me-user-info img").removeAttr("src");
        $("#me-user-info .aui-card-list-user-name > div").empty();
        $("#me-user-info .aui-card-list-user-name > small").empty();
        refresh();
    })("user-logout", function() {
        window.sessionStorage.removeItem("user");
        window.sessionStorage.removeItem("user-info");
        $("#me-user-info .aui-card-list-user-info").empty();
        $("#me-user-info img").removeAttr("src");
        $("#me-user-info .aui-card-list-user-name > div").empty();
        $("#me-user-info .aui-card-list-user-name > small").empty();
        $("#me-user-info").hide();
        $("#me-to-login").show();
    });

})(window, $, SELF);