((window, $, layer, SELF) => {
    SELF.registeredModule("advertisement", "module/advertisement/advertisement.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, textbox, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestAdvertisementList = (title, offset, count) => {
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
            xhr.open("GET", `/admin/advertisement?title=${title}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, deleteAdvertisement = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadAdvertisementList(0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/advertisement/${id}`);
            xhr.send();
        });
    }, loadAdvertisementList = (title, offset, count) => {
        pager.pagination("loading");
        requestAdvertisementList(title, offset, count).then(result => {
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
            width: 80,
            text: "编辑"
        });

        edit.bind("click", () => {
            SELF.publish("advertisement-update", id);
        });

        const del = $(`#self-admin-module span[data-type=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 80,
            text: "删除"
        });
        del.bind("click", () => {
            deleteAdvertisement(id);
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "advertisement") {
            /* 页面被加载的处理 */
            table = $("#self-module-advertisement").datagrid({
                columns: [[
                        {field: "title", title: "标题", width: "20%", align: "center"},
                        {field: "image", title: "轮播图片地址", width: "30%", align: "center", formatter: (value, row, index) => `<a href="${value}" target="_blank">${value}</a>`},
                        {field: "type", title: "类型", width: "5%", align: "center", formatter: (value, row, index) => {
                                if (value === "activity") {
                                    return "活动";
                                } else if (value === "video") {
                                    return "视频";
                                } else if (value === "product") {
                                    return "商品";
                                }
                            }},
                        {field: "is-publish", title: "是否发布", width: "5%", align: "center", formatter: (value, row, index) => value === true ? "已发布" : "未发布"},
                        {field: "xxx", title: "操作", width: "15%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-advertisement-toolbar",
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
                        loadAdvertisementList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });
            searchBox = $("#self-module-advertisement-toolbar-name").searchbox({
                label: "轮播图片位置搜索",
                width: 300,
                height: 38,
                labelWidth: 120,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadAdvertisementList(value.trim(), 0, 10);
                }
            });
            addBtn = $("#self-module-advertisement-toolbar-add").linkbutton({
                text: "新增轮播",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                SELF.publish("advertisement-upload");
            });

            loadAdvertisementList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "advertisement") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        }
    })("adver-list-refresh", () => {
        loadAdvertisementList("", 0, 10);
    });
})(this, $, layer, SELF);