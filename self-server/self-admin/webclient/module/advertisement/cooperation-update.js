((window, $, layer, SELF) => {
    SELF.registeredPopup("cooperation-update", "module/advertisement/cooperation-add.html");

    let[dialog,
        titleTextBox, imageTextBox, introductionTextBox,
        businessLicenseNoTextBox, businessLicensePicTextBox, businessLicensePicBtn,
        imageBtn,
        okBtn
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined,
        undefined];

    let [imagePath, businessLicensePicPath] = [undefined, undefined];

    const initUI = () => {
        const html = SELF.getPopupHtml("cooperation-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑合作机构 ",
            width: 700,
            height: 600,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
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
            height: 24
        });

        businessLicensePicBtn = $("#self-text-cooperation-business-license-picfileimage").linkbutton({
            text: "上传",
            width: 45,
            height: 24
        });

        okBtn = $("#self-btn-cooperation-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        titleTextBox.textbox("destroy");
        businessLicenseNoTextBox.textbox("destroy");
        introductionTextBox.txt.clear();
        imageTextBox.filebox("destroy");
        imageBtn.unbind("click");
        businessLicensePicTextBox.filebox("destroy");
        businessLicensePicBtn.unbind("click");
        okBtn.unbind("click");
        dialog.dialog("destroy");

        [dialog,
            titleTextBox, imageTextBox, introductionTextBox,
            businessLicenseNoTextBox, businessLicensePicTextBox, businessLicensePicBtn,
            imageBtn,
            okBtn
        ] = [undefined,
            undefined, undefined, undefined,
            undefined, undefined, undefined,
            undefined,
            undefined];

        [imagePath, businessLicensePicPath] = [undefined, undefined];
    }, requestCooperation = id => {
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
            xhr.open("GET", `/admin/cooperation/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadCooperation = id => {
        requestCooperation(id).then(cooperation => {
            titleTextBox.textbox("setValue", cooperation.title);
            businessLicenseNoTextBox.textbox("setValue", cooperation["business-license-no"]);
            introductionTextBox.txt.html(cooperation["introduction"]);

            if (cooperation.image.length > 0) {
                imagePath = cooperation.image;
                document.getElementById("cooperation-image-image").src = imagePath;
                imageTextBox.filebox("setText", cooperation.image);
            }
            if (cooperation["business-license-pic"].length > 0) {
                businessLicensePicPath = cooperation["business-license-pic"];
                document.getElementById("cooperation-business-license-pic-image").src = businessLicensePicPath;
                businessLicensePicTextBox.filebox("setText", cooperation["business-license-pic"]);
            }

            okBtn.bind("click", () => {
                submitCooperation(id);
            });

            imageBtn.bind("click", () => {
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
                    SELF.errorHandler(error);
                });
            });

            businessLicensePicBtn.bind("click", () => {
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
                    SELF.errorHandler(error);
                });
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateCooperation = (title, image, businessLicenseNo, businessLicensePic, introduction, id) => {
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
            xhr.open("PUT", `/admin/cooperation`);
            xhr.setRequestHeader("Content-Type", "application/json");
            const obj = {
                "id": id,
                "title": title,
                "image": image,
                "business-license-no": businessLicenseNo,
                "business-license-pic": businessLicensePic,
                "introduction": introduction
            };
            xhr.send(JSON.stringify(obj));
        });
    }, submitCooperation = (id) => {

        if (titleTextBox === "" || titleTextBox === null) {
            layer.msg("请输入合作机构标题！");
            return;
        }

        if (introductionTextBox === "" || introductionTextBox === null) {
            layer.msg("请输入合作机构介绍！");
            return;
        }

        if (introductionTextBox.length >= 500) {
            layer.msg("合作机构介绍过长！");
            return;
        }

        if (imagePath === undefined) {
            layer.msg("没有上传图片");
            return;
        }

        /** 获取参数*/
        const title = titleTextBox.textbox("getValue");
        const businessLicenseNo = businessLicenseNoTextBox.textbox("getValue");
        const introduction = introductionTextBox.txt.html();
        console.log(introduction);
        if (imagePath === undefined) {
            imagePath = "";
        }
        if (businessLicensePicPath === undefined) {
            businessLicensePicPath = "";
        }

        updateCooperation(title, imagePath, businessLicenseNo, businessLicensePicPath, introduction, id);
    };

    SELF.subscribe("cooperation-update", id => {
        initUI();
        loadCooperation(id);
    });
})(this, $, layer, SELF);