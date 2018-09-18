((window, $, layer, SELF) => {
    SELF.registeredModule("about", "module/advertisement/about.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, dialogBtn] = [undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestAboutList = (offset, count) => {
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
            xhr.open("GET", `/admin/about?offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadAboutList = (offset, count) => {
        pager.pagination("loading");
        requestAboutList(offset, count).then(result => {
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
            SELF.publish("about-update",id);
        });

        dynamicButtons.push(edit);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "about") {
            /* 页面被加载的处理 */
            table = $("#self-module-about").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "25%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "modified-time", title: "修改时间", width: "25%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "type", title: "类型", width: "25%", align: "center"},
                        {field: "xxx", title: "操作", width: "25%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-about-toolbar",
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
                        loadAboutList((currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            loadAboutList(0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "about") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        }
    })("load-about-upload", () => {
        loadAboutList(0, 10);
    });
})(this, $, layer, SELF);