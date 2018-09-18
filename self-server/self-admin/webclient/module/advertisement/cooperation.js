((window, $, layer, SELF) => {
    SELF.registeredModule("cooperation", "module/advertisement/cooperation.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, textbox, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestCooperationList = (title, offset, count) => {
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
            xhr.open("GET", `/admin/cooperation?title=${title}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, deleteCooperation = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadCooperationList("", 0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/cooperation/${id}`);
            xhr.send();
        });
    }, loadCooperationList = (title, offset, count) => {
        pager.pagination("loading");
        requestCooperationList(title, offset, count).then(result => {
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
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 100,
            text: "编辑"
        });
        edit.bind("click", () => {
            SELF.publish("cooperation-update",id);
        });

        const del = $(`#self-admin-module span[data-type=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除"
        });
        del.bind("click", () => {
            deleteCooperation(id);
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "cooperation") {
            /* 页面被加载的处理 */
            table = $("#self-module-cooperation").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "modified-time", title: "修改时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "title", title: "合作机构标题", width: "20%", align: "center"},
                        {field: "image", title: "合作机构图片", width: "20%", align: "center"},
                        {field: "xxx", title: "操作", width: "20%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-cooperation-toolbar",
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
                        loadCooperationList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-cooperation-toolbar-name").searchbox({
                label: "搜索",
                width: 200,
                labelWidth: 60,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadCooperationList(value.trim(), 0, 10);
                }
            });

            addBtn = $("#self-module-cooperation-toolbar-add").linkbutton({
                text: "添加",
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                SELF.publish("cooperation-add");
            });

            loadCooperationList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "cooperation") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        }
    })("load-cooperation-add", () => {
        loadCooperationList("", 0, 10);
    });
})(this, $, layer, SELF);