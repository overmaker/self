((window, $, layer, SELF) => {
    SELF.registeredModule("activity-report", "module/activity/activity-report.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, textbox, content, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openTemplate = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除模板

    let requestActivityReportList = (title, offset, count) => {
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
            xhr.open("GET", `/admin/activity-report?title=${title}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, deleteActivityReport = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadActivityReportList('', 0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/activity-report/${id}`);
            xhr.send();
        });
    }, loadActivityReportList = (title, offset, count) => {
        pager.pagination("loading");
        requestActivityReportList(title, offset, count).then(result => {
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
    }, genOPButton = (id, name, index) => {
        const edit = $(`#self-admin-module span[data-template=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 120,
            text: "编辑报道"
        });
        edit.bind("click", () => {
            SELF.publish("activity-report-update", id);
        });

        const del = $(`#self-admin-module span[data-template=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除报道"
        });
        del.bind("click", () => {
            deleteActivityReport(id);
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    }
    ;

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "activity-report") {
            /* 页面被加载的处理 */
            table = $("#self-module-activity-report").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "15%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "modified-time", title: "修改时间", width: "15%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "title", title: "报道标题", width: "20%", align: "center"},
                        {field: "media", title: "报道媒体", width: "15%", align: "center"},
                        {field: "report-time", title: "报到时间", width: "15%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "xxx", title: "操作", width: "20%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]}  data-template="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-template="op-del" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-activity-report-toolbar",
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
                        loadActivityReportList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-activity-report-toolbar-name").searchbox({
                label: "报道标题",
                width: 320,
                height: 38,
                labelWidth: 100,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadActivityReportList(value.trim(), 0, 10);
                }
            });

            addBtn = $("#self-module-activity-report-toolbar-add").linkbutton({
                text: "新建报道",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                SELF.publish("activity-report-upload");
            });

            loadActivityReportList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "activity-report") {
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
            ("load-activity-report-upload", () => {
                loadActivityReportList("", 0, 10);
            });
})(this, $, layer, SELF);