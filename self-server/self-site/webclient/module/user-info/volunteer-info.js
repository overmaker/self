(function (window, $, layer, SELF) {

    $(document).ready(function () {
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            head.appendChild(script);
            About();
            loader();
        });
        $("#flooter").load("/bottom.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            var email = $("input[type=email]").val();
            script.src = "/bottom.js";
            script.type = "text/javascript";
            script.onload = function () {
                loadEmail(email, "");
                buttonClick();
            };
            head.appendChild(script);
        });

        function formatDate(date, format) {
            if (!format)
                format = "yyyy-MM-dd";
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
        var xhr = new XMLHttpRequest(),
                id = SELF.getQueryString("id");
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        str = "";
                str = "<div style='margin: 5%;'><img src='" + json.thumbnail + "' style='float: left;height: 300px;width: 40%;'><div style='padding-left: 44%; font-size: 20px;'><p style='font-size: 40px;margin-bottom: 3%;'>" + json.title + "</p><p>任务开始日期：" + formatDate(+json['create-time']) + "</p><p style='margin-top:5%;'>任务结束日期：" + formatDate(json.endTime) + "</p><p style='margin-top:5%;'>积分：" + json.score + "分</p><p><button id='task' data-id=" + json.id + " data-socre=" + json.score + " style='margin-top:5%;height: 40px;width: 150px;font-weight: bold;border-radius: 15px;background-color: gainsboro;border:gainsboro;' >领取任务</button></p></div><hr><div style='font-size: 24px;'>任务简介：</div><p style='margin-top: 24px;'>" + json.descript + "</p></div>";
                $("#volunteer").html(str);
            } else if (xhr.status === 404) {
                layer.alert("没有找到指定合作机构", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/task/" + id);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }), insertVolunteer = function (user, task, mobile, email, status, score, username) {

        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 204) {
                layer.msg("提交成功！");
            } else if (xhr.status === 409) {
                layer.msg("您已提交申请，不能重复提交！");
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/task-join");
        xhr.responseType = "json";
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("user=" + user + "&task=" + task + "&mobile=" + mobile + "&email=" + email + "&status=" + status + "&score=" + score + "&name=" + username);
    }, buttonClick = function () {
        SELF.getUser(function (user) {
            if (user === 401) {
                layer.msg("如要领取任务请先登录");
            } else if (typeof user !== "object") {
                SELF.errorHandler(user);
            } else {
                SELF.getUserInfo(user.id, function (userinfo) {
                    var mobile = userinfo.mobile;
                    var email = userinfo.email;
                    var name = userinfo.name;
                    if (mobile === null) {
                        mobile = "";
                    }
                    if (email === null) {
                        email = "";
                    }
                    if (name === null) {
                        name = "";
                    }
                    $("#volunteer").click(function (event) {
                        var target = $(event.target),
                                taskId = target.attr("data-id"),
                                taskScore = target.attr("data-socre");
                        if (target.is("button")) {
                            var xhr = new window.XMLHttpRequest();
                            xhr.onloadstart = SELF.startLoadAnimation;
                            xhr.onloadend = SELF.stopLoadAnimation;
                            xhr.onerror = function () {
                                SELF.errorHandler("error");
                            };
                            xhr.onload = function () {
                                if (xhr.status === 200) {
                                    var json = window.JSON.parse(xhr.response);
                                    if (json > 0) {
                                        insertVolunteer(user.id, taskId, mobile, email, 0, taskScore, name);
                                    } else {
                                        layer.msg("领取人数已到上限");
                                    }
                                } else {
                                    SELF.errorHandler(xhr.status);
                                }
                            };
                            xhr.open("GET", "/site/task-join/count/" + taskId);
                            xhr.setRequestHeader("Content-Type", "application/json");
                            xhr.send();
                        }
                    });
                });
            }
        });
    };
})(window, $, layer, SELF);
