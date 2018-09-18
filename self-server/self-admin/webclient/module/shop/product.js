((window, $, layer, SELF) => {
    SELF.registeredModule("product", "module/shop/product.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, textbox, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestProductList = (name, offset, count) => {
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
            xhr.open("GET", `/admin/product?name=${name}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadProductList = (name, offset, count) => {
        pager.pagination("loading");
        requestProductList(name, offset, count).then(result => {
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
            width: 70,
            text: "编辑"
        });
        edit.bind("click", () => {
            SELF.publish("product-update", id);
        });
        //第一个
        const copy = $(`#self-admin-module span[data-type=op-copy][data-id=${id}]`).linkbutton({
            iconCls: "icon-print",
            width: 70,
            text: "复制"
        });

        copy.bind("click", () => {
            SELF.publish("product-copy", id);
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(copy);
        table.datagrid("fixRowHeight", index);
    };
    copyProduct = id => {
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
            xhr.open("POST", `/admin/product/copy`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`id=${id}`);
        });
    };
    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "product") {
            /* 页面被加载的处理 */
            table = $("#self-module-product").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "11%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "modified-time", title: "修改时间", width: "11%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "sn", title: "商品编号", width: "11%", align: "center"},
                        {field: "name", title: "商品名称", width: "11%", align: "center"},
                        {field: "price", title: "商品价格", width: "11%", align: "center"},
                        {field: "score", title: "商品积分", width: "11%", align: "center"},
                        {field: "type", title: "所属类别", width: "11%", align: "center", formatter: (value, row, index) => value.name},
                        {field: "pinfo", title: "库存", width: "11%", align: "center", formatter: (value, row, index) => value.stock},
                        {field: "xxx", title: "操作", width: "11%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`
                                        + `<span style="margin:5px 10px 5px 0px;" data-type="op-copy" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-product-toolbar",
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
                        loadProductList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-product-toolbar-name").searchbox({
                label: "搜索",
                width: 200,
                height: 38,
                labelWidth: 60,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadProductList(value.trim(), 0, 10);
                }
            });

            addBtn = $("#self-module-product-toolbar-add").linkbutton({
                text: "添加",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                SELF.publish("product-add");
            });

            loadProductList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "product") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        }
    })("load-product-add", () => {
        loadProductList("", 0, 10);
    })
            ("product-copy", id => {
                layer.confirm("复制的商品是不可用状态，且不会在前台显示，如果要在前台显示请将可用状态置为可用。是否复制？", {icon: 3, title: null}, function (index) {
                    layer.close(index);
                    pager.pagination("loading");
                    copyProduct(id).then(result => {
                        pager.pagination("loaded");
                        loadProductList("", 0, 10);
                    }, error => {
                        pager.pagination("loaded");
                        SELF.errorHandler(error);
                    });
                });
            });
})(this, $, layer, SELF);