((window, $, layer, SELF) => {
    SELF.registeredPopup("activity-report-update", "module/activity/activity-report-upload.html");

    let[dialog,
        titleTextBox, timeCalendar, introductionTextBox,
        activityComboBox, content, mediaTextBox,
        thumbnailPath, thumbnailTextBox, thumbnailBtn,
        okBtn
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined];

    const initUI = () => {
        const html = SELF.getPopupHtml("activity-report-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑 ",
            width: 700,
            height: 600,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });

        let buttonsStart = $.extend([], $.fn.datetimebox.defaults.buttons);
        buttonsStart.splice(2, 1, {
            text: "清空",
            handler: target => $("#self-activity-starttime").datetimebox("setValue", "")
        });

        titleTextBox = $("#self-text-activity-report-title").textbox({
            label: "报道标题：",
            labelWidth: 100,
            width: 400
        });

        timeCalendar = $("#self-text-activity-report-report-time").datetimebox({
            label: "报道时间",
            prompt: "必填",
            labelWidth: 100,
            width: 400,
            editable: false,
            showSeconds: true,
            buttons: buttonsStart
        });

        introductionTextBox = $("#self-text-activity-report-introduction").textbox({
            label: "报道介绍：",
            labelWidth: 100,
            width: 400
        });

        activityComboBox = $("#self-text-activity-report-activity").combobox({
            label: "报道的活动",
            labelWidth: 100,
            width: 400,
            editable: false
        });

        mediaTextBox = $("#self-text-activity-report-media").textbox({
            label: "媒体",
            labelWidth: 100,
            width: 400,
            editable: false
        });

        thumbnailTextBox = $("#self-text-activity-report-thumbnail-pic").filebox({
            width: 300,
            buttonText: "&nbsp;选择图片&nbsp;",
            accept: "image/*"
        });

        thumbnailBtn = $("#self-text-activity-report-thumbnail").linkbutton({
            text: "上传",
            width: 45,
            height: 24,
            onClick: function () {
                const files = thumbnailTextBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择图片！");
                    return;
                }
                SELF.fileUpload("activity-report-thumbnail-image", files[0]).then(filePath => {
                    thumbnailPath = filePath;
                    thumbnailTextBox.filebox("setText", thumbnailPath);
                    document.getElementById("activity-report-thumbnail-image").src = thumbnailPath;
                }, error => {
                    console.log(error);
                });
            }
        });

        let wangEditor = window.wangEditor;
        content = new wangEditor("#self-text-activity-report-content");
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

        okBtn = $("#self-btn-activity-report-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        titleTextBox.textbox("destroy");
        timeCalendar.datetimebox("destroy");
        introductionTextBox.textbox("destroy");
        activityComboBox.combobox("destroy");
        content.txt.clear();
        okBtn.unbind("click");
        dialog.dialog("destroy");

        [dialog,
            titleTextBox, timeCalendar, introductionTextBox,
            activityComboBox, content, mediaTextBox,
            thumbnailPath, thumbnailTextBox, thumbnailBtn,
            okBtn
        ] = [undefined,
            undefined, undefined, undefined,
            undefined, undefined, undefined,
            undefined, undefined, undefined,
            undefined];
    }, requestActivityReport = id => {
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
            xhr.open("GET", `/admin/activity-report/find/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadActivityReport = id => {
        requestActivityReport(id).then(report => {
            titleTextBox.textbox("setValue", report.title);
            timeCalendar.textbox("setValue", SELF.datatimeFormatter(report["report-time"]));
            introductionTextBox.textbox("setValue", report.introduction);
            activityComboBox.combobox("setValue", report.activity.id);
            activityComboBox.combobox("setText", report.activity.title);
            content.txt.html(report.content);
            mediaTextBox.textbox("setValue", report.media);
            
            if (report.thumbnail.length > 0) {
                thumbnailPath = report.thumbnail;
                document.getElementById("activity-report-thumbnail-image").src = thumbnailPath;
                thumbnailTextBox.filebox("setText", report.thumbnail);
            }

            okBtn.bind("click", () => {
                submitActivityReport(id);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateActivityReport = (title, time, introduction, activity, content, media, thumbnailPath, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-activity-report-upload");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            
            let obj = {
                "id": id,
                "title": title,
                "report-time": Date.parse(time),
                "media":media,
                "thumbnail":thumbnailPath,
                "introduction": introduction,
                "activity":{
                    "id":activity
                },
                "content": content
            };
            
            xhr.open("PUT", `/admin/activity-report`);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    }, loadActivity = () => {
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
            xhr.open("GET", `/admin/activity?offset=0&count=1000`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, addActivityReportVerification = (title, time, introduction, activity, con, media) => {
        const [titleActivityReport, timeActivityReport, introductionActivityReport, activityActivityReport, contentActivityReport, mediaActivityReport] =
                [title, time, introduction, activity, con, media];
        if (titleActivityReport === "" || titleActivityReport === null) {
            layer.msg("请输入报道标题！");
            return "false";
        }

        if (timeActivityReport === "" || timeActivityReport === null) {
            layer.msg("请选择报道时间");
            return "false";
        }

        if (introductionActivityReport === "" || introductionActivityReport === null) {
            layer.msg("请输入报道介绍！");
            return "false";
        }

        if (activityActivityReport <= 0) {
            layer.msg("请选择活动！");
            return "false";
        }
        if (contentActivityReport === null || introductionActivityReport === "") {
            layer.msg("请输入报道内容！");
            return "false";
        }
        if (mediaActivityReport === null || mediaActivityReport === "") {
            layer.msg("请输入媒体！");
            return "false";
        }
    }, submitActivityReport = (id) => {

        /** 获取参数*/
        const title = titleTextBox.textbox("getValue");
        const time = timeCalendar.datetimebox("getValue");
        const introduction = introductionTextBox.textbox("getValue");
        const activity = activityComboBox.combobox("getValue");
        const con = content.txt.html();
        const media = mediaTextBox.textbox("getValue");

        let result = addActivityReportVerification(title, time, introduction, activity, con, media);
        if (result !== "false") {
            updateActivityReport(title, time, introduction, activity, con, media, thumbnailPath, id);
        }
    };

    SELF.subscribe("activity-report-update", id => {
        initUI();
        window.Promise.all([loadActivity()]).then(list => {
            let typeList = [];
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].v1.length; j++) {
                    let name = list[i].v1[j]["title"];
                    let ids = list[i].v1[j]["id"];
                    if (i === 0) {
                        typeList.push({
                            id: id,
                            text: name,
                            "selected": true
                        });
                    } else {
                        typeList.push({
                            id: id,
                            text: name
                        });
                    }
                }
                activityComboBox.combobox({
                    valueField: "id",
                    textField: "text",
                    data: typeList
                });
            }

            loadActivityReport(id);
        }, error => {
            SELF.errorHandler(error);
        });
    });
})(this, $, layer, SELF);