((window, $, layer, SELF) => {
    SELF.registeredPopup("guest-update", "module/video/guest-add.html");
    let [dialog, guestPhotoFileBox] = [undefined, undefined];
    let guestPhotoPath = undefined;
    let [addNameTextBox, addMobileTextBox, addIntroductionTextBox] = [undefined, undefined, undefined];
    let updateGuest = (name, photo, mobile, introduction, id) => {
        return new window.Promise((resolve, reject) => {
            var obj = {
                "name": name,
                "photo": photo,
                "mobile": mobile,
                "introduction": introduction,
                 "id": id
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
            xhr.open("PUT", `/admin/guest/`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    }, requestGuest = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("GET", `/admin/guest/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loaderGuest = (id) => {
        requestGuest(id).then(result => {
            addNameTextBox.textbox("setValue", result.name);
            addMobileTextBox.textbox("setValue", result.mobile);
            addIntroductionTextBox.txt.html(result.introduction);
            if (result.photo === "undefined") {
                guestPhotoPath = "img/photo.jpg";
                document.getElementById("guest-photo").src = guestPhotoPath;
                guestPhotoFileBox.filebox("setText", "");
            } else {
                guestPhotoPath = result.photo;
                document.getElementById("guest-photo").src = result.photo;
                guestPhotoFileBox.filebox("setText", result.photo);
            }
        });
    };
    SELF.subscribe("guest-update", (id) => {
        let html = SELF.getPopupHtml("guest-add");
        dialog = $(html).appendTo("body");
        loaderGuest(id);
        dialog.dialog({
            title: "修改嘉宾信息 ",
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

            }
        });


        addNameTextBox = $("#self-module-guest-add--toolbar-name").textbox({
            label: "姓名：",
            labelWidth: 75,
            width: 500,
            height: 30,
            validType: "length[1,45]"
        });

        addMobileTextBox = $("#self-module-guest-add--toolbar-mobile").numberbox({
            label: "电话：",
            labelWidth: 75,
            width: 500,
            height: 30,
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
        guestPhotoFileBox = $("#self-module-guest-add--toolbar-photo").filebox({
            width: 300,
            height: 28,
            buttonText: "&nbsp;选择头像&nbsp;"
        });
        $("#selft-guest-photo-submit").linkbutton({
            text: "上传",
            onClick: function () {
                const files = guestPhotoFileBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选头像！");
                    return;
                }
                SELF.fileUpload("video-upload-speaker-update", files[0]).then(filePath => {
                    guestPhotoPath = filePath;
                    guestPhotoFileBox.filebox("setText", guestPhotoPath);
                    document.getElementById("guest-photo").src = guestPhotoPath;
                }, error => {
                    console.log(error);
                });
            }
        });
        const addBtn = $("#self-add-submit").linkbutton({
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
            updateGuest(name, guestPhotoPath, mobile, introduction, id);
        });
    });
})(this, $, layer, SELF);




