((window, $, layer, SELF) => {
    SELF.registeredPopup("knowhow-add", "module/advertisement/knowhow-add.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, typeTextBox, introductionTextBox, dialogBtn] = [undefined, undefined, undefined, undefined];
    
    let [currentId] = [undefined];

    let insertKnowhow = (type, introduction) => {
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
            xhr.open("POST", `/admin/knowhow`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`type=${type}&introduction=${introduction}`);
        });
    }, addKnowhowVerification = (type, introduction) => {
        const [knowhowType, knowhowIntroduction] =
                [type, introduction];
        if (knowhowType === "" || knowhowType === null) {
            layer.msg("请选择类型！");
            return "false";
        }
        
        if (knowhowIntroduction === "" || knowhowIntroduction === null) {
            layer.msg("请输入关于内容！");
            introductionTextBox.textbox({
                required: true
            });
            return "false";
        }
    };


    SELF.subscribe("knowhow-add", () => {
        let html = SELF.getPopupHtml("knowhow-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建",
            width: 700,
            height: 540,
            closed: false,
            cache: false,
            modal: true,
            onClose: function () {
                /* 卸载对话框 */
                if (dialog) {
                    dialog.dialog("destroy");
                }
                dialog = undefined;

                if (dialogBtn) {
                    dialogBtn.unbind("click");
                }
                dialogBtn = undefined;
            }
        });
        
        typeTextBox = $("#self-text-knowhow-type").combobox({
            label: "类型：",
            labelWidth: 100,
            width: 500,
            editable: false,
            valueField: "id",
            textField: "name",
            data: [{id: "演讲",
                    name: "演讲",
                    selected: true
                }, {
                    id: "煮酒论道",
                    name: "煮酒论道"
                }, {
                    id: "深度对话",
                    name: "深度对话"
                }, {
                    id: "微记录",
                    name: "微记录"
                }, {
                    id: "活动",
                    name: "活动"
                }, {
                    id: "self+活动",
                    name: "self+活动"
                }]
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
        
        dialogBtn = $("#self-btn-knowhow-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

        dialogBtn.bind("click", () => {
            
            /** 获取参数*/
            const type = typeTextBox.textbox("getValue");
            const introduction = introductionTextBox.txt.html();
            
            let result = addKnowhowVerification(type, introduction);
            if (result !== "false") {
                insertKnowhow(type, introduction);
            }
        });

    });

})(this, $, layer, SELF);