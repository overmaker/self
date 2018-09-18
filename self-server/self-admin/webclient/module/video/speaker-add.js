((window, $, layer, SELF) => {
    SELF.registeredPopup("speaker-add", "module/video/speaker-add.html");
    let [dialog, speakerPhotoFileBox, speakerIdentificationPicFilebox, speakerQualificationPicFilebox, addBtn] = [undefined, undefined, undefined, undefined, undefined];
    let [speakerPhotoPath, speakerIdentificationPicPath, speakerQualificationPicPath] = [undefined, undefined, undefined];
    let [addNameTextBox, addMobileTextBox, addIdentificationTextBox, addFieldTagBox, addIntroductionTextBox, educationalCombobox] = [undefined, undefined, undefined, undefined, undefined, undefined];


    let insertSpeaker = (name, photo, mobile, educational, field, introduction, enable, identificationPic, qualificationPic) => {
        return new window.Promise((resolve, reject) => {
            var obj = {
                "name": name,
                "photo": photo,
                "mobile": mobile,
                "educational": educational,
                "field": field,
                "introduction": introduction,
                "enable": enable,
                "identificationPic": identificationPic,
                "qualificationPic": qualificationPic
            };
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-speaker-upload");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/speaker`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    };

    SELF.subscribe("speaker-add", () => {
        let html = SELF.getPopupHtml("speaker-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建演讲者 ",
            width: 700,
            height: 780,
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


        addNameTextBox = $("#self-module-speaker-add--toolbar-name").textbox({
            label: "姓名：",
            labelWidth: 75,
            width: 500,
            height: 25,
            validType: "length[1,45]"
        });

        addMobileTextBox = $("#self-module-speaker-add--toolbar-mobile").numberbox({
            label: "电话：",
            labelWidth: 75,
            width: 500,
            height: 25,
            validType: "length[1,11]"
        });
//        addIdentificationTextBox = $("#self-module-speaker-add--toolbar-identification").textbox({
//            label: "身份证号：",
//            labelWidth: 120,
//            width: 500,
//            height: 25,
//            validType: "length[18,18]"
//        });
        addFieldTagBox = $("#self-module-speaker-add--toolbar-field").tagbox({
            label: '领域：',
            labelWidth: 75,
            width: 426
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

        speakerPhotoFileBox = $("#self-module-speaker-add--toolbar-photo").filebox({
            width: 300,
            height: 28,
            buttonText: "&nbsp;选择头像&nbsp;"
        });
        speakerIdentificationPicFilebox = $("#self-module-speaker-add--toolbar-identification_pic").filebox({
            width: 212,
            height: 25,
            buttonText: "&nbsp;选择海报图片&nbsp;"
        });

        speakerQualificationPicFilebox = $("#self-module-speaker-add--toolbar-qualification_pic").filebox({
            width: 212,
            height: 25,
            buttonText: "选择证书"
        });

        $("#selft-speaker-photo-submit").linkbutton({
            text: "上传",
            onClick: function () {
                const files = speakerPhotoFileBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选头像！");
                    return;
                }
                SELF.fileUpload("video-upload-speaker-update", files[0]).then(filePath => {
                    speakerPhotoPath = filePath;
                    speakerPhotoFileBox.filebox("setText", speakerPhotoPath);
                    document.getElementById("speaker-photo").src = speakerPhotoPath;
                }, error => {
                    console.log(error);
                });
            }
        });
        $("#selft-speaker-identification_pic-submit").linkbutton({
            text: "上传",
            onClick: function () {
                const files = speakerIdentificationPicFilebox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择身份证图片！");
                    return;
                }
                SELF.fileUpload("video-upload-speaker-update", files[0]).then(filePath => {
                    speakerIdentificationPicPath = filePath;
                    speakerIdentificationPicFilebox.filebox("setText", speakerIdentificationPicPath);
                    document.getElementById("speaker-identification").src = speakerIdentificationPicPath;
                }, error => {
                    console.log(error);
                });
            }

        });
        $("#selft-speaker-qualification_pic-submit").linkbutton({
            text: "上传",
            onClick: function () {
                const files = speakerQualificationPicFilebox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择证书图片！");
                    return;
                }
                SELF.fileUpload("video-upload-speaker-update", files[0]).then(filePath => {
                    speakerQualificationPicPath = filePath;
                    speakerQualificationPicFilebox.filebox("setText", speakerQualificationPicPath);
                    document.getElementById("speaker-qualification").src = speakerQualificationPicPath;
                }, error => {
                    console.log(error);
                });
            }

        });
        addBtn = $("#self-add-submit").linkbutton({
            text: "确定",
            width: 100
        });
        educationalCombobox = $("#self-module-speaker-add--toolbar-educational").combobox({
            label: "学历：",
            labelWidth: 75,
            width: 500,
            editable: false,
            valueField: "id",
            textField: "text",
            data: [{
                    "id": 1,
                    "text": "小学"
                }, {
                    "id": 2,
                    "text": "初中"
                }, {
                    "id": 3,
                    "text": "高中"
                }, {
                    "id": 4,
                    "text": "中专"
                }, {
                    "id": 5,
                    "text": "大专"
                }, {
                    "id": 6,
                    "text": "本科"
                }, {
                    "id": 7,
                    "text": "研究生"
                }]
        });

        addBtn.bind("click", () => {
            let field = "";
            const fieldArray = addFieldTagBox.tagbox("getValues");
            const name = addNameTextBox.textbox("getValue");
            const mobile = addMobileTextBox.numberbox("getValue");
//            const identification = addIdentificationTextBox.textbox("getValue");
            const introduction = addIntroductionTextBox.txt.html();
            let enable = document.getElementById("self-module-speaker-add--toolbar-is_enable").checked;
            const  educational = educationalCombobox.combobox("getText");
            if (name.length <= 0) {
                layer.msg("演讲者姓名不能为空！");
                addNameTextBox.textbox({
                    required: true
                });
                return;
            }
            let count = 0;
            for (let i = 0; i < fieldArray.length; i++) {
                count++;
                if (count === fieldArray.length) {
                    field += fieldArray[i];
                } else {
                    field += fieldArray[i] + ",";
                }
            }
            if (speakerPhotoPath === undefined) {
                speakerPhotoPath = "";
            }
            if (speakerIdentificationPicPath === undefined) {
                speakerIdentificationPicPath = "";
            }
            if (speakerQualificationPicPath === undefined) {
                speakerQualificationPicPath = "";
            }
            insertSpeaker(name, speakerPhotoPath, mobile, educational, field, introduction, enable, speakerIdentificationPicPath, speakerQualificationPicPath);
        });
    });
})(this, $, layer, SELF);

