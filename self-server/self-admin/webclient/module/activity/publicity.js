((window, $, layer, SELF) => {
    SELF.registeredModule("publicity", "module/activity/publicity.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, csearchBox, searchBtn, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openTemplate = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除模板

    let requestPublicity = (aname, cname, offset, count) => {
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

            xhr.open("GET", `/admin/publicity?aname=${aname}&cname=${cname}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, deletePublicity = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    SELF.publish("load-publicity-upload");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/publicity/${id}`);
            xhr.send();
        });
    }, loadPublicity = (aname, cname, offset, count) => {
        pager.pagination("loading");
        requestPublicity(aname, cname, offset, count).then(result => {
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
            text: "编辑"
        });
        edit.bind("click", () => {
            SELF.publish("publicity-update", id);
        });

        const del = $(`#self-admin-module span[data-template=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除"
        });
        del.bind("click", () => {
            deletePublicity(id);
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    }
    ;

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "publicity") {
            /* 页面被加载的处理 */
            table = $("#self-module-publicity").datagrid({
                columns: [[
                        {field: "activity-name", title: "活动名称", width: "25%", align: "center"},
                        {field: "cooperation-name", title: "合作机构名称", width: "30%", align: "center"},
                        {field: "publish-date", title: "发布时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "xxx", title: "操作", width: "25%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]}  data-template="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-template="op-del" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-publicity-toolbar",
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
                        loadPublicity(searchBox.textbox("getValue").trim(), csearchBox.textbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-publicity-toolbar-aname").textbox({
                label: "名称",
                width: 320,
                height: 38,
                labelWidth: 100,
                labelAlign: "center"
            });

            csearchBox = $("#self-module-publicity-toolbar-cname").textbox({
                label: "合作机构",
                width: 320,
                height: 38,
                labelWidth: 120,
                labelAlign: "center"
            });

            searchBtn = $("#self-module-publicity-toolbar-search").linkbutton({
                text: "查询",
                height: 38,
                iconCls: "icon-search"
            });

            searchBtn.bind("click", () => {
                const aname = searchBox.textbox("getValue");
                const cname = csearchBox.textbox("getValue");
                loadPublicity(aname, cname, 0, 10);
            });

            addBtn = $("#self-module-publicity-toolbar-add").linkbutton({
                text: "添加",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                SELF.publish("publicity-upload");
            });

            loadPublicity("", "", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "publicity") {
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

            searchBox.textbox("destroy");
            searchBox = undefined;
            csearchBox.textbox("destroy");
            csearchBox = undefined;

            currentId = undefined;
            openTemplate = undefined;
        }
    })("load-publicity-upload", () => {
        loadPublicity("", "", 0, 10);
    });
})(this, $, layer, SELF);