((window, $, layer, SELF) => {
    SELF.registeredPopup("video-theme-upload", "module/video/video-theme-upload.html");

    let [dialog, titleTextbox, recommendBtn, thumbnail, thumbnailFilebox, thumbnailUploadBtn, tagAge, okBtn] = [];
    let thumbnailPath = undefined;

    const initUI = () => {
        let html = SELF.getPopupHtml("video-theme-upload");
        dialog = $(html).appendTo("body").dialog({
            title: "新建视频主题",
            width: 600,
            height: 400,
            closed: false,
            maximizable: true,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });

        titleTextbox = $("#self-video-theme-title").textbox({
            label: "主题标题",
            prompt: "请填写视频主题名称，不要超过25字，必填",
            width: "100%",
            labelWidth: 100
        });
        titleTextbox.textbox("textbox").attr("maxlength", 25);

        recommendBtn = $("#self-btn-video-theme-check-recommend").switchbutton({
            handleText: "首页显示",
            handleWidth: 120,
            onText: "是",
            offText: "否",
            width: "100%",
            onChange: function (checked) {
                if (checked) {
                    $("#image").css({"display": ""});
                    $("#age").css({"display": ""});
                    tagAge = $("#self-text-video-theme-age").combobox({
                        label: "视频推荐位置",
                        labelWidth: 200,
                        width: "100%",
                        editable: false,
                        panelHeight: 140,
                        valueField: "id",
                        textField: "name",
                        data: [{id: "1",
                                name: "1"
                            }, {
                                id: "2",
                                name: "2"
                            }, {
                                id: "3",
                                name: "3"
                            }, {
                                id: "4",
                                name: "4",
                                selected: true
                            }, {
                                id: "5",
                                name: "5"
                            }, {
                                id: "6",
                                name: "6"
                            }
                        ]
                    });


                    thumbnail = $("#self-video-theme-thumbnail");
                    thumbnailFilebox = $("#self-video-theme-thumbnail-filebox").filebox({
                        prompt: "先选择图片文件，再点击上传按钮完成上传操作",
                        width: "100%",
                        buttonText: "&nbsp;选择图片文件&nbsp;",
                        accept: "image/*"
                    });
                    thumbnailUploadBtn = $("#self-video-theme-thumbnail-btn").linkbutton({
                        text: "上传",
                        width: "100%"
                    });

                    thumbnailUploadBtn.bind("click", () => {
                        const files = thumbnailFilebox.filebox("files");
                        if (files.length === 0) {
                            layer.msg("请选择缩略图！");
                            return;
                        }
                        if (files[0].size > 5242880) {
                            layer.msg("图片尺寸应小于5M！");
                            return;
                        }
                        if (files[0].name.length >= 20) {
                            layer.msg("图片文件名应小于20字符！");
                            return;
                        }
                        SELF.fileUpload("video-theme-upload-thumbnail", files[0]).then(filePath => {
                            thumbnailPath = filePath;
                            thumbnailFilebox.filebox("setText", thumbnailPath);
                            thumbnail.attr("src", thumbnailPath);
                        }, error => {
                            SELF.errorHandler(error);
                        });
                    });

                } else {
                    $("#image").css({"display": "none"});
                    $("#age").css({"display": "none"});
                }
            }
        });

        okBtn = $("#self-video-theme-ok-btn").linkbutton({
            text: "确定",
            width: "100%"
        });

        okBtn.bind("click", () => {
            /* 输入验证 */
            if (titleTextbox.textbox("getValue").trim() === "") {
                layer.msg("请填写视频主题标题");
                return;
            }
            
            const obj = {
                "name": titleTextbox.textbox("getValue").trim(),
                "thumbnail": thumbnailPath,
                "recommend": recommendBtn.switchbutton("options").checked,
                "order": Number(tagAge.combobox("getValues"))
            };

            uploadVideotheme(obj).then(() => {
                SELF.publish("video-theme-list-refresh");
                dialog.dialog("close");
            }, error => {
                if (error === 409) {
                    layer.msg('视频主题名称已存在！');
                    return;
                } else {
                    SELF.errorHandler(error);
                }
                SELF.publish("video-theme-list-refresh");
                dialog.dialog("close");
            });
        });
    }, destoryUI = () => {
        thumbnailPath = undefined;

        titleTextbox.textbox("destroy");
        thumbnail.attr("src", "");
        thumbnailFilebox.filebox("destroy");
        thumbnailUploadBtn.unbind("click");
        okBtn.unbind("click");
        dialog.dialog("destroy");

    }, uploadVideotheme = obj => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    resolve();
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/video-theme`);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    };

    SELF.subscribe("video-theme-upload", () => {
        initUI();

    });
})(this, $, layer, SELF);