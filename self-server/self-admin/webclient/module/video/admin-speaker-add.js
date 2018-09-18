((window, $, layer, SELF) => {
    SELF.registeredPopup("admin-speaker-add", "module/video/admin-speaker-add.html");
    let [dialog, speakerPhotoFileBox, speakerImageFileBox, addBtn] = [];
    let [speakerPhotoPath, imagePath] = [];
    let [addNameTextBox, addMobileTextBox, addIntroductionTextBox] = [];


    let insertSpeaker = (name, photo, mobile, image, introduction, enable) => {
        return new window.Promise((resolve, reject) => {
            var obj = {
                "name": name,
                "photo": photo,
                "image": image,
                "mobile": mobile,
                "introduction": introduction
            };
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-speaker-upload");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/speaker/admin`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    };

    SELF.subscribe("admin-speaker-add", () => {
        let html = SELF.getPopupHtml("admin-speaker-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建演讲者 ",
            closed: false,
            cache: false,
            modal: true,
            minimizable: false,
            maximizable: false,
            resizable: false,
            maximized: true,
            onClose: function () {
                /* 卸载对话框 */
                speakerPhotoPath = undefined;
                imagePath = undefined;
                addNameTextBox.textbox("destroy");
                addMobileTextBox.textbox("destroy");
                
                speakerPhotoFileBox.filebox("destroy");
                speakerImageFileBox.filebox("destroy");
                
                if (addBtn) {
                    addBtn.unbind("click");
                }
                addBtn = undefined;
                
                if (dialog) {
                    dialog.dialog("destroy");
                }
                dialog = undefined;
            }
        });


        addNameTextBox = $("#self-module-admin-speaker-add--toolbar-name").textbox({
            label: "姓名：",
            labelWidth: 100,
            width: "100%",
            height: 38
        });
        addNameTextBox.textbox("textbox").attr("maxlength", 20);

        addMobileTextBox = $("#self-module-admin-speaker-add--toolbar-mobile").textbox({
            label: "电话：",
            labelWidth: 100,
            width: "100%",
            height: 38
        });
        addMobileTextBox.textbox("textbox")
                .attr("maxlength", 20)
                .css("ime-mode", "disabled")
                .keydown(event => event.keyCode === 8 // 退格
                            || event.keyCode === 37 // 左
                            || event.keyCode === 39 // 右
                            || (event.shiftKey && event.keyCode === 187) // 大键盘+
                            || (!event.shiftKey && event.keyCode === 189) // 大键盘-
                            || event.keyCode === 107 // 小键盘+
                            || event.keyCode === 109 // 小键盘-
                            || (!event.shiftKey && event.keyCode >= 48 && event.keyCode <= 57) // 大键盘数字0~9
                            || (event.keyCode >= 96 && event.keyCode <= 105)) // 小键盘数字0~9
                .bind("cut copy paste", event => event.preventDefault()); // 禁用剪切、复制、粘贴

        let wangEditor = window.wangEditor;
        addIntroductionTextBox = new wangEditor("#self-module-admin-speaker-add--toolbar-introduction");
        addIntroductionTextBox.customConfig.menus = [
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
        addIntroductionTextBox.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        addIntroductionTextBox.customConfig.uploadFileName = "file";
        addIntroductionTextBox.create();

        speakerPhotoFileBox = $("#self-module-admin-speaker-add--toolbar-photo").filebox({
            width: "100%",
            height: 38,
            buttonText: "&nbsp;选择头像&nbsp;"
        });

        $("#selft-admin-speaker-photo-submit").linkbutton({
            width: 100,
            height: 38,
            text: "上传",
            onClick: function () {
                const files = speakerPhotoFileBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选头像！");
                    return;
                }
                SELF.fileUpload("video-upload-speaker-update", files[0]).then(filePath => {
                    speakerPhotoPath = filePath;
                    speakerPhotoFileBox.filebox("setText", speakerPhotoPath);
                    document.getElementById("admin-speaker-photo").src = speakerPhotoPath;
                }, error => {
                    console.log(error);
                });
            }
        });
        
        speakerImageFileBox = $("#self-text-admin-speaker-image-pic").filebox({
            width: "100%",
            height: 38,
            buttonText: "&nbsp;选择照片&nbsp;"
        });

        $("#self-text-admin-speaker-image").linkbutton({
            width: 100,
            height: 38,
            text: "上传",
            onClick: function () {
                const files = speakerImageFileBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("选择照片！");
                    return;
                }
                SELF.fileUpload("video-upload-speaker-update", files[0]).then(filePath => {
                    imagePath = filePath;
                    speakerImageFileBox.filebox("setText", imagePath);
                    document.getElementById("admin-speaker-image-image").src = imagePath;
                }, error => {
                    console.log(error);
                });
            }
        });
        addBtn = $("#self-admin-add-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 38
        });

        addBtn.bind("click", () => {
            const name = addNameTextBox.textbox("getValue").trim();
            const mobile = addMobileTextBox.textbox("getValue").trim();
            const introduction = addIntroductionTextBox.txt.html();
            if (name  === "") {
                layer.msg("演讲者姓名不能为空！");
                return;
            }
            
            if (mobile === "") {
                layer.msg("演讲者电话不能为空！");
                return;
            }
            
            if (speakerPhotoPath === undefined) {
                layer.msg("演讲者头像不能为空！");
                return;
            }
            
            if (imagePath === undefined) {
                layer.msg("演讲者照片不能为空！");
                return;
            }
            insertSpeaker(name, speakerPhotoPath, mobile, imagePath, introduction);
        });
    });
})(this, $, layer, SELF);

