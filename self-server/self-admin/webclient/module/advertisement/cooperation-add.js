((window, $, layer, SELF) => {
    SELF.registeredPopup("cooperation-add", "module/advertisement/cooperation-add.html");

    let [dialog, titleTextBox, introductionTextBox, businessLicenseNoTextBox, businessLicensePicTextBox, businessLicensePicBtn, dialogBtn, imageTextBox, imageBtn] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    
    let [imagePath, businessLicensePicPath, currentId] = [undefined, undefined, undefined];

    let insertCooperation = (title, image, businessLicenseNo, businessLicensePic, introduction) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-cooperation-add");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/cooperation`);
            xhr.setRequestHeader("Content-Type", "application/json");
            const obj = {
                "title": title,
                "image": image,
                "business-license-no": businessLicenseNo,
                "business-license-pic": businessLicensePic,
                "introduction": introduction
            };
            xhr.send(JSON.stringify(obj));
        });
    }, addCooperationVerification = (title, image, businessLicenseNo, businessLicensePic, introduction) => {
        
        if (title === "" || title === null) {
            layer.msg("请输入合作机构标题！");
            titleTextBox.textbox({
                required: true
            });
            return "false";
        }
        
        if (image === "" || image === null) {
            layer.msg("请添加图片！");
            return "false";
        }
        
        if (businessLicenseNo === "" || businessLicenseNo === null) {
            layer.msg("请输入组织机构代码证编号！");
            businessLicenseNoTextBox.textbox({
                required: true
            });
            return "false";
        }
        
        if (businessLicensePic === "" || businessLicensePic === null) {
            layer.msg("请添加图片！");
            return "false";
        }
        
        if (introduction === "" || introduction === null) {
            layer.msg("请输入合作机构介绍！");
            return "false";
        }
        
        if (introduction.length >= 500) {
            layer.msg("合作机构介绍过长！");
            return "false";
        }

    };


    SELF.subscribe("cooperation-add", () => {
        let html = SELF.getPopupHtml("cooperation-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建合作机构",
            width: 700,
            height: 600,
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
        
        titleTextBox = $("#self-text-cooperation-title").textbox({
            label: "合作机构标题：",
            labelWidth: 140,
            width: 450
        });
        titleTextBox.textbox("textbox").attr("maxlength", 100);  
        
        imageTextBox = $("#self-text-cooperation-image").filebox({
            width: 300,
            buttonText: "&nbsp;选择图片&nbsp;",
            accept: "image/*"
        });
        
        businessLicenseNoTextBox = $("#self-text-cooperation-business-license-no").textbox({
            label: "组织机构代码证编号：",
            labelWidth: 140,
            width: 450
        });
        businessLicenseNoTextBox.textbox("textbox").attr("maxlength", 100); 
        
        businessLicensePicTextBox = $("#self-text-cooperation-business-license-pic").filebox({
            width: 300,
            buttonText: "&nbsp;选择图片&nbsp;",
            accept: "image/*"
        });
        
        let wangEditor = window.wangEditor;
        introductionTextBox = new wangEditor("#self-text-cooperation-introduction");
        introductionTextBox.customConfig.menus = [
            "head", // 标题
            "bold", // 粗体
            "fontSize", // 字号
            "fontName", // 字体
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
        introductionTextBox.customConfig.fontNames = [
            "宋体",
            "微软雅黑",
            "Arial"
        ];
        introductionTextBox.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        introductionTextBox.customConfig.uploadFileName = "file";
        introductionTextBox.create();   
        
        imageBtn = $("#self-text-cooperation-fileimage").linkbutton({
            text: "上传",
            width: 45,
            height: 24,
            onClick: function () {
                const files = imageTextBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择图片！");
                    return;
                }
                SELF.fileUpload("cooperation-add-image", files[0]).then(filePath => {
                    imagePath = filePath;
                    imageTextBox.filebox("setText", imagePath);
                    document.getElementById("cooperation-image-image").src = imagePath;
                }, error => {
                    console.log(error);
                });
            }
        });
        
        businessLicensePicBtn = $("#self-text-cooperation-business-license-picfileimage").linkbutton({
            text: "上传",
            width: 45,
            height: 24,
            onClick: function () {
                const files1 = businessLicensePicTextBox.filebox("files");
                if (files1.length === 0) {
                    layer.msg("请选择图片！");
                    return;
                }
                SELF.fileUpload("cooperation-add-image", files1[0]).then(filePath => {
                    businessLicensePicPath = filePath;
                    businessLicensePicTextBox.filebox("setText", businessLicensePicPath);
                    document.getElementById("cooperation-business-license-pic-image").src = businessLicensePicPath;
                }, error => {
                    console.log(error);
                });
            }
        });
        
        dialogBtn = $("#self-btn-cooperation-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

        dialogBtn.bind("click", () => {
            
            /** 获取参数*/
            const title = titleTextBox.textbox("getValue");
            const businessLicenseNo = businessLicenseNoTextBox.textbox("getValue");
            const introduction = introductionTextBox.txt.html();
            if (imagePath === undefined) {
                imagePath = "";
            }
            if (businessLicensePicPath === undefined) {
                businessLicensePicPath = "";
            }
            
            let result = addCooperationVerification(title, imagePath, businessLicenseNo, businessLicensePicPath, introduction);
            if (result !== "false") {
                insertCooperation(title, imagePath, businessLicenseNo, businessLicensePicPath, introduction);
            }
        });

    });

})(this, $, layer, SELF);