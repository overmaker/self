(function (window, $, SELF) {
    var initUI = function (activityId) {
        $("#activity-join").popup();
        $("#activity-join header span").bind("click", function () {
            destroyUI();
        });
        /*通过code获取oppenid*/
        getOppenid = function (code, success, fail) {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var result = xhr.responseText,
                            openid = result.Oppenid;
                    sessionStorage.setItems("openid", openid)
//                        success(Oppenid);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.onerror = function () {
                fail("error");
            };
            var query = "/site/donationpay?code=" + code;
            xhr.open("GET", query);
            xhr.send();
        },
                requestJoin = function (userId, ticketId, num, name, mobile, totalFee, email) {
                    var joinObj = {
                        "user": {
                            "id": 1,
                            "name": openid,
                        },
                        "ticket": {
                            "id": ticketId
                        },

                        "num": num,
                        "name": name,
                        "mobile": mobile,
                        "vcode": "test2222",
                        "total-fee": totalFee,
                        "email": email
                    };
                    /*oppenid*/
                    var openid = sessionStorage.getItem("openid");
                    if (openid == null || openid.length == 0) {
                        $.toast("无法获得openid");
                        return;
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.onloadstart = SELF.startLoadAnimation();
                    xhr.onloadend = SELF.stopLoadAnimation();
                    xhr.onerror = function () {
                        $.toptip("出错啦！", "warning");
                    };
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            var data = JSON.parse(xhr.response),
                                    code = data.code,
                                    paySign = data.paySign,
                                    nonceStr = data.nonceStr,
                                    timeStamp = data.timeStamp,
                                    package = data.package;

                            WeixinJSBridge.invoke(
                                    "getBrandWCPayRequest", {
                                        "appId": "wx077c19da2c0ddefa",
                                        "timeStamp": timeStamp,
                                        "nonceStr": nonceStr,
                                        "package": package,
                                        "signType": "MD5",
                                        "paySign": paySign
                                    }, function (res) {
                                if (res.err_msg == "get_brand_wcpay_request:ok") {
                                    window.location.href = "/mobile/index.jhtml";
                                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                    $.toast("取消支付");
                                } else {
                                    $.toast("支付失败");
                                }
                            }
                            );
                        } else {
                            $.toast("支付失败 " + xhr.status + " " + xhr.response);
                        }
                    };
                    console.log(JSON.stringify(joinObj));
                    xhr.open("POST", "/site/activity-userTicket/wxpay");
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.send(JSON.stringify(joinObj));
                };
        $("#join-submit").click(function () {
            var jname = $("#name").val(),
                    num = $("#num").val(),
                    jmobile = $("#mobile").val(),
                    jemail = $("#email").val(),
                    jorg = $("#org").val(),
                    jpost = $("#post").val();
            if (jname === "") {
                $.toptip("请填写姓名", "warning");
                return;
            }
            if (num === "") {
                $.toptip("请填写报名人数", "warning");
                return;
            }
            if (jmobile === "") {
                $.toptip("请填写手机号", "warning");
                return;
            }
            if (jemail === "") {
                $.toptip("请填写邮箱", "warning");
                return;
            }
            if (jorg === "") {
                $.toptip("请填写单位", "warning");
                return;
            }
            if (jpost === "") {
                $.toptip("请填写职务", "warning");
                return;
            }
            SELF.getUser(function (user) {
                var uId = user["id"];
                if (user === 401) {
                    $.toptip("请先登录", "warning");
                } else {
//                    requestJoin(userId, ticketId, num, name, mobile, totalFee, email);
                    requestJoin(1, 11, 1, "赵海", "15874524658", 12, "1569845@qq.com");
//                window.location.reload()
                }
            });
        });
    }, destroyUI = function () {
        $("#activity-join header > span").unbind();
        $.closePopup();
        $("#activity-join").remove();
    };
    SELF.subscribe("show-activity-join", function (activityId) {
        SELF.loadHtml("module/activity/activity-join.html", function (html) {
            $("body").empty();
            $("body").append(html);
            SELF.getUser(function (user) {
                if (user === 401) {
                    $.toptip("请先登录", "warning");
                    $("body").empty();
                    SELF.publish("show-login-window");
                } else {
                    initUI(activityId);
                }
            });
            /*获取code 开始*/
            var getRequest = this.getRequest();
            if (getRequest.code) {
                this.code = getRequest.code;
            } else {
                var pageUrl = window.location.href
                        .replace(/[/]/g, "%2f")
                        .replace(/[:]/g, "%3a")
                        .replace(/[#]/g, "%23")
                        .replace(/[&]/g, "%26")
                        .replace(/[=]/g, "%3d");
                var url =
                        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                        "填写网页授权回调域名所对应的那个公众号的AppId" +
                        "&redirect_uri=" +
                        pageUrl + //这里放当前页面的地址
                        "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
                window.location.href = url;
            }
            console.log("CODE：" + getRequest.code);
            alert(1);
            alert(getRequest.code);
            getOppenid(getRequest.code);
            /*获取code 结束*/
        });
    });
})(window, $, SELF);
