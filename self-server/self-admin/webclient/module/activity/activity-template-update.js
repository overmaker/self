((window, $, layer, SELF) => {
    SELF.registeredPopup("activity-template-update", "module/activity/activity-template-update.html");

    let[dialog,
        nameTextBox, contentTextBox,
        okBtn
    ] = [undefined,
        undefined, undefined,
        undefined];

    const initUI = () => {
        const html = SELF.getPopupHtml("activity-template-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑 ",
            width: 700,
            height: 500,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });

        nameTextBox = $("#self-text-activity-template-name").textbox({
            label: "问题：",
            labelWidth: 100,
            width: 500,
            readonly: true
        });

        let wangEditor = window.wangEditor;
        contentTextBox = new wangEditor("#self-text-activity-template-content");
        contentTextBox.customConfig.menus = [
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
        contentTextBox.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        contentTextBox.customConfig.uploadFileName = "file";
        contentTextBox.create();

        okBtn = $("#self-btn-activity-template-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        nameTextBox.textbox("destroy");
        contentTextBox.txt.clear();
        okBtn.unbind("click");
        dialog.dialog("destroy");

        [dialog,
            nameTextBox, contentTextBox,
            okBtn
        ] = [undefined,
            undefined, undefined,
            undefined];
    }, requestactivityTemplate  = id => {
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
            xhr.open("GET", `/admin/activity-template/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadactivityTemplate = id => {
        requestactivityTemplate(id).then(activityTemplate => {
            nameTextBox.textbox("setValue", activityTemplate.name);
            contentTextBox.txt.html(activityTemplate["content"]);

            okBtn.bind("click", () => {
                submitactivityTemplate(id);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateactivityTemplate = (name, content, id) => {
//        loadactivityTemplate(id);
        var obj = {
            "id": id,
            "name": name,
            "content": content
        };
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                     SELF.publish("load-activity-template-update");
                } else if (xhr.status === 409) {
                    layer.msg('活动类型已存在！');
                } else if (xhr.status === 400) {
                    layer.msg('请输入类型名称！');
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/activity-template`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    }, submitactivityTemplate = (id) => {

        /** 获取参数*/
        const name = nameTextBox.textbox("getValue");
        const content = contentTextBox.txt.html();

        updateactivityTemplate(name, content, id);
    };

    SELF.subscribe("activity-template-update", id => {
        initUI();
        loadactivityTemplate(id);
    });
})(this, $, layer, SELF);
