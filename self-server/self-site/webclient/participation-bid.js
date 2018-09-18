(function (window, $, layer, SELF) {
    var index = "";
    var wangEditor = window.wangEditor;
    var content = new wangEditor("#apply-reson");
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
    var planFile = undefined, // 活动方案文件
            planPath = undefined;

    var type = 1; // 主办方类型
    var loadApplyflow = function () {
        var xhr = new window.XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation;
        xhr.onloadend = SELF.stopLoadAnimation;
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        str = "";
                for (var i = 0; i < json["v1"].length; i++) {
                    str += "<p><a href='participation-bid-info.html?id=" + json["v1"][i].id + "'>" + json["v1"][i]["activity-name"] + "[" + new Date(json["v1"][i]["publish-date"]).toLocaleString() + "]</a></p>";
                }
//                $("#publicity").html(str);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.open("GET", "/site/publicity?title=&offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadCooperativenorms = function () {
        var xhr = new window.XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation;
        xhr.onloadend = SELF.stopLoadAnimation;
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        content = json["introduction"];
                $("#loadCooperativenorms").html(content);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.open("GET", "/site/about/type");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    },
            loadActivity = function () {
                var xhr = new window.XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation;
                xhr.onloadend = SELF.stopLoadAnimation;
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = window.JSON.parse(xhr.response);
                        processActivity(json);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.open("GET", "/site/activity/finds");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send();
            }, processActivity = function (json) {
        var i = 0,
                str = "";
//        for (; i < json["v1"].length; i++) {
//            str += "<li><a target='_blank' href='" + json["v1"][i]["kepu-activity-url"] + "event/event_detail_" + json["v1"][i].eid + ".html' ><span class='participation-left'><img src='" + json["v1"][i].thumbnail + "' class='tag3-table-img'/></span></a><span class='participation-right'>" + json["v1"][i].introduction + "</span></li>";
//        }
        $("#ul").html(str);
    }

    , uploadApply = function () {
        if (planPath === undefined) {
            layer.msg("还没有上传活动方案文件");
            return;
        }

        var name = $("#cooperation-name").val(),
                contact = $("#cooperation-contact").val(),
                responsible = $("#cooperation-responsible").val(),
                tel = $("#cooperation-tel").val(),
                comment = content.txt.html(),
                mail = $("#cooperation-mail").val();
        if (name.length <= 0) {
            layer.msg("必须填写申请单位名称");
            return;
        }
        if (contact.length <= 0) {
            layer.msg("请填写联系人");
            return;
        }
        if (responsible.length <= 0) {
            layer.msg("请填写单位负责人");
            return;
        }
        if (tel.length <= 0) {
            layer.msg("请填写电话号码");
            return;
        }
        if (mail.length <= 0) {
            layer.msg("请填写邮箱");
            return;
        }
        if (comment.length <= 0) {
            layer.msg("请填写申请理由");
            return;
        }
        if (comment.length >= 300) {
            layer.msg("申请理由太长");
            return;
        }


        var obj = {
            name: name,
            responsible: responsible,
            contact: contact,
            tel: tel,
            comment: comment,
            email: mail
        };
        obj["activity_plan_file"] = planPath;

        SELF.getUser(function (user) {
            if (user === 401) {
                layer.msg("请先登录");
            } else {
                obj["user"] = {
                    id: user["id"]
                };
                var xhr = new window.XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation;
                xhr.onloadend = SELF.stopLoadAnimation;
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        alert("申请成功，待管理员批准");
                        location.reload();
//                        layer.open({
//                            type: 1,
//                            title: false,
//                            closeBtn: false,
//                            area: "300px;",
//                            shade: 0.8,
//                            btn: ["确定"],
//                            moveType: 1,
//                            content: "<div style='padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;'>申请成功，待管理员批准</div>",
//                            yes: function (index, layero) {
//                                layer.closeAll();
//                                location.reload();
//                            }
//                        });
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.open("POST", "/site/activity-apply");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(obj));
            }
        });
    },
            clear = function () {
                $("#cooperation-name").val("");
                $("#cooperation-contact").val("");
                $("#cooperation-responsible").val("");
                $("#cooperation-tel").val("");
                $("#cooperation-mail").val("");
                $("#plan-item-viewer").val("");
                planFile = undefined;
                planPath = undefined;
                content.txt.clear();
            },
            disable = function () {
                $("#cooperation-name").attr("disabled", true);
                $("#cooperation-contact").attr("disabled", true);
                $("#cooperation-responsible").attr("disabled", true);
                $("#cooperation-tel").attr("disabled", true);
                $("#cooperation-mail").attr("disabled", true);
                content.$textElem.attr("contenteditable", false);
                $("#plan-item-selector").addClass("layui-btn-disabled");


                $("#plan-item-upload").addClass("layui-btn-disabled");

                $("#apply-upload").addClass("layui-btn-disabled");
            },
            initUI = function (upload) {

                /* 活动方案文件选择 */
                upload.render({
                    elem: "#plan-item-selector",
                    auto: false,
                    accept: "file",
                    exts: "doc|docx",
                    size: 5120,
                    choose: function (obj) {
                        obj.preview(function (index, file, result) {
                            if (file.name.length > 20) {
                                layer.alert("文件名不能大于20字符", {icon: 2, title: false});
                                return;
                            }
                            $("#plan-item-viewer").val(file.name);
                            planFile = file;
                        });
                    }
                });
                $("#plan-item-upload").click(function () {
                    if (planFile === undefined) {
                        layer.alert("没有选择活动方案文件");
                        return;
                    }
                    SELF.fileUpload("cooperation-upload", planFile, function (url) {
                        $("#plan-item-viewer").val(url);
                        planPath = url;
                        if (planPath.length > 20) {
                            alert("文件上传成功");
                            return;
                        }
                    });
                });

                $("#apply-upload").click(function () {
                    uploadApply();
                });
            };
    /*        self+活动回顾*/
    requestSelfPast = function (title) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                loadSelfPast(json);
//                callback(json);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        var query = "/site/activity/pastSelf";
        xhr.open("PUT", query);
        let objPrams = {
            "title": title
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, loadSelfPast = function (json) {
        var i3 = 0,
                tr = "",
                activityTitle = "";
        outer:
                for (; i3 < Math.ceil(json["v1"].length / 1); i3++) {
            tr += "<tr>";
            for (var j3 = 0; j3 < 3; j3++) {
                if (json["v1"][i3 * 3 + j3] === undefined) {
                    switch (j3) {
                        case 1:
                            tr += "<td></td><td></td><td></td>";
                            break outer;
                        case 2:
                            tr += "<td></td><td></td>";
                            break outer;
                        default :
                            tr += "<td></td>";
                            break outer;
                    }
                } else {

                    if (json["v1"][i3 * 3 + j3].title.length > 23) {
                        activityTitle = json["v1"][i3 * 3 + j3].title.substring(0, 27) + "...";
                    } else {
                        activityTitle = json["v1"][i3 * 3 + j3].title;
                    }
                    tr += "<td><a href='../../module/activity/site-activity-detail.html?id=" + json["v1"][i3 * 3 + j3].id + "'><image src='" + json["v1"][i3 * 3 + j3].thumbnail + "'  class='activity-image'/><p  class='p-activity-p'><strong>&nbsp;" + activityTitle + "</p></div></p></a><br /><br /></td>";
                }
            }
            tr += "</tr>";

        }
        $("#table").html(tr);
    }, searchByTitle = function () {
        $("#title-searchbox").click(function () {
            var title = $("#title-searchtext").val();
            requestSelfPast(title);
        });
    };
    $(document).ready(function () {
        requestSelfPast("");
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                Participation();
            };
            head.appendChild(script);
            $("#a ").css("color", "#FF920B");
            $("#a").click(function () {
                $("#c").css("color", "gray");
                $("#b").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
            $("#b").click(function () {
                SELF.getUser(function (user) {
                    if (user === 401) {
                        var index = layer.open({
                            title: '登陆',
                            type: 2,
                            area: ["1000px", "720px"],
                            content: "/login/login.html?redirect_url=/participation-bid.html"
                        });
                    } else {
                        $("#c").css("color", "gray");
                        $("#a").css("color", "gray");
                        $(this).css("color", "#FF920B");
                        layui.use('layer', function () {
                            var layer = layui.layer;
                            var index = layer.open({
                                type: 1,
                                content: $('#con'),
                                title: '我要申请',
                                area: ['auto', '700px']
                            });
                        });
                    }
                });
            });
            $("#c").click(function () {
                $("#a").css("color", "gray");
                $("#b").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
            loadApplyflow();
//            loadActivity();
            loadCooperativenorms();
            searchByTitle();
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

    layui.use(["element", "form", "upload"], function () {
        var element = layui.element,
                form = layui.form,
                upload = layui.upload;
        form.render();


        SELF.getUser(function (user) {

            initUI(upload);

        });
    });
})(window, $, layer, SELF);
