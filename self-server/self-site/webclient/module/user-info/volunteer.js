(function (window, $, layer, SELF) {

    /**
     * 格式化时间
     * @param {type} date 时间参数
     * @param {type} format 转换格式
     * @returns {String} 转换结果
     */
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

    var insertVolunteer = function (user, task, mobile, email, status, score, username) {
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
    }, requestVolunteerType = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        append = "<option value='0'>请选择任务类型</option>";
                for (var i = 0; i < json.v1.length; i++) {
                    append += "<option data-id='" + json.v1[i].id + "' value='" + json.v1[i].id + "'>" + json.v1[i].name + "</option>";
                }
                $("#volunteerType").append(append);
                $("#but1").click(function () {
                    requestVolunteer(document.getElementById("title").value, 0);
                });
                //回车搜索标题
                $("#title").keyup(function (e) {
                    if (e.keyCode === 13) {
                        requestVolunteer(document.getElementById("title").value, 0);
                        $("#title").val("");
                    }
                });
                $("#but2").click(function () {
                    requestVolunteer("", $('#volunteerType option:selected').val());
                });

            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/task-type?&offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, requestVolunteer = function (name, type) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                var i = 0;
                var append = "";
                for (; i < json.v1.length; i++) {
                    append += "<a href='volunteer-info.html?id=" + json.v1[i].id + "'><dl style='height:200px;'><dt style='float: left;'><img src='" + json.v1[i].thumbnail + "' style='width:280px; height:200px;'/></dt><dd style='color: black;margin-left: 30%;font-size: 22px;font-weight: bold;line-height: 45px;'>" + json.v1[i].title + "</dd><dd style='color: black;margin-left: 30%;font-size: 15px;'>" + json.v1[i].descript + "</dd></a><dd class='content-tity'> <button id='task' data-id=" + json.v1[i].id + " data-socre=" + json.v1[i].score + " style='height: 40px;width: 150px;font-weight: bold;border-radius: 15px;background-color: gainsboro;border:gainsboro;margin-left: 50%;margin-top: 7%;'>领取任务</button> </dd></dl>";
                }
                $("#volunteer").html(append);
            } else if (xhr.status === 404) {
                layer.alert("没有找到任务", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        var url = "&status=" + 1;
        if (name != undefined && name != "") {
            url += "&title=" + name;
        }
        if (type > 0) {
            url += "&type=" + type;
        }
        xhr.open("GET", "/site/task?&offset=0&count=10000" + url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadPolicy = function () {
        var xhr = new window.XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation;
        xhr.onloadend = SELF.stopLoadAnimation;
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        content = json["content"];
                $("div .tag3").html(content);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.open("GET", "/site/policy?type=0");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
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

    $(document).ready(function () {
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                Participation();
            };
            head.appendChild(script);
            $("#a").click(function () {
                $("#b").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
            $("#b").click(function () {
                $("#a").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
        });
        $("#flooter").load("/bottom.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            var email = $("input[type=email]").val();
            script.src = "/bottom.js";
            script.type = "text/javascript";
            script.onload = function () {
                loadEmail(email, "");
            };
            head.appendChild(script);
        });
        requestVolunteerType();
        requestVolunteer();
        loadPolicy();
        buttonClick();
    });
})(window, $, layer, SELF);
