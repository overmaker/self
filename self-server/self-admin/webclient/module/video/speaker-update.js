((window, $, layer, SELF) => {
    SELF.registeredPopup("speaker-update", "module/video/speaker-add.html");
    let [dialog] = [undefined];
    let [addNameTextBox, addIntroductionTextBox] = [undefined, undefined];


    let updateSpeaker = (checked, id) => {
        var obj = {
            "checked":checked,
            "id":id
        };
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    dialog.dialog("close");
                    SELF.publish("load-speaker-upload");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/speaker-recommend`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    }, requestSpeaker = (id) => {
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
            xhr.open("GET", `/admin/speaker-recommend/find/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loaderSpeaker = (id) => {
        requestSpeaker(id).then(result => {
            addNameTextBox.textbox("setValue", result["speaker-name"]);
            addIntroductionTextBox.txt.html(result.reason);
        });
    };

    SELF.subscribe("speaker-update", (id) => {
        let html = SELF.getPopupHtml("speaker-add");
        dialog = $(html).appendTo("body");
        loaderSpeaker(id);
        dialog.dialog({
            title: "修改演讲者信息 ",
            width: 700,
            height: 500,
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


        addNameTextBox = $("#self-module-speaker-add--toolbar-name").textbox({
            label: "姓名：",
            labelWidth: 75,
            width: 500,
            height: 30,
            readonly: true,
            validType: "length[1,45]"
        });
        let wangEditor = window.wangEditor;
        addIntroductionTextBox = new wangEditor("#self-module-speaker-add--toolbar-introduction");
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
        
        const tBtn = $("#self-add-submit").linkbutton({
            text: "通过",
            width: 100
        });
        
        const jBtn = $("#self-add-submit1").linkbutton({
            text: "拒绝",
            width: 100
        });

        tBtn.bind("click", () => {
            updateSpeaker(1, id);
        });
        
        jBtn.bind("click", () => {
            updateSpeaker(0, id);
        });
    });
})(this, $, layer, SELF);

