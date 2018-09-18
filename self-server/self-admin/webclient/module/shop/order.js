((window, $, layer, SELF) => {
    SELF.registeredModule("order", "module/shop/order.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, textbox, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestOrderList = (sn, offset, count) => {
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
            xhr.open("GET", `/admin/order?sn=${sn}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadOrderList = (sn, offset, count) => {
        pager.pagination("loading");
        requestOrderList(sn, offset, count).then(result => {
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
            text: "查看"
        });
        view.bind("click", () => {
            SELF.publish("order-view", id);
        });

        dynamicButtons.push(view);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "order") {
            /* 页面被加载的处理 */
            table = $("#self-module-order").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "10%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "modified-time", title: "修改时间", width: "10%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "sn", title: "订单编号", width: "8%", align: "center"},
                        {field: "address", title: "收货地址", width: "10%", align: "center"},
                        {field: "consignee", title: "收货人", width: "6%", align: "center"},
                        {field: "mobile", title: "联系电话", width: "7%", align: "center"},
                        {field: "fee", title: "手续费", width: "5%", align: "center"},
                        {field: "amount_price", title: "订单金额", width: "5%", align: "center"},
                        {field: "amount_score", title: "订单积分", width: "5%", align: "center"},
                        {field: "shipping_method", title: "配送方式", width: "5%", align: "center", formatter: (value, row, index) => value["name"]},
                        {field: "user", title: "用户名", width: "5%", align: "center", formatter: (value, row, index) => value["user-name"]},
                        {field: "order_status", title: "订单状态", width: "6%", align: "center", formatter: (value, row, index) => {
                                if (value === 0) {
                                    return "未确认";
                                } else if (value === 1) {
                                    return "已确认";
                                } else if (value === 2) {
                                    return "已完成";
                                }
                            }},
                        {field: "payment_status", title: "支付状态", width: "6%", align: "center", formatter: (value, row, index) => {
                                if (value === 0) {
                                    return "未支付";
                                } else if (value === 1) {
                                    return "已支付";
                                }
                            }},
                        {field: "shipping_status", title: "配送状态", width: "6%", align: "center", formatter: (value, row, index) => {
                                if (value === 0) {
                                    return "未发货";
                                } else if (value === 1) {
                                    return "已发货";
                                }
                            }},
                        {field: "complete_date", title: "完成时间", width: "6%", align: "center", formatter: (value, row, index) => {
                                if (value !== null && value !== "") {
                                    return new Date(value).toLocaleString();
                                }
                            }},
                        {field: "xxx", title: "操作", width: "7%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-order-toolbar",
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
                        loadOrderList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-order-toolbar-name").searchbox({
                label: "搜索",
                width: 200,
                height: 38,
                labelWidth: 60,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadOrderList("", 0, 10);
                }
            });

            loadOrderList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "order") {
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

            searchBox.searchbox("destroy");
            searchBox = undefined;

            currentId = undefined;
            openType = undefined;
        }
    })("load-order-view", () => {
        loadOrderList("", 0, 10);
    });
})(this, $, layer, SELF);