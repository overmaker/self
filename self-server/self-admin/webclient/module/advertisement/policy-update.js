((window, $, layer, SELF) => {
    SELF.registeredPopup("policy-update", "module/advertisement/policy-update.html");

    let[dialog,
        titleTextBox, contentTextBox,
        okBtn
    ] = [undefined,
        undefined, undefined, 
        undefined];

    const initUI = () => {
        const html = SELF.getPopupHtml("policy-update");
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
        
        titleTextBox = $("#self-text-policy-title").textbox({
            label: "类型：",
            labelWidth: 100,
            width: 500,
            readonly: true
        });
        
        let wangEditor = window.wangEditor;
        contentTextBox = new wangEditor("#self-text-policy-content");
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
        
        okBtn = $("#self-btn-policy-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        titleTextBox.textbox("destroy");
        contentTextBox.txt.clear();
        okBtn.unbind("click");
        dialog.dialog("destroy");

    [dialog,
        titleTextBox, contentTextBox, 
        okBtn
    ] = [undefined,
        undefined, undefined, 
        undefined];
    }, requestPolicy = id => {
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
            xhr.open("GET", `/admin/policy/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadPolicy = id => {
        requestPolicy(id).then(policy => {
            titleTextBox.textbox("setValue", policy.title);
            contentTextBox.txt.html(policy.content);
            
            okBtn.bind("click", () => {
                submitPolicy(id);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updatePolicy = (content, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-policy-update");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/policy/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`content=${content}`);
        });
    }, submitPolicy = (id) => {

        /** 获取参数*/
        const title = titleTextBox.textbox("getValue");
        const content = contentTextBox.txt.html();
        
        updatePolicy(content, id);
    };

    SELF.subscribe("policy-update", id => {
        initUI();
        loadPolicy(id);
    });
})(this, $, layer, SELF);