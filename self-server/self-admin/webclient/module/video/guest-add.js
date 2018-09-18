((window, $, layer, SELF) => {
    SELF.registeredPopup("guest-add", "module/video/guest-add.html");
    let [dialog, imageTextBox, addBtn] = [undefined, undefined, undefined];
    let [guestPhotoPath] = [undefined];
    let [addNameTextBox, addMobileTextBox, addIntroductionTextBox] = [undefined, undefined, undefined, undefined];
    let insertGuest = (name, photo, mobile, introduction) => {
        return new window.Promise((resolve, reject) => {
            var obj = {
                "name": name,
                "photo": photo,
                "mobile": mobile,
                "introduction": introduction,
            };
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-guest-upload");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/guest`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    };
    SELF.subscribe("guest-add", () => {
        let html = SELF.getPopupHtml("guest-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建嘉宾 ",
            width: 720,
            height: 760,
            closed: false,
            cache: false,
            modal: true,
            onClose: function () {
                /* 卸载对话框 */
                if (dialog) {
                    dialog.dialog("destroy");
                }
                dialog = undefined;

                if (addBtn) {
                    addBtn.unbind("click");
                }
                addBtn = undefined;
            }
        });


        addNameTextBox = $("#self-module-guest-add--toolbar-name").textbox({
            label: "姓名：",
            labelWidth: 75,
            width: 500,
            height: 25,
            validType: "length[1,45]"
        });

        addMobileTextBox = $("#self-module-guest-add--toolbar-mobile").numberbox({
            label: "电话：",
            labelWidth: 75,
            width: 500,
            height: 25,
            validType: "length[1,11]"
        });

        let wangEditor = window.wangEditor;
        addIntroductionTextBox = new wangEditor("#self-module-guest-add--toolbar-introduction");
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

        imageTextBox = $("#self-module-guest-add--toolbar-photo").filebox({
            width: 300,
            buttonText: "&nbsp;选择图片&nbsp;",
            accept: "image/*"
        });
        $("#selft-guest-photo-submit").linkbutton({
            text: "上传",
            onClick: function () {
                const files = imageTextBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选头像！");
                    return;
                }
                SELF.fileUpload("video-upload-guest-update", files[0]).then(filePath => {
                    guestPhotoPath = filePath;
                    imageTextBox.filebox("setText", guestPhotoPath);
                    document.getElementById("guest-photo").src = guestPhotoPath;
                }, error => {
                    console.log(error);
                });
            }
        });
        addBtn = $("#self-add-submit").linkbutton({
            text: "确定",
            width: 100
        });
        addBtn.bind("click", () => {
            const name = addNameTextBox.textbox("getValue");
            const mobile = addMobileTextBox.numberbox("getValue");
            const introduction = addIntroductionTextBox.txt.html();
            if (name.length <= 0) {
                layer.msg("嘉宾姓名不能为空！");
                addNameTextBox.textbox({
                    required: true
                });
                return;
            }
            if (guestPhotoPath === undefined) {
                guestPhotoPath = "";
            }
            insertGuest(name, guestPhotoPath, mobile, introduction);
        });

    });
})(this, $, layer, SELF);
