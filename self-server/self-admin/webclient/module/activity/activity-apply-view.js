((window, $, layer, SELF) => {
    SELF.registeredPopup("activity-apply-view", "module/activity/activity-apply-view.html");

    let [dialog,
        nameTextBox, typeTextBox, contactTextBox,
        telTextBox, emailTextBox, content,
        tokBtn, jokBtn
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined];

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    const initUI = () => {
        const html = SELF.getPopupHtml("activity-apply-view");
        dialog = $(html).appendTo("body").dialog({
            title: "查看详情",
            width: 660,
            height: 500,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });
        let wangEditor = window.wangEditor;
        content = new wangEditor("#self-text-activity-apply-content");
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
        content.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        content.customConfig.uploadFileName = "file";
        content.create();
        nameTextBox = $("#self-text-activity-apply-name").textbox({
            label: "企业名称：",
            labelWidth: 140,
            width: 450,
            readonly: true
        });

        typeTextBox = $("#self-text-activity-apply-responsible").textbox({
            label: "负责人：",
            labelWidth: 140,
            width: 450,
            readonly: true
        });

        contactTextBox = $("#self-text-activity-apply-contact").textbox({
            label: "联系人：",
            width: 450,
            labelWidth: 140,
            readonly: true
        });

        telTextBox = $("#self-text-activity-apply-tel").textbox({
            label: "联系电话：",
            width: 450,
            labelWidth: 140,
            readonly: true
        });

        emailTextBox = $("#self-text-activity-apply-email").textbox({
            label: "联系邮箱：",
            width: 450,
            labelWidth: 140,
            readonly: true
        });

        tokBtn = $("#self-btn-activity-apply-tsubmit").linkbutton({
            text: "通过",
            width: 115,
            height: 30
        });
        
        jokBtn = $("#self-btn-activity-apply-jsubmit").linkbutton({
            text: "不通过",
            width: 115,
            height: 30
        });

    }, destoryUI = () => {
        nameTextBox.textbox("destroy");
        typeTextBox.textbox("destroy");
        contactTextBox.textbox("destroy");
        telTextBox.textbox("destroy");
        emailTextBox.textbox("destroy");
        tokBtn.unbind("click");
        jokBtn.unbind("click");
        dialog.dialog("destroy");
        content.txt.clear();

        [dialog,
        nameTextBox, typeTextBox, contactTextBox,
        telTextBox, emailTextBox, content,
        tokBtn, jokBtn
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined];
    }, requestActivityApply = id => {
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
            xhr.open("GET", `/admin/activity-apply/find/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadActivityApply = id => {
        requestActivityApply(id).then(activityApply => {
            nameTextBox.textbox("setValue", activityApply.name);
            contactTextBox.textbox("setValue", activityApply.contact);
            telTextBox.textbox("setValue", activityApply.tel);
            emailTextBox.textbox("setValue", activityApply.email);
            typeTextBox.textbox("setValue", activityApply.responsible);
            content.txt.html(activityApply.comment);
            content.$textElem.attr("contenteditable", false);
            if (activityApply.activity_plan_file !== null) {
                const qyjs = "合作方案：<a href='"+activityApply.activity_plan_file+"' target='_blank'>合作方案下载</a>";
                $("#activity_plan_file").html(qyjs);
            }

            tokBtn.bind("click", () => {
                updateActivityApply(id, 1);
            });
            
            jokBtn.bind("click", () => {
                updateActivityApply(id, 2);
            });

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateActivityApply = (id, status) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-activity-apply-view");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/activity-apply/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`status=${status}`);
        });
    };

    SELF.subscribe("activity-apply-view", id => {
        initUI();

        loadActivityApply(id);
    });

})(this, $, layer, SELF);