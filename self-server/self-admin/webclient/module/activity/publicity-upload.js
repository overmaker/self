((window, $, layer, SELF) => {
    SELF.registeredPopup("publicity-upload", "module/activity/publicity-upload.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, anameTextBox, timeCalendar, cnameTextBox, content, dialogBtn] = [undefined, undefined, undefined, undefined, undefined, undefined];
    
    let [currentId] = [undefined];

    let insertPublicity = (title,time,introduction,content) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    dialog.dialog("close");
                    SELF.publish("load-publicity-upload");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            
            let obj = {
                "activity-name": title,
                "publish-date": Date.parse(time),
                "cooperation-name": introduction,
                "content": content
            };
            
            xhr.open("POST", `/admin/publicity`);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    }, addPublicityVerification = (title,time,introduction,con) => {
        const [titlePublicity, timePublicity, introductionPublicity, contentPublicity] =
                [title,time,introduction,con];
        if (titlePublicity === "" || titlePublicity === null) {
            layer.msg("请输入活动名称！");
            return "false";
        }
        
        if (timePublicity === "" || timePublicity === null) {
            layer.msg("请选择发布时间");
            return "false";
        }
        
        if (introductionPublicity === "" || introductionPublicity === null) {
            layer.msg("请输入合作机构名称！");
            return "false";
        }
        if (contentPublicity === null || contentPublicity === "") {
            layer.msg("请输入内容！");
            return "false";
        }
        
    };


    SELF.subscribe("publicity-upload", () => {
        let html = SELF.getPopupHtml("publicity-upload");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建",
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
        
        let buttonsStart = $.extend([], $.fn.datetimebox.defaults.buttons);
        buttonsStart.splice(2, 1, {
            text: "清空",
            handler: target => $("#self-activity-starttime").datetimebox("setValue", "")
        });
        
        anameTextBox = $("#self-text-publicity-aname").textbox({
            label: "活动名称：",
            labelWidth: 100,
            width: "100%"
        });
        
        timeCalendar = $("#self-text-publicity-time").datetimebox({
            label: "发布时间：",
            prompt: "必填",
            labelWidth: 100,
            width: "100%",
            editable: false,
            showSeconds: true,
            buttons: buttonsStart
        });
        
        cnameTextBox = $("#self-text-publicity-cname").textbox({
            label: "合作机构名称：",
            labelWidth: 100,
            width: "100%"
        });
        
        let wangEditor = window.wangEditor;
        content = new wangEditor("#self-text-publicity-content");
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
        
        dialogBtn = $("#self-btn-publicity-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

        dialogBtn.bind("click", () => {
            
            /** 获取参数*/
            const title = anameTextBox.textbox("getValue");
            const time = timeCalendar.datetimebox("getValue");
            const introduction = cnameTextBox.textbox("getValue");
            const con = content.txt.html();
            
            let result = addPublicityVerification(title,time,introduction,con);
            if (result !== "false") {
                insertPublicity(title,time,introduction,con);
            }
        });

    });

})(this, $, layer, SELF);