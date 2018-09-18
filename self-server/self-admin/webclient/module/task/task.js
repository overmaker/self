((window, $, layer, SELF) => {
    SELF.registeredModule("task", "module/task/task.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, dialogBtn, searchBox, addBtn, taskTypeNameTextBox] = [undefined, undefined, undefined, undefined, undefined];


    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除任务类型

    let requestTask = (offset, count, title) => {
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
            let query = `/admin/task?&offset=${offset}&count=${count}`;
            if (title.length > 0) {
                query += `&title=${title}`;
            }
            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadTaskList = (offset, count, title) => {
        pager.pagination("loading");
        requestTask(offset, count, title).then(result => {
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
                genOPButton(data["id"], data["status"], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, genOPButton = (id, status, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 120,
            text: "编辑"
        });
        edit.bind("click", () => {
            SELF.publish("task-update", id);
        });
        dynamicButtons.push(edit);
        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "task") {
            table = $("#self-module-task").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "14%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "title", title: "任务标题", width: "15%", align: "center"},
                        {field: "descript", title: "任务简介", width: "20%", align: "center"},
                        {field: "score", title: "任务积分", width: "11%", align: "center"},
                        {field: "startTime", title: "开始时间", width: "14%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "endTime", title: "结束时间", width: "14%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "status", title: "任务状态", width: "13%", align: "center", formatter: (value, row, index) => {
                                if (value === 0) {
                                    return "已无效";
                                } else if (value === 3) {
                                    return "已结束";
                                } else if(value === 1){
                                    return `&nbsp;待认领&nbsp;&nbsp;&nbsp;<span style='margin:5px 10px 5px 0px;' data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                                }else if(value === 2){
                                    return `&nbsp;已认领&nbsp;&nbsp;&nbsp;<span style='margin:5px 10px 5px 0px;' data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                                }
                            }}
                    ]],
                toolbar: "#self-module-task-toolbar",
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
                        loadTaskList((currentPageNumber - 1) * currentPageSize, currentPageSize, "");
                    }
                }
            });

            searchBox = $("#self-module-task-toolbar-seach").searchbox({
                label: "任务标题 ",
                width: 250,
                labelWidth: 100,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadTaskList(0, 10, value);
                }
            });

            addBtn = $("#self-module-task-toolbar-add").linkbutton({
                text: "发布任务 ",
                iconCls: "icon-add"
            });
            addBtn.bind("click", () => {
                SELF.publish("task-add");
            });
            loadTaskList(0, 10, "");
        }
    })("load-task", () => {
        [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        loadTaskList(0, 10, "");
    });
})(this, $, layer, SELF);
    