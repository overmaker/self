((window, $, layer, SELF) => {
    SELF.registeredModule("guest", "module/video/guest.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 20]; // 初始化第1页，每页10行
    let [dialog, addBtn, dialogBtn, textboxName, textboxUnit] = [undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID

    let [searchName] = [""];

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    let rquestGuest = (offset, count, name) => {
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
            xhr.open("GET", `/admin/guest?offset=${offset}&count=${count}&name=${name}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadGuest = (offset, count, name) => {
        pager.pagination("loading");
        rquestGuest(offset, count, name).then(result => {
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
                genOPButton(data["id"], data["name"]);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, genOPButton = (id, name, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 120,
            text: "编辑"
        });
        edit.bind("click", () => {
            SELF.publish("guest-update", id);
        });

        dynamicButtons.push(edit);

        table.datagrid("fixRowHeight", index);
    };



    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "guest") {
            /* 页面被加载的处理 */
            table = $("#self-module-guest").datagrid({
                columns: [[
                        {field: "photo", title: "", width: "100px", align: "center", formatter: (value, row, index) => {
                                return `<img width=80 height=80 src="${value}" style="margin-top: 10px; margin-bottom: 10px;" />`;
                            }
                        },
                        {field: "name", title: "嘉宾姓名", width: "150px", align: "center"},
                        {field: "mobile", title: "电话", width: "200px", align: "center"},
                        {field: "cc", title: "操作", width: "150px", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-guest-toolbar",
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
                        loadGuest((currentPageNumber - 1) * currentPageSize, currentPageSize, searchName);
                    }
                }
            });

            textboxName = $("#self-module-guest-toolbar-name").textbox({
                label: "嘉宾姓名",
                width: 200,
                labelWidth: 100,
                labelAlign: "center"
            });
            const searchBtn = $("#self-module-guest-toolbar-seach").linkbutton({
                text: "查询",
                iconCls: "icon-search"
            });

            addBtn = $("#self-module-guest-toolbar-add").linkbutton({
                text: "添加嘉宾",
                iconCls: "icon-add"
            });


            addBtn.bind("click", () => {
                SELF.publish("guest-add");
            });

            searchBtn.bind("click", () => {
                searchName = textboxName.textbox("getValue");
                
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                
                loadGuest(0, 10, searchName);
            });

            loadGuest(0, 10, "");
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "guest") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

            currentId = undefined;

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            [searchName] = [""];
        }
    })("load-guest-upload", () => {
        [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        loadGuest(0, 10, "");
    });
})(this, $, layer, SELF);