((window, $, layer, SELF) => {
    SELF.registeredModule("activity-apply", "module/activity/activity-apply.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, csearchBox, searchBtn, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestActivityApplyList = (name, offset, count) => {
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
            xhr.open("GET", `/admin/activity-apply?name=${name}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadActivityApplyList = (name, offset, count) => {
        pager.pagination("loading");
        requestActivityApplyList(name, offset, count).then(result => {
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
        const view = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 80,
            text: "详情"
        });
        view.bind("click", () => {
            SELF.publish("activity-apply-view", id);
        });

        dynamicButtons.push(view);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "activity-apply") {
            /* 页面被加载的处理 */
            table = $("#self-module-activity-apply").datagrid({
                columns: [[
                        {field: "name", title: "企业名称", width: "15%", align: "center"},
                        {field: "responsible", title: "负责人", width: "10%", align: "center"},
                        {field: "contact", title: "联系人", width: "15%", align: "center"},
                        {field: "tel", title: "联系电话", width: "15%", align: "center"},
                        {field: "email", title: "联系邮箱", width: "15%", align: "center"},
                        {field: "create-time", title: "申请时间", width: "15%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "status", title: "状态", width: "10%", align: "center", formatter: (value, row, index) => {
                                if (value === 0) {
                                    return "待审批";
                                } else if (value === 1) {
                                    return "通过";
                                } else if (value === 2) {
                                    return "不通过";
                                }
                            }},
                        {field: "xxx", title: "操作", width: "20%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-activity-apply-toolbar",
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
                        loadActivityApplyList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-activity-apply-toolbar-name").textbox({
                label: "企业名称",
                width: 320,
                height: 38,
                labelWidth: 100,
                labelAlign: "center"
            });

            searchBtn = $("#self-module-activity-apply-toolbar-search").linkbutton({
                text: "查询",
                height: 38,
                iconCls: "icon-search"
            });

            searchBtn.bind("click", () => {
                const name = searchBox.textbox("getValue");
                loadActivityApplyList(name, 0, 10);
            });

            loadActivityApplyList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "activity-apply") {
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

            currentId = undefined;
            openType = undefined;
        }
    })("load-activity-apply-view", () => {
        loadActivityApplyList("", 0, 10);
    });
})(this, $, layer, SELF);