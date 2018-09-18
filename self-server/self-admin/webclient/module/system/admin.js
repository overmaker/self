((window, $, layer, SELF) => {
    SELF.registeredModule("system-admin", "module/system/admin.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [addBtn, searchBox] = [];

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestAdminList = (name, offset, count) => {
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
            xhr.open("GET", `/admin/admins?name=${name}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadAdminList = (name, offset, count) => {
        pager.pagination("loading");
        requestAdminList(name, offset, count).then(result => {
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
            SELF.publish("admin-update", id);
        });

        dynamicButtons.push(edit);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "system-admin") {
            /* 页面被加载的处理 */
            table = $("#self-admin-list").datagrid({
                columns: [[
                        {field: "user-name", title: "用户名", width: "20%", align: "center"},
                        {field: "user-name", title: "姓名", width: "20%", align: "center"},
                        {field: "role", title: "角色", width: "20%", align: "center", formatter: (value, row, index) => value === null ? "未分配" : value["name"]},
                        {field: "xxx", title: "操作", width: "20%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-admin-toolbar",
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
                        loadAdminList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-admin-toolbar-name").searchbox({
                label: "用户姓名",
                width: 300,
                labelWidth: 100,
                height: 38,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadAdminList(value.trim(), 0, 10);
                }
            });

            addBtn = $("#self-module-admin-toolbar-add").linkbutton({
                text: "新建用户",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                SELF.publish("admin-upload");
            });

            loadAdminList("", 0, 10);
        }
    })("unload-module", moduleName => {
        if (moduleName === "system-admin") {
            /* 卸载动作 */

            addBtn.unbind("click");

            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        }
    })("load-admin-upload", () => {
        loadAdminList("", 0, 10);
    });
})(this, $, layer, SELF);