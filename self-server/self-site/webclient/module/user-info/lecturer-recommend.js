(function (window, $, layer, SELF) {

    var wangEditor = window.wangEditor;
    var content = new wangEditor("#speaker-intro");
    content.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "image", // 插入图片
        "table", // 表格
        "undo", // 撤销
        "redo"  // 重复
    ];
    content.customConfig.uploadImgServer = "/site/wang-editor/wang-editor-upload";
    content.customConfig.uploadFileName = "file";
    content.create();

    var submit = function (name, mobile, unit, intro, user) {
        var obj = {
            "speaker-name": name,
            "mobile": mobile,
            "unit": unit,
            "references": user,
            "reason": intro
        };
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 204) {
                alert("提交成功，待管理员审核");
//                layer.msg("提交成功，待管理员审核");
                clear();
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/speaker-recommend/");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(obj));
    }, clear = function () {
        $("#speaker-name").val("");
        $("#speaker-mobile").val("");
        $("#speaker-unit").val("");
        content.txt.clear();
    }, disable = function () {
        $("#speaker-name").attr("disabled", true);
        $("#speaker-mobile").attr("disabled", true);
        $("#speaker-unit").attr("disabled", true);
        content.$textElem.attr("contenteditable", false);
        $("#speaker-submit").addClass("layui-btn-disabled");
    };
    SELF.getUser(function (user) {
        if (user === 401) {
            var index = layer.open({
                title: '登陆',
                type: 2,
                area: ["1200px", "600px"],
                fixed: false,
                content: "/login/login.html?redirect_url=/module/user-info/lecturer-reconmmend.html?id="
            });
            disable();
        } else {
            $("#speaker-submit").click(function () {
                var intro = content.txt.html(),
                        name = $("#speaker-name").val(),
                        mobile = $("#speaker-mobile").val(),
                        unit = $("#speaker-unit").val();
                if (intro.length < 0) {
                    layer.msg("自我介绍的内容过少");
                    return;
                }
                
                if (name.length < 0) {
                    layer.msg("姓名不能为空");
                    return;
                }
                
                if (mobile.length < 0) {
                    layer.msg("手机号不能为空");
                    return;
                }
                
                if (unit.length < 0) {
                    layer.msg("单位不能为空");
                    return;
                }
                
                SELF.getUser(function (user) {
                    if (user === 401) {
                        layer.msg("请先登录");
                    } else {
                        submit(name, mobile, unit, intro, user.id);
                    }
                });
            });
        }
    });
    $(document).ready(function () {
        $("#top").load("/top.html", function () {

            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            head.appendChild(script);
            $("#a").click(function () {
                $(this).css("color", "#FF920B");
            });
            $("#b").click(function () {
                $(this).css("color", "#FF920B");
            });
            $("#c").click(function () {
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
    });
})(window, $, layer, SELF);
