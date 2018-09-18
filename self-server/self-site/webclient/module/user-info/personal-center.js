$(function () {
    $("#top").load("/top.html", function () {
        var head = document.getElementsByTagName("head").item(0);
        var script = document.createElement("script");
        script.src = "/top.js";
        script.type = "text/javascript";
        head.appendChild(script);
        loadUserInfo();
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
    /* 返回订单页面 */
    var storage = window.localStorage;
    var payment = storage.getItem("payment");
    if (payment === "payment") {
        openHtml('../../module/shop/order.html');
    } else if (payment === "null") {
        openHtml('../../module/user-info/become-vip.html');
    }
    /* 用户信息 */
    var loadUserInfo = function () {
        SELF.getUser(function (user) {
            if (typeof user === "object") {
                SELF.getUserInfo(user["id"], function (userInfo) {
                    if (typeof userInfo === "object") {
                        $("#my-image").attr("src", userInfo["photo"]);
                        $("#my-score").text(userInfo["score"]);
                        if (userInfo["vip"] === true) {
                            $("#my-vip").text("会员");
                            $("#vipOrNot").remove();
                        } else {
                            $("#my-vip").text("普通用户");
                        }
                        if (userInfo["volunteer"] === true) {
                             $("#volunteerOrNot").remove();
                        }
                    }
                });
            } else if (user === 401) {
                layer.alert("用户认证失败，请注销后重新登录", {icon: 2, title: false});
            } else {
                layer.alert("未知错误:" + error, {icon: 2, title: false});
            }
        });
    };
});
/* 跳转页面 */
function openHtml(href) {
    var storage = window.localStorage;
    if (href === "payment") {
        storage.setItem("payment", "payment");
        window.location.href = "../../module/user-info/personal-center.html";
    } else {
        storage.setItem("payment", null);
    }
    $("#comment-html").load(href);
}
