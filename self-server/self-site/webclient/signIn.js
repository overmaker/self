(function (window, $, layer, SELF) {
    //设置一个全局的变量，便于保存验证码
    var checkCode2 = false,
            checkPhonenumber2 = false;
    checkPhoneNumber = function (mobile) {
        let objPrams = {
            "mobile": mobile
        };
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert("短信发送成功");
            } else if (xhr.status === 404) {
                alert("短信发送失败");
            } else {
//                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/user/check3?");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, checkCode = function (mobile, code, callback) {
        let objPrams = {
            "mobile": mobile,
            "email": code,
        };
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                checkCode2 = window.JSON.parse(xhr.response);
                callback(checkCode2);
            } else if (xhr.status === 404) {
                alert("失败");
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/user/checkCode");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, checkPhonenumber = function (mobile, callback) {
        let objPrams = {
            "mobile": mobile
        };
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                checkPhonenumber2 = window.JSON.parse(xhr.response);
                callback(checkPhonenumber2);
            } else if (xhr.status === 404) {
                alert("失败");
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/activity-userTicket/check");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, sendSms = function (mobile) {
        let objPrams = {
            "mobile": mobile
        };
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert("短信发送成功");
            } else if (xhr.status === 404) {
                alert("短信发送失败");
            } else {
//                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/user/check3?");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    },
            /*签到*/
            signIn = function (mobile) {
                let objPrams = {
                    "mobile": mobile
                };
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        alert("签到成功!");
                        window.location.href = "http://114.115.149.5/mobile/index.html";
                    } else {
                        alert("签到失败!");
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.open("PUT", "/site/activity-userTicket");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(objPrams));
            };
    $(document).ready(function () {
        $("#smsCode").attr('disabled', false);//设置disabled属性为false，按钮可用
        $("#mobileCode").attr('disabled', false);//设置disabled属性为false，按钮可用
        $("#smsCode").click(function () {
            var mobile = $("#registerMobile").val();
            checkPhonenumber(mobile, function () {
                alert(mobile);
                if (checkPhonenumber2 === true || checkPhonenumber2 === "true") {
                    alert(checkPhonenumber2);
                    /*发送短信*/
                    sendSms(mobile);
                } else {
                    alert("无报名信息");
                }
            });
        });
        $("#registerSubmit").click(function () {
            var mobile = $("#registerMobile").val();
            var mobileCode = $("#mobileCode").val();
            if (mobileCode == null || mobileCode == undefined || mobileCode == "") {
                alert(mobile);
                alert(mobileCode);
                alert("填验证码");
                return;
            }
            checkCode(mobile, mobileCode, function (status) {
                alert(status);
                if (checkCode2 === true || checkCode2 === "true") {
                /*签到*/
                signIn(mobile);
                } else {
                    alert("签到失败");
                }
            });
        });
    }
    );
})(window, $, layer, SELF);

