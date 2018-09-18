(function (window, $, layui, layer, SELF) {
    var photoFile = undefined, // 活动方案文件
            photoPath = undefined;
    initUI = function (upload) {

        /* 头像文件选择 */
        upload.render({
            elem: "#plan-item-selector",
            auto: false,
            accept: "images",
            exts: "jpg|png|gif",
            size: 5120,
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    if (file.name.length > 20) {
                        layer.alert("文件名不能大于20字符", {icon: 2, title: false});
                        return;
                    }
                    $("#plan-item-viewer").val(file.name);
                    photoFile = file;
                });
            }
        });
        $("#plan-item-upload").click(function () {
            if (photoFile === undefined) {
                layer.msg("没有选择图片文件");
                return;
            }
            SELF.fileUpload("user-upload", photoFile, function (url) {
                $("#plan-item-viewer").val(url);
                photoPath = url;
            });
        });
    },
            /* 用户信息 */
            loadUserInfo = function () {
                SELF.getUser(function (user) {
                    if (typeof user === "object") {
                        SELF.getUserInfo(user["id"], function (userInfo) {
                            var nName = userInfo["nick-name"],
                                    myname = userInfo["name"],
                                    mymobile = userInfo["mobile"],
                                    myemail = userInfo["email"],
                                    mygender = userInfo["gender"],
                                    myaddress = userInfo["address"],
                                    myborn = userInfo["birth-date"];
                            if (nName !== null || nName !== "") {
                                $("#nickName").attr("value", nName);
                            }
                            if (myname !== null || myname !== "") {
                                $("#name").attr("value", myname);
                            }
                            if (mymobile !== null || mymobile !== "") {
                                $("#mobile").attr("value", mymobile);
                            }
                            if (myemail !== null || myemail !== "") {
                                $("#email").attr("value", myemail);
                            }
                            if (myaddress !== null || myaddress !== "") {
//                                $("#address").attr("value", myaddress);
                                $("#address").val(myaddress);
                            }
                            if (mygender === true) {
                                $("input[type='radio'][value='1']").attr("checked", true);
                            } else {
                                $("input[type='radio'][value='0']").attr("checked", true);
                            }
                            if (myborn !== null || myborn !== "") {
                                var now = new Date(myborn);
//格式化日，如果小于9，前面补0
                                var day = ("0" + now.getDate()).slice(-2);
//格式化月，如果小于9，前面补0
                                var month = ("0" + (now.getMonth() + 1)).slice(-2);
//拼装完整日期格式
                                var today = now.getFullYear() + "-" + (month) + "-" + (day);
//完成赋值
                                $('#born').val(today)
                            }
                        });
                    }
                });
            }, submit = function (uid, name, gender, photo, birthDate, nickName, mobile, email, address) {
        SELF.getUser(function (user) {
            var radionum = document.getElementById("gender").sex;
            for (var i = 0; i < radionum.length; i++) {
                if (radionum[i].checked) {
                    gender = radionum[i].value
                }
            }
            ;
            var uid = user["id"],
                    name = $("#name").val(),
                    gender1 = parseInt(gender),
                    photo = photoPath,
                    birthDate = $("#born").val(),
                    nickName = $("#nickName").val(),
                    mobile = $("#mobile").val(),
                    email = $("#email").val(),
                    address = $("#address").val()
            if (mobile.length > 13) {
                alert("手机号长度超出限制，请重新填写");
                return;
            }
            var obj = {
                "id": uid,
                "name": name,
                "gender": gender1,
                "photo": photo,
                "birth-date": birthDate,
                "nick-name": nickName,
                "mobile": mobile,
                "email": email,
                "address": address

            };
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onload = function () {
                if (xhr.status === 204) {
                    alert("修改成功");
                    window.location.href = "/module/user-info/personal-center.html";
                } else {
                    SELF.errorHandler(xhr.status);
                }
            };
            xhr.onerror = function () {
                SELF.errorHandler("error");
            };
            xhr.open("POST", "/site/user-info");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    };
    $(document).ready(function () {
        loadUserInfo();
        layui.use(["element", "form", "upload"], function () {
            var element = layui.element,
                    form = layui.form,
                    upload = layui.upload;
            form.render();
            initUI(upload);
        });
        $("#submit").click(function () {
            submit();
        })
        $("#top").load("/top.html", function () {

            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
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
    });
})(window, $, layui, layer, SELF);
