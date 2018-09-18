((window, $, layer, SELF) => {
    SELF.registeredPopup("task-update", "module/task/task-add.html");
    let [dialog, addBtn, titlTextBox, descriptTextBox, scoreTextBox, startTimeDatetimeBox, endTimeDatetimeBox] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    let [typeCombobox, statusCombobox, submitBtn, thumbnailPath, thumbnailFilebox] = [undefined, undefined, undefined, undefined, undefined];


    /**
     * 格式化时间
     * @param {type} date 时间参数
     * @param {type} format 转换格式
     * @returns {String} 转换结果
     */
    function formatDate(date, format) {
        if (!format)
            format = "yyyy-MM-dd";
        date = new Date(parseInt(date));
        var dict = {
            "yyyy": date.getFullYear(),
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "S": date.getMilliseconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(y+|M+|d+)/g, function (a) {
            return dict[a];
        });
    }

    let requestTask = (id) => {
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
            let query = `/admin/task/${id}`;
            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, updateTask = (type, title, thumbnail, descript, score, startTime, endTime, status, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-task");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/task/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`type=${type}&title=${title}&thumbnail=${thumbnail}&descript=${descript}&score=${score}&startTime=${startTime}&endTime=${endTime}&status=${status}`);
        });
    }, requestTaskType = () => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve({
                        "data": xhr.response
                    });
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("GET", `/admin/task-type?offset=0&count=10`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadTask = (id) => {
        requestTask(id).then(task => {
            const title = titlTextBox.textbox("setValue", task.title);
            const descript = descriptTextBox.textbox("setValue", task.descript);
            const score = scoreTextBox.numberbox("setValue", task.score);
            const startTime = startTimeDatetimeBox.datetimebox("setValue", formatDate(task.startTime));
            const endTime = endTimeDatetimeBox.datetimebox("setValue", formatDate(task.endTime));
            const type = typeCombobox.combobox("setValue", task.type);
            statusCombobox.combobox("setValue", task.status);
            thumbnailPath = task.thumbnail;
            if (thumbnailPath.length > 0) {
                const fielbox = thumbnailFilebox.filebox("setText", thumbnailPath);
                document.getElementById("task-add-thumbnail").src = thumbnailPath;
            }
        }, error => {
            SELF.errorHandler(error);
        });
    };

    SELF.subscribe("task-update", id => {
        loadTask(id);

        let html = SELF.getPopupHtml("task-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建演讲者",
            width: 850,
            height: 630,
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

        titlTextBox = $("#self-moudle-task-add-title").textbox({
            label: "任务标题：",
            labelWidth: 105,
            width: 350,
            height: 25,
            validType: "length[1,45]"
        });
//        descriptTextBox = $("#self-moudle-task-add-descript").textbox({
//            label: "任务简介：",
//            labelWidth: 105,
//            width: 350,
//            multiline: true,
//            height: 90,
//            validType: "length[1,45]"
//        });  
        let wangEditor = window.wangEditor;
        descriptTextBox = new wangEditor("#self-moudle-task-add-descript");
        descriptTextBox.customConfig.menus = [
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
        descriptTextBox.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        descriptTextBox.customConfig.uploadFileName = "file";
        descriptTextBox.create();

        scoreTextBox = $("#self-moudle-task-add-score").numberbox({
            label: "积分：",
            labelWidth: 105,
            width: 350,
            height: 25,
            validType: "length[1,11]"
        });

        startTimeDatetimeBox = $("#self-moudle-task-add-start_time").datetimebox({
            label: "开始时间：",
            labelWidth: 105,
            width: 350,
            editable: false,
            showSeconds: false
        });

        endTimeDatetimeBox = $("#self-moudle-task-add-end_time").datetimebox({
            label: "结束时间：",
            labelWidth: 105,
            width: 350,
            editable: false,
            showSeconds: false
        });
        typeCombobox = $("#self-moudle-task-add-type").combobox({
            label: "任务类型：",
            labelWidth: 105,
            width: 350,
            editable: false,
            valueField: "id",
            textField: "text",
            data: [{
                    "id": 1,
                    "text": "小学"
                }]
        });
        statusCombobox = $("#self-moudle-task-add-status").combobox({
            label: "任务状态：",
            labelWidth: 105,
            width: 350,
            editable: false,
            valueField: "id",
            textField: "text",
            data: [{
                    "id": 0,
                    "text": "已无效"
                }, {
                    "id": 1,
                    "text": "待认领"
                }, {
                    "id": 2,
                    "text": "已认领"
                }, {
                    "id": 3,
                    "text": "已结束"
                }]
        });
        thumbnailFilebox = $("#self-moudle-task-add-thumbnail").filebox({
            width: 313,
            height: 25,
            editable: false,
            buttonText: "&nbsp;选择任务海报&nbsp;"
        });
        $("#self-moudle-task-add-thumbnail-button").linkbutton({
            text: "上传",
            onClick: function () {
                const files = thumbnailFilebox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择图片！");
                    return;
                }
                SELF.fileUpload("task-add-thumbnail", files[0]).then(filePath => {
                    thumbnailPath = filePath;
                    thumbnailFilebox.filebox("setText", thumbnailPath);
                    document.getElementById("task-add-thumbnail").src = thumbnailPath;
                }, error => {
                    console.log(error);
                });
            }
        });
        submitBtn = $("#self-moudle-task-add-submit").linkbutton({
            text: "确定",
            width: 105
        });

        submitBtn.bind("click", () => {
            const title = titlTextBox.textbox("getValue");
            const descript = descriptTextBox.txt.html();
            const score = scoreTextBox.numberbox("getValue");
            const startTime = startTimeDatetimeBox.datetimebox("getValue");
            const endTime = endTimeDatetimeBox.datetimebox("getValue");
            const type = typeCombobox.combobox("getValue");
            const fielbox = thumbnailFilebox.filebox("getValue");
            const status = statusCombobox.combobox("getValue");
            if (title === null || title === "") {
                layer.msg("请添加任务标题！");
                titlTextBox.textbox({
                    required: true
                });
                return;
            }
            if (descript === null || descript === "") {
                layer.msg("请添加任务简介！");
                descriptTextBox.txt.html({
                    required: true,
                    width: 350
                });
                return;
            }
            if (score === null || score === "") {
                layer.msg("请添加任务积分！");
                scoreTextBox.numberbox({
                    required: true
                });
                return;
            }
            if (startTime === null || startTime === "") {
                layer.msg("请添加任务开始时间！");
                startTimeDatetimeBox.datetimebox({
                    required: true
                });
                return;
            }
            if (endTime === null || endTime === "") {
                layer.msg("请添加任务结束时间！");
                endTimeDatetimeBox.datetimebox({
                    required: true
                });
                return;
            }
            if (thumbnailPath === null || thumbnailPath === "") {
                layer.msg("请添加任务海报！");
                thumbnailFilebox.filebox({
                    required: true
                });
                return;
            }
            updateTask(type, title, thumbnailPath, descript, score, Date.parse(startTime), Date.parse(endTime), status, id);
        });

        window.Promise.all([requestTaskType()]).then((list) => {
            for (let i = 0; i < list.length; i++) {
                let typeList = [];
                for (let j = 0; j < list[i].data.v1.length; j++) {
                    let name = list[i].data.v1[j]["name"];
                    let id = list[i].data.v1[j]["id"];
                    if (j === 0) {
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
                typeCombobox.combobox({
                    label: "视频分类：",
                    labelWidth: 105,
                    width: 350,
                    valueField: "id",
                    textField: "text",
                    editable: false,
                    data: typeList
                });
            }
        });
    });
})(this, $, layer, SELF);