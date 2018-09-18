((window, $, layer, SELF) => {
    SELF.registeredModule("task-join", "module/task/left-menu-task-join.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, dialogBtn, searchBox, addBtn, taskTypeNameTextBox] = [undefined, undefined, undefined, undefined, undefined];

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除任务类型

    let updateTaskJoin = (status, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadTaskJoin("", "", "", "");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/task-join/update-status/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`status=${status}`);
        });
    },updateTask = (status, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/task/task-status/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`status=${status}`);
        });
    }, requestTaskJoin = (name, mobile, email, status) => {
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
            let query = `/admin/task-join?offset=0&count=10`;
            if (name.length > 0) {
                query += `&name=${name}`;
            }
            if (mobile.length > 0) {
                query += `&mobile=${mobile}`;
            }
            if (email.length > 0) {
                query += `&email=${email}`;
            }
            if (status.length > 0 && status !== null) {
                query += `&status=${status}`;
            }

            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadTaskJoin = (name, mobile, emil, status) => {
        pager.pagination("loading");
        requestTaskJoin(name, mobile, emil, status).then(result => {
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
                genOPButton(data["id"],data["task"].id, index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, genOPButton = (id, task,index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            text: "通过",
            width: 50,
            onClick: function () {
                updateTaskJoin(1, id);
                updateTask(2,task);
            }
        });
        const del = $(`#self-admin-module span[data-type=op-del][data-id=${id}]`).linkbutton({
            text: "不通过",
            width: 50,
            onClick: function () {
                updateTaskJoin(2, id);
            }
        });
        table.datagrid("fixRowHeight", index);
    };


    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "task-join") {
            table = $("#self-moudle-task-join").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "15%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "name", title: "领取人姓名", width: "15%", align: "center"},
                        {field: "score", title: "任务积分", width: "15%", align: "center"},
                        {field: "mobile", title: "领取人手机号", width: "15%", align: "center"},
                        {field: "email", title: "领取人邮箱", width: "13%", align: "center"},
                        {field: "task", title: "任务标题", width: "15%", align: "center", formatter: (value, row, index) => value.title},
                        {field: "status", title: "任务状态", width: "13%", align: "center", formatter: (value, row, index) => {
                                if (value === 0) {
                                    return `<span style='margin:5px 10px 5px 0px;' data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                                } else if (value === 1) {
                                    return "已认领";
                                } else if (value === 2) {
                                    return "被否决";
                                } else if (value === 3) {
                                    return "已结束";
                                }
                            }}
                    ]],
                toolbar: "#self-moudle-task-join-toolbar",
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

            $("#self-moudle-task-join-toolbar-menu").searchbox({
                menu: '#mm',
                searcher: function (value, name) {
                    if (name === "领取人姓名") {
                        loadTaskJoin(value, "", "",  $("#self-moudle-task-join-toolbar-status").combobox("getValue"));
                    }
                    if (name === "领取人邮箱") {
                        loadTaskJoin("", "", value, $("#self-moudle-task-join-toolbar-status").combobox("getValue"));
                    }
                    if (name === "领取人电话") {
                        loadTaskJoin("", value, "", $("#self-moudle-task-join-toolbar-status").combobox("getValue"));
                    }
                }
            });
            $("#self-moudle-task-join-toolbar-status").combobox({
                label: "领取状态",
                width: 200,
                labelWidth: 110,
                editable: false,
                height: 25,
                valueField: "id",
                textField: "text",
                data: [{
                        "id": 0,
                        "text": "待审核"
                    }, {
                        "id": 1,
                        "text": "已认领"
                    }, {
                        "id": 2,
                        "text": "被否决"
                    }, {
                        "id": 3,
                        "text": "已结束"
                    }]
            });

            loadTaskJoin("", "", "", "");
        }
    });
})(this, $, layer, SELF);