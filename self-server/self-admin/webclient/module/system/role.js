((window, $, layer, SELF) => {
    SELF.registeredModule("system-role", "module/system/role.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

    let searchBox = undefined;
    let addBtn = undefined;

    const dynamicButtons = []; // 动态生成的按钮

    let searchName = "";

    const requestRoles = (offset, count, name) => {
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
            let query = `/admin/roles?offset=${offset}&count=${count}&name=${name}`;
            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadRoles = (offset, count, name) => {
        pager.pagination("loading");
        requestRoles(offset, count, name).then(result => {
            let roles = result["v1"],
                    total = result["v2"];
            table.datagrid("loadData", roles);
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

            roles.forEach((data, index) => {
                genOPButton(data["id"], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, genOPButton = (id, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 120,
            text: "授权"
        });
        edit.bind("click", () => {
            SELF.publish("role-update", id);
        });
        dynamicButtons.push(edit);
        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "system-role") {
            table = $("#self-role-list").datagrid({
                columns: [[
                        {field: "name", title: "名称", width: "50%", align: "center"},
                        {field: "xxx", title: "授权", width: "30%", align: "center", formatter: (value, row, index) => {
                                return `<span style='margin:5px 10px 5px 0px;' data-type="op-edit" data-id=${row["id"]} ></span>`;
                            }}
                    ]],
                toolbar: "#self-role-toolbar",
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
                        loadRoles((currentPageNumber - 1) * currentPageSize, currentPageSize, searchName);
                    }
                }
            });

            searchBox = $("#self-role-toolbar-search").searchbox({
                label: "角色名称",
                width: 300,
                labelWidth: 100,
                height: 38,
                labelAlign: "center",
                searcher: (value, name) => {
                    searchName = value.trim();
                    [currentPageNumber, currentPageSize] = [1, 10];
                    loadRoles((currentPageNumber - 1) * currentPageSize, currentPageSize, searchName);
                }
            });

            addBtn = $("#self-role-toolbar-add").linkbutton({
                text: "新建角色",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                SELF.publish("role-upload");
            });

            loadRoles(0, 10, searchName);
        }
    })("unload-module", moduleName => {
        if (moduleName === "system-role") {
            /* 卸载动作 */

            searchName = "";

            /* 解绑点击事件 */
            addBtn.unbind("click");
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            searchBox.searchbox("destroy");

            dynamicButtons.length = 0; // 清空数组元素

            [table, pager] = [];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        }
    })("role-refresh", () => {
        loadRoles(0, 10, searchName);
    });

})(this, $, layer, SELF);