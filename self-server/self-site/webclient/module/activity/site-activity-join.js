(function (window, $, layer, SELF) {
    var activityId = null,
            page = null,
            jnumTextbox = undefined,
            joinId = undefined,
            pay_dialog_index = undefined;
            
    // 显示支付费用(如果报名需要付费)
    var countFee = function () {
        var inputnum = jnumTextbox.val();
        if (inputnum.length > 0) {
            inputnum = parseInt(inputnum, 10);
            if (page["activity"]["free"] === false) {
                $("#num-desc").css("color", "red").text("报名需要支付：" + page["activity"]["fee"] * inputnum + " 元");
            }
        } else {
            $("#num-desc").text("");
        }
    };
    var requestJoin = function (join, success) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                success(xhr.responseText);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/activity-join");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(join));
    }, join = function (join) {
        requestJoin(join, function (result) {
            var json = JSON.parse(result);
            if (json["v2"] === "joined") {
                joinId = json["v1"];
                $("#input_info_area").hide();
                $("#submit_area").hide();
                $("#success_area").show();
                if (page["activity"]["free"] === false) {
                    $("#pay_area").show(); // 弹出支付区域
                }
            } else if (json["v2"] === "full") {
                layer.msg("报名名额已满");
            } else if (json["v2"] === "over") {
                layer.msg("已过报名结束时间");
            }
        });
    }, requestActivityInfoPage = function (activityId, success) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                success(xhr.responseText);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/activity-join-page?id=" + activityId);
        xhr.send();
    }, loadActivityInfoPage = function (activityId) {
        requestActivityInfoPage(activityId, function (text) {
            page = JSON.parse(text);
            $("#join-activity-image").attr("src", page["activity"]["image"]);
            $("#join-activity-introduction").text(page["activity"]["introduction"]);
            var timestring = "活动时间：" + new Date(page["activity"]["start-time"]).toLocaleString() + " - " + new Date(page["activity"]["end-time"]).toLocaleString();
            $("#join-activity-time").text(timestring);
            var timestring = "报名时间：" + new Date(page["activity"]["join-starttime"]).toLocaleString() + " - " + new Date(page["activity"]["join-endtime"]).toLocaleString();
            $("#join-activity-join-time").text(timestring);
            var addrstring = "地点：" + page["activity"]["province"] + "-" + page["activity"]["place"];
            $("#join-activity-addr").text(addrstring);
            if (page["activity"]["free"] === false) {
                $("#join-activity-note").css("color", "red").text("温馨提示：此活动需要付费才可报名");
            }
            countFee();
            
            jnumTextbox.keyup(function (event) {
                countFee();
            });
        });
    };

    $(document).ready(function () {
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                Activity();
            };
            head.appendChild(script);
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

        $("#j-mobile").attr("maxlength", 13)
                .css("ime-mode", "disabled")
                .keydown(function (event) {
                    return event.keyCode === 8 // 退格
                            || event.keyCode === 37 // 左
                            || event.keyCode === 39 // 右
                            || (event.shiftKey && event.keyCode === 187) // 大键盘+
                            || (!event.shiftKey && event.keyCode === 189) // 大键盘-
                            || event.keyCode === 107 // 小键盘+
                            || event.keyCode === 109 // 小键盘-
                            || (event.keyCode >= 48 && event.keyCode <= 57) // 大键盘数字0~9
                            || (event.keyCode >= 96 && event.keyCode <= 105); // 小键盘数字0~9
                })
                .bind("cut copy paste", function (event) {
                    event.preventDefault();
                }); // 禁用剪切、复制、粘贴

        jnumTextbox = $("#j-num").attr("maxlength", 4)
                .css("ime-mode", "disabled")
                .keydown(function (event) {
                    return event.keyCode === 8 // 退格
                            || event.keyCode === 37 // 左
                            || event.keyCode === 39 // 右
                            || (event.keyCode >= 48 && event.keyCode <= 57) // 大键盘数字0~9
                            || (event.keyCode >= 96 && event.keyCode <= 105); // 小键盘数字0~9
                })
                .bind("cut copy paste", function (event) {
                    event.preventDefault();
                }); // 禁用剪切、复制、粘贴

        activityId = SELF.getQueryString("id");
        if (activityId === null) {
            $("#j-name").attr("disabled", "disabled");
            $("#j-email").attr("disabled", "disabled");
            $("#j-mobile").attr("disabled", "disabled");
            $("#j-num").attr("disabled", "disabled");
            $("#j-org").attr("disabled", "disabled");
            $("#j-post").attr("disabled", "disabled");
            $("#join-submit").remove();
            window.location.href = "no-activity.html";
        }

        $("#join-submit").click(function () {
            var jname = $("#j-name").val(),
                    jmobile = $("#j-mobile").val(),
                    jemail = $("#j-email").val(),
                    jnum = $("#j-num").val(),
                    jorg = $("#j-org").val(),
                    jpost = $("#j-post").val(),
                    jcomment = $("#j-comment").val();
            if (jname === "") {
                layer.msg("请填写姓名");
                return;
            }
            if (jmobile === "") {
                layer.msg("请填写手机号");
                return;
            }
            if (jemail === "") {
                layer.msg("请填写邮箱");
                return;
            }
            if (jnum === "") {
                layer.msg("请填写报名人数");
                return;
            }
            jnum = parseInt(jnum, 10);
            if (jnum === 0) {
                layer.msg("报名人数最少是1人");
                return;
            }
            if (jorg === "") {
                layer.msg("请填写单位");
                return;
            }
            if (jpost === "") {
                layer.msg("请填写职务");
                return;
            }

            SELF.getUser(function (user) {
                if (user === 401) {
                    var index = layer.open({
                        title: false,
                        type: 2,
                        area: ["800px", "600px"],
                        content: "/login/login.html?redirect_url=/module/activity/site-activity-join.html?id=" + activityId
                    });
                    layer.full(index);
                } else if (user) {
                    var joinObj = {
                        "num": jnum,
                        "j-name": jname,
                        "j-mobile": jmobile,
                        "j-email": jemail,
                        "j-org": jorg,
                        "j-post": jpost,
                        "user": {
                            "id": user["id"]
                        },
                        "activity": {
                            "id": parseInt(activityId, 10)
                        }
                    };
                    if (jcomment !== "") {
                        joinObj["j-comment"] = jcomment;
                    }
                    join(joinObj);
                } else {
                    layer.alert("获取用户信息失败", {icon: 2, title: false});
                }
            });

        });

        $("#pay-submit").click(function () {
            if (joinId && typeof joinId === "number") {
                pay_dialog_index = layer.open({
                    type: 2,
                    title: false,
                    area: ["350px", "380px"],
                    content: "/module/activity/site-activity-pay.html?join-id=" + joinId
                });
            }
        });
        
        /*
         * 由于支付对话框完成按钮回调
         */
        SELF.payNotify = function () {
            layer.close(pay_dialog_index);
            $("#pay_area").hide();
            $("#pay_result_area").show();
        };
        
        $("#check-pay").click(function () {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var ispay = xhr.responseText.trim();
                    if (ispay === "true") {
                        $("#pay_result_desc").text("已支付");
                    } else {
                        $("#pay_result_desc").text("等待支付结果");
                    }
                } else {
                    SELF.errorHandler(xhr.status);
                }
            };
            xhr.onerror = function () {
                SELF.errorHandler("error");
            };
            xhr.open("GET", "/site/activity-join-pay/check-pay?join-id=" + joinId);
            xhr.send();
        });
        
        loadActivityInfoPage(activityId);
    });
})(window, $, layer, SELF);
