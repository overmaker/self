((window, $, layer, SELF) => {
    SELF.registeredModule("activity-template", "module/activity/activity-template.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, textbox, content, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openTemplate = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除模板

    let requestActivityTemplateList = (name, offset, count) => {
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
            xhr.open("GET", `/admin/activity-template?name=${name}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, requestTemplate = id => {
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
            xhr.open("GET", `/admin/activity-template/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadTemplate = id => {
        requestTemplate(id).then(Template => {
            textbox.textbox("setValue", Template.name);
            content.txt.html(Template.content);
        }, error => {
            SELF.errorHandler(error);
        });
    }, insertActivityTemplateList = (name, content) => {
        return new window.Promise((resolve, reject) => {
            var obj = {
                "name": name,
                "content": content
            };
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    loadActivityTemplateList("", 0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/activity-template`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    };
    updateActivityTemplate = (name, content, id) => {
        loadTemplate(id);
        var obj = {
            "id": id,
            "name": name,
            "content": content
        };
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    loadActivityTemplateList("", 0, 10);
                } else if (xhr.status === 409) {
                    layer.msg('活动类型已存在！');
                } else if (xhr.status === 400) {
                    layer.msg('请输入类型名称！');
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/activity-template`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    }, deleteActivityTemplateList = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadActivityTemplateList('', 0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/activity-template/${id}`);
            xhr.send();
        });
    }, loadActivityTemplateList = (name, offset, count) => {
        pager.pagination("loading");
        requestActivityTemplateList(name, offset, count).then(result => {
            let dataList = result["v1"],
                    total = result["v2"];
            table.datagrid("loadData", dataList);
            pager.pagination({
                total: total,
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            currentId = undefined;

            dataList.forEach((data, index) => {
                genOPButton(data["id"], data['name'], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, createDialog = () => {
        dialog = $("<div class='add-template'><span id='self-text-activity-template'></span></br></br><span id='self-edit-activity-template'></span></br><span id='self-btn-activity-template' class='add-template-submit'></span></div>").appendTo("body");
        dialog.dialog({
            title: " ",
            width: 400,
            height: 135,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                textbox.textbox("clear");
            }
        });
        textbox = $("#self-text-activity-template").textbox({
            label: "模板名称",
            width: 320,
            labelWidth: 100
        });
        var wangEditor = window.wangEditor;
        content = new wangEditor("#self-edit-activity-template");
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
        content.customConfig.uploadImgServer = "/site/wang-editor/wang-editor-upload";
        content.customConfig.uploadFileName = "file";
        content.create();

        dialogBtn = $("#self-btn-activity-template").linkbutton({
            text: "确定",
            iconCls: "icon-ok"
        });

        dialogBtn.bind("click", () => {
            var intro = content.txt.html();
            /*** 验证特殊字符*/
            if (/[~#^$@%&!*,.，。'“”<>《》{}=；？?/、_【】—（）-]/gi.test(textbox.textbox("getValue"))) {
                layer.msg("不能输入特殊字符！");
                return;
            }
            if (textbox.textbox('getValue').length > 20) {
                layer.msg("类型名称输入超长！");
                return;
            }
            if (openTemplate === "add") {
                insertActivityTemplateList(textbox.textbox("getValue"), intro);
            } else if (openTemplate === "edit") {
                updateActivityTemplate(textbox.textbox("getValue"), intro, currentId);
            }
        });
    }
//    genOPButton = (id, name, index) => {
////        var content = new wangEditor("#self-edit-activity-template");
//        const edit = $(`#self-admin-module span[data-template=op-edit][data-id=${id}]`).linkbutton({
//            iconCls: "icon-edit",
//            width: 120,
//            text: "模板编辑"
//        });
//        edit.bind("click", () => {
//            if (!dialog) {
//                createDialog();
//            }
//
////            textbox.textbox("setValue", edit.attr("data-text"));
////            content.txt.html("setValue", edit.attr("xxx"));
//            dialog.dialog({
//                title: "编辑模板",
//                width: 820,
//                height: 500,
//                closed: false,
//                maximizable: true,
//                cache: false,
//                modal: true,
//                onClose: function () {
//                    /* 卸载对话框 */
//                }
//            });
//            dialog.dialog("open");
//            currentId = id;
//            openTemplate = "edit";
//        });
//
//        const del = $(`#self-admin-module span[data-template=op-del][data-id=${id}]`).linkbutton({
//            iconCls: "icon-cancel",
//            width: 100,
//            text: "删除模板"
//        });
//        del.bind("click", () => {
//            deleteActivityTemplateList(id);
//        });
//
//        dynamicButtons.push(edit);
//        dynamicButtons.push(del);
//
//        table.datagrid("fixRowHeight", index);
//    }
    , genOPButton = (id, name, index) => {
//        var content = new wangEditor("#self-edit-activity-template");
        const edit = $(`#self-admin-module span[data-template=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 120,
            text: "模板编辑"
        });
        edit.bind("click", () => {
            SELF.publish("activity-template-update", id);
        });

        const del = $(`#self-admin-module span[data-template=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除模板"
        });
        del.bind("click", () => {
            deleteActivityTemplateList(id);
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "activity-template") {
            /* 页面被加载的处理 */
            table = $("#self-module-activity-template").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "modified-time", title: "修改时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "name", title: "模板名称", width: "20%", align: "center"},
                        {field: "content", title: "模板内容", width: "20%", align: "center"},
                        {field: "xxx", title: "操作", width: "40%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]}  data-template="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-template="op-del" data-id=${row["id"]}></span>`
//                                ,
//                          `<span style="margin:5px 10px 5px 0px;" data-text=${row["content"]}  data-template="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-template="op-del" data-id=${row["id"]}></span>`
                                        ;
                            }}
                    ]],
                toolbar: "#self-module-activity-template-toolbar",
                rownumbers: true,
                pagination: true,
                fitColumns: true,
                singleSelect: true,
                height: "100%"
            });
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadActivityTemplateList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-activity-template-toolbar-name").searchbox({
                label: "模板名称",
                width: 320,
                labelWidth: 100,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadActivityTemplateList(value.trim(), 0, 10);
                }
            });

            addBtn = $("#self-module-activity-template-toolbar-add").linkbutton({
                text: "新建模板",
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                if (!dialog) {
                    createDialog();
                }
                dialog.dialog({
                    title: "新建模板",
                    width: 820,
                    height: 500,
                    closed: false,
                    maximizable: true,
                    cache: false,
                    modal: true,
                    onClose: function () {
                        /* 卸载对话框 */
                    }
                });

                dialog.dialog("open");
                openTemplate = "add";
            });

            loadActivityTemplateList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "activity-template") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

            /* 卸载对话框 */
            if (dialog) {
                dialog.dialog("destroy");
            }
            dialog = undefined;

            if (addBtn) {
                addBtn.unbind("click");
            }
            addBtn = undefined;

            if (dialogBtn) {
                dialogBtn.unbind("click");
            }
            dialogBtn = undefined;

            /* 卸载动态按钮 */
            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            searchBox.searchbox("destroy");
            searchBox = undefined;

            currentId = undefined;
            openTemplate = undefined;
        }
    })
            ("load-activity-template-update", () => {
                loadActivityTemplateList("", 0, 10);
            });
})(this, $, layer, SELF);