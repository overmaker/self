((window, $, layer, SELF) => {
    SELF.registeredModule("task-type", "module/task/task-type.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, dialogBtn, searchBox, addBtn, taskTypeNameTextBox] = [undefined, undefined, undefined, undefined, undefined];


    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除任务类型

    let requestTaskType = (offset, count, name) => {
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
            let query = `/admin/task-type?offset=${offset}&count=${count}`;
            if (name.length > 0) {
                query += `&name=${name}`;
            }
            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, insertTaskType = (name) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    loadTaskTypeList(0, 10, "", null);
                } else if (xhr.status === 409) {
                    layer.msg('任务类型已存在！');
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };

            xhr.open("POST", `/admin/task-type`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}`);
        });
    }, updteTaskType = (name,id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    loadTaskTypeList(0, 10, "", null);
                } else if (xhr.status === 409) {
                    layer.msg('任务类型已存在！');
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };

            xhr.open("PUT", `/admin/task-type/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}`);
        });
    }, deleteTaskType = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadTaskTypeList(0, 10,"",null);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/task-type/${id}`);
            xhr.send();
        });
    }, loadTaskTypeList = (offset, count, name) => {
        pager.pagination("loading");
        requestTaskType(offset, count, name).then(result => {
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


            dataList.forEach((data, index) => {
                genOPButton(data["id"], data["name"], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, createDialog = (name, id) => {
        dialog = $("<div class='add-album'><span id='self-text-task-type'></span><span id='self-btn-task-type' class='add-album-submit'></span></div>").appendTo("body");
        dialog.dialog({
            title: " ",
            width: 500,
            height: 140,
            closed: false,
            cache: false,
            modal: true
        });
        taskTypeNameTextBox = $("#self-text-task-type").textbox({
            label: "任务类型名称",
            width: 280,
            labelWidth: 140
        });

        dialogBtn = $("#self-btn-task-type").linkbutton({
            text: "确定",
            iconCls: "icon-ok"
        });

        dialogBtn.bind("click", () => {
            if (name === "add") {
                if (taskTypeNameTextBox.textbox("getValue").length > 0) {
                    insertTaskType(taskTypeNameTextBox.textbox("getValue"));
                    taskTypeNameTextBox.textbox("clear");
                    return;
                }
                layer.msg('请输入任务类型名称！');

            } else if (name === "edit") {
                if (taskTypeNameTextBox.textbox("getValue").length > 0) {
                    updteTaskType(taskTypeNameTextBox.textbox("getValue"),id);
                    return;
                }
                layer.msg('请输入任务类型名称！');

            }
        });
    }, genOPButton = (id, name, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 120,
            text: "编辑"
        });
        edit.bind("click", () => {
            if (!dialog) {
                createDialog('edit', id);
            }
            dialog.dialog("setTitle", "编辑任务类型名称");
            dialog.dialog("open");
            taskTypeNameTextBox.textbox("setValue", name);
        });

        const del = $(`#self-admin-module span[data-type=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除"
        });
        del.bind("click", () => {
            deleteTaskType(id);
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "task-type") {
            /* 页面被加载的处理 */
            table = $("#self-module-task-type").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "25%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "modified-time", title: "修改时间", width: "25%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "name", title: "任务任务类型", width: "25%", align: "center"},
                        {field: "cc", title: "操作", width: "25%", align: "center", formatter: (value, row, index) => {
                                return `<span style='margin:5px 10px 5px 0px;' data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-task-type-toolbar",
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
                        loadTaskTypeList((currentPageNumber - 1) * currentPageSize, currentPageSize, "");
                    }
                }
            });

            searchBox = $("#self-module-task-type-toolbar-name").searchbox({
                label: "任务类型名称",
                width: 250,
                labelWidth: 140,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadTaskTypeList(0, 10, value);
                }
            });

            addBtn = $("#self-module-task-type-toolbar-add").linkbutton({
                text: "添加任务分类",
                iconCls: "icon-add"
            });
            addBtn.bind("click", () => {
                if (!dialog) {
                    createDialog('add', null);
                }
                dialog.dialog("setTitle", "添加任务类型名称");
                dialog.dialog("open");
            });
            loadTaskTypeList(0, 10, "");
        }
    });
})(this, $, layer, SELF);
    