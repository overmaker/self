((window, $, layer, SELF) => {
    SELF.registeredModule("product-type", "module/shop/product-type.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, textbox, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestProductTypeList = (name, offset, count) => {
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
            xhr.open("GET", `/admin/product-type?name=${name}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, insertProductTypeList = (name) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    loadProductTypeList("", 0, 10);
                } else if (xhr.status === 409) {
                    layer.msg('商品类型已存在！');
                } else if (xhr.status === 400) {
                    layer.msg('请输入类型名称！');
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/product-type`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}`);
        });
    }, updateProductType = (name, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    loadProductTypeList("", 0, 10);
                } else if (xhr.status === 409) {
                    layer.msg('商品类型已存在！');
                } else if (xhr.status === 400) {
                    layer.msg('请输入类型名称！');
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/product-type/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}`);
        });
    }, deleteProductTypeList = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadProductTypeList('', 0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/product-type/${id}`);
            xhr.send();
        });
    }, loadProductTypeList = (name, offset, count) => {
        pager.pagination("loading");
        requestProductTypeList(name, offset, count).then(result => {
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
    }, createDialog = () => {
        dialog = $("<div class='add-type'><span id='self-text-product-type'></span><span id='self-btn-product-type' class='add-type-submit'></span></div>").appendTo("body");
        dialog.dialog({
            title: " ",
            width: 400,
            height: 135,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                textbox.textbox("clear");
            }
        });
        textbox = $("#self-text-product-type").textbox({
            label: "分类名称",
            width: 220,
            height: 38,
            labelWidth: 100
        });

        dialogBtn = $("#self-btn-product-type").linkbutton({
            text: "确定",
            iconCls: "icon-ok"
        });

        dialogBtn.bind("click", () => {
            /*** 验证特殊字符*/
            if (/[~#^$@%&!*,.，。'“”<>《》{}=；？?/、_【】—（）-]/gi.test(textbox.textbox("getValue"))) {
                layer.msg("不能输入特殊字符！");
                return;
            }
            if (textbox.textbox('getValue').length > 20) {
                layer.msg("类型名称输入超长！");
                return;
            }
            if (openType === "add") {
                insertProductTypeList(textbox.textbox("getValue"));
            } else if (openType === "edit") {
                updateProductType(textbox.textbox("getValue"), currentId);
            }
        });
    }, genOPButton = (id, name, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 120,
            text: "编辑分类名称"
        });
        edit.bind("click", () => {
            if (!dialog) {
                createDialog();
            }

            textbox.textbox("setValue", edit.attr("data-text"));

            dialog.dialog("setTitle", "编辑分类名称");
            dialog.dialog("open");
            currentId = id;
            openType = "edit";
        });

        const del = $(`#self-admin-module span[data-type=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除分类"
        });
        del.bind("click", () => {
            deleteProductTypeList(id);
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "product-type") {
            /* 页面被加载的处理 */
            table = $("#self-module-product-type").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "modified-time", title: "修改时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "name", title: "分类名称", width: "20%", align: "center"},
                        {field: "xxx", title: "操作", width: "40%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-product-type-toolbar",
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
                        loadProductTypeList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-product-type-toolbar-name").searchbox({
                label: "分类名称",
                width: 220,
                height: 38,
                labelWidth: 100,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadProductTypeList(value.trim(), 0, 10);
                }
            });

            addBtn = $("#self-module-product-type-toolbar-add").linkbutton({
                text: "新建分类",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                if (!dialog) {
                    createDialog();
                }
                dialog.dialog("setTitle", "新建分类");
                dialog.dialog("open");
                openType = "add";
            });

            loadProductTypeList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "product-type") {
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
    });
})(this, $, layer, SELF);