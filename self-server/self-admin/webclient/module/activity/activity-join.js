((window, $, layer, SELF) => {
    SELF.registeredModule("activity-join", "module/activity/activity-join.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestActivityJoinList = (title, offset, count) => {
        return new window.Promise((resolve, reject) => {
            let obj = {
                "activity": {
                    "title": title
                }
            }
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
            xhr.open("PUT", `/admin/activity-join/manage`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(obj));
        });
    }, loadActivityJoinList = (title, offset, count) => {
        pager.pagination("loading");
        requestActivityJoinList(title, offset, count).then(result => {
            let dataList = result["v1"],
                    total = result["v2"];
            console.log(dataList);
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
        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "activity-join") {
            /* 页面被加载的处理 */
            table = $("#self-module-activity-join").datagrid({
                columns: [[
                        {field: "user-info", title: "观众报名", width: "20%", formatter: (value, row, index) => {
                                //  return `<img width=80 height=80 src="${value["photo"]}" style="margin-top: 10px; margin-bottom: 10px;" />`;
                                let html = `<img width=65 height=auto src="${value["photo"]}" style="margin-top: 20px; margin-left: 5%;float: left;" /><div style="margin-top: 5%;margin-left: 30%;"><div style="line-height: 25px;">${row["j-name"]}</div><div style="line-height: 25px;"><span>手机号:${row["j-mobile"]}</span><span style="margin-left: 30%;">邮箱:${row["j-email"]}</span></div><div style="line-height: 25px;">${new Date(row ["join-time"]).toLocaleString()}</div></div>`;
                                return html;

                            }},
                        /* {field: "j-name", title: "用户姓名", width: "10%", align: "center"},
                         {field: "j-mobile", title: "报名手机号", width: "15%", align: "center"},
                         {field: "join-time", title: "报名时间", width: "15%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                         {field: "j-email", title: "报名邮箱", width: "10%", align: "center", },*/
                        {field: "activity", title: "活动名称", width: "23%", align: "center", formatter: (value, row, index) => value.title},
                        {field: "----", title: "支付金额", width: "13%", align: "center", formatter: (value, row, index) => row.activity.fee}
                    ]],
                toolbar: "#self-module-activity-join-toolbar",
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
                        loadActivityJoinList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-activity-join-toolbar-name").searchbox({
                label: "活动标题",
                width: 260,
                height: 38,
                labelWidth: 120,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadActivityJoinList(value.trim(), 0, 10);
                }
            });

            loadActivityJoinList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "activity-join") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

            /* 卸载对话框 */
            if (dialog) {
                dialog.dialog("destroy");
            }
            dialog = undefined;

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
            openType = undefined;
        }
    });
})(this, $, layer, SELF);