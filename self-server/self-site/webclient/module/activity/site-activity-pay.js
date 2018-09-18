(function (window, $, layer, SELF) {
    
    var joinId = null;
    
    var genQRcode = function (joinId) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                var return_code = json["return_code"];
                var result_code = json["result_code"];
                var code_url = json["code_url"];
                if (return_code === "SUCCESS" && result_code === "SUCCESS") {
                    $("img").attr("src", "/site/activity-join-pay/qr-code?data=" + code_url);
                } else {
                    $("img").remove();
                    $("#err_code_des").text(json["err_code_des"]);
                }
            } else {
                
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/activity-join-pay/wxpay");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("join-id=" + joinId);
    };
    
    $(document).ready(function () {
        joinId = SELF.getQueryString("join-id");
        genQRcode(joinId);
        $("#refresh_qrcode").click(function () {
            genQRcode(joinId);
        });
        $("#pay_complete").click(function () {
            window.parent.SELF.payNotify();
        });
    });
    
})(window, $, layer, SELF);
