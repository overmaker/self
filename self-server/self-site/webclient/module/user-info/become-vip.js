//(function (window, $, layer, SELF) {
$(function () {
    openDaZhe(98, 2);
});
$("#becomevip a").each(function () {
    $(this).click(function () {
        var money = $(this).attr("id"),
                type = $(this).attr("vipType");
        SELF.getUser(function (user) {
            if (user === 401) {
                layer.msg("只有登录用户才能打赏");
            } else {
                putVIP(user.id, money, type);
            }
        });
    });
});

function openDaZhe(price, save) {
    document.getElementById("p1").innerHTML = price + "元";
    document.getElementById("span1").innerHTML = "（已优惠" + save + "元）";
}
putVIP = function (userId, money, type) {
    var xhr = new XMLHttpRequest();
    xhr.onloadstart = SELF.startLoadAnimation();
    xhr.onloadend = SELF.stopLoadAnimation();
    xhr.onload = function () {
        if (xhr.status === 200) {
            var json = JSON.parse(xhr.response),
                    return_code = json["return_code"],
                    result_code = json["result_code"];
            if (return_code === "SUCCESS" && result_code === "SUCCESS") {
                layer.alert(
                        "<img src='/site/becomeVippay/qr-code?data=" + json["code_url"] + "' />"
                        );
            }
        } else {
            SELF.errorHandler(xhr.status);
        }
    };
    xhr.onerror = function () {
        SELF.errorHandler("error");
    };
    xhr.open("POST", "/site/becomeVippay/vippay");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    var obj = {
        "user": {
            "id": userId
        },
        "total-fee": money,
        "vip-type": type
    };
    xhr.send(JSON.stringify(obj));
};

//})(window, $, layer, SELF);