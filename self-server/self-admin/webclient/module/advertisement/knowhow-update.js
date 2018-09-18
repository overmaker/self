((window, $, layer, SELF) => {
    SELF.registeredPopup("knowhow-update", "module/advertisement/knowhow-add.html");

    let[dialog,
        typeTextBox, introductionTextBox,
        okBtn
    ] = [undefined,
        undefined, undefined, 
        undefined];

    const initUI = () => {
        const html = SELF.getPopupHtml("knowhow-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑 ",
            width: 700,
            height: 540,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });
        
        typeTextBox = $("#self-text-knowhow-type").textbox({
            label: "标题：",
            labelWidth: 100,
            width: 500
        });
        
        let wangEditor = window.wangEditor;
        introductionTextBox = new wangEditor("#self-text-knowhow-introduction");
        introductionTextBox.customConfig.menus = [
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
        introductionTextBox.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        introductionTextBox.customConfig.uploadFileName = "file";
        introductionTextBox.create();    
        
        okBtn = $("#self-btn-knowhow-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        typeTextBox.textbox("destroy");
        introductionTextBox.txt.clear();
        okBtn.unbind("click");
        dialog.dialog("destroy");

    [dialog,
        typeTextBox, introductionTextBox, 
        okBtn
    ] = [undefined,
        undefined, undefined, 
        undefined];
    }, requestKnowhow = id => {
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
            xhr.open("GET", `/admin/knowhow/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadKnowhow = id => {
        requestKnowhow(id).then(knowhow => {
            typeTextBox.textbox("setValue", knowhow.type);
            introductionTextBox.txt.html(knowhow["introduction"]);
            
            okBtn.bind("click", () => {
                submitKnowhow(id);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateKnowhow = (type, introduction, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-knowhow-add");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/knowhow/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`type=${type}&introduction=${introduction}`);
        });
    }, submitKnowhow = (id) => {

        /** 获取参数*/
        const type = typeTextBox.textbox("getValue");
        const introduction = introductionTextBox.txt.html();
        
        updateKnowhow(type, introduction, id);
    };

    SELF.subscribe("knowhow-update", id => {
        initUI();
        loadKnowhow(id);
    });
})(this, $, layer, SELF);