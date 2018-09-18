(function (window, $, layer, SELF) {
    //设置一个全局的变量，便于保存验证码
    var code,
            checkCode = false;
    createCode = function () {
        //首先默认code为空字符串
        code = '';
        //设置长度，这里看需求，我这里设置了4
        var codeLength = 4;
        var codeV = document.getElementById('code');
        //设置随机字符
        var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        //循环codeLength 我设置的4就是循环4次
        for (var i = 0; i < codeLength; i++) {
            //设置随机数范围,这设置为0 ~ 36
            var index = Math.floor(Math.random() * 36);
            //字符串拼接 将每次随机的字符 进行拼接
            code += random[index];
        }
        //将拼接好的字符串赋值给展示的Value
//        codeV.value = code;
    },
            //下面就是判断是否== 的代码，无需解释
            validate = function () {
                var oValue = document.getElementById('input').value.toUpperCase();
                if (oValue == 0) {
                    alert('请输入验证码');
                } else if (oValue != code) {
                    alert('验证码不正确，请重新输入');
                    $("#input").val("");
                    createCode();
                } else {
                    alert("校验成功");
                    $("#input").val("");
                    $("#smsCode").attr('disabled', false);//设置disabled属性为false，按钮可用
//                    $("#mobileCode").attr('disabled', false);//设置disabled属性为false，按钮可用
                }
            },checkPhoneNumber = function (mobile) {
                let objPrams = {
                        "mobile":mobile
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
//                                    SELF.errorHandler(xhr.status);
                                }
                            };
                            xhr.onerror = function () {
                                SELF.errorHandler("error");
                            };
                            xhr.open("POST", "/site/user/check3?");
                            xhr.setRequestHeader("Content-Type", "application/json");
                            xhr.send(JSON.stringify(objPrams));
                        },  checkCode = function (mobile, code, callback) {
                            let objPrams = {
                                    "mobile": mobile,
                                    "email": code
                                };
                                var xhr = new XMLHttpRequest();
                                xhr.onloadstart = SELF.startLoadAnimation();
                                xhr.onloadend = SELF.stopLoadAnimation();
                                xhr.onload = function () {
                                    if (xhr.status === 200) {
                                        checkCode = window.JSON.parse(xhr.response);
                                       callback(checkCode);
                                       alert(checkCode);
//                                        
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
                            },
            register = function (userName, passWord, mobile) {
                let objPrams = {
                    "user-name": userName,
                    "password": passWord,
                    "user-info": {
                        "mobile": mobile
                    }
                };
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        window.location.href = "success.html";
                    } else if (xhr.status === 409) {
                        alert("用户名被占用,请重新注册!");
                        $('#registerName').val("");
                        $('#registerPassword').val("");
                    } else {
                        window.location.href = "failure.html";
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.open("POST", "/site/user/register");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(objPrams));
            };
    $(document).ready(function () {
    	 /*发送倒计时*/
   	 var wait = 60;
        function time(o) {
            if (wait == 0) {
                o.removeAttribute("disabled");
                o.value = "免费获取验证码";
                wait = 60;
            } else {

                o.setAttribute("disabled", true);
                o.value = "重新发送(" + wait + ")";
                wait--;
                setTimeout(function () {
                    time(o);
                },
                        1000);
            }
        }
//        document.getElementById("smsCode").onclick = function () {
//            time(this);
//            var mobile = $("#registerMobile").val();
//            checkPhoneNumber(mobile);
//        };
//        $("#mobileCode").attr('disabled', true);
        $("#smsCode").attr('disabled', true);//设置disabled属性为false，按钮可用
        $("#validate").click(function () {
            validate();
        });
        //设置此处的原因是每次进入界面展示一个随机的验证码，不设置则为空
        window.onload = function () {
            createCode();
        };
        $("#registerSubmit").click(function () {
//            var mobileCode = $("#mobileCode").val();
            var userName = $("#registerName").val();
            var passWord = $("#registerPassword").val();
            var mobile = $("#registerMobile").val();
            var zc = "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$";
//            checkCode(mobile, mobileCode, function (status) {
//                if (checkCode === true || checkCode === "true") {
                    if (userName === "" || userName === null) {
                        layer.msg("请输入用户名！");
                    } else if (passWord === "" || passWord === null) {
                        layer.msg("请输入密码！");
                    } else if (passWord.length < 8) {
                        layer.msg("请输入最少8位密码！");
                    } else if (passWord === zc) {
                        layer.msg("请输入最少8位密码！");
                    } else {
                        register(userName, passWord, mobile);
                        document.getElementById("#registerName").value = "";
                        document.getElementById("#registerPassword").value = "";
                        document.getElementById("#registerMobile").value = "";
                    }
//                } else {
//                    alert("注册失败");
//                }
//                if (userName === "" || userName === null) {
//                    layer.msg("请输入用户名！");
//                } else if (passWord === "" || passWord === null) {
//                    layer.msg("请输入密码！");
//                } else {
//                    register(userName, passWord, mobile);
//                    document.getElementById("#registerName").value = "";
//                    document.getElementById("#registerPassword").value = "";
//                    document.getElementById("#registerMobile").value = "";
//                }
//            });
//            if (userName === "" || userName === null) {
//                layer.msg("请输入用户名！");
//            } else if (passWord === "" || passWord === null) {
//                layer.msg("请输入密码！");
//            } else {
//                register(userName, passWord, mobile);
//                document.getElementById("#registerName").value = "";
//                document.getElementById("#registerPassword").value = "";
//                document.getElementById("#registerMobile").value = "";
//            }
        });
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                About();
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
    }
    );
})(window, $, layer, SELF);

