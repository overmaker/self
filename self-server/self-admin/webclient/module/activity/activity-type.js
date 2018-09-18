((window, $, layer, SELF) => {
    SELF.registeredModule("activity-type", "module/activity/activity-type.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, textbox, dialogBtn, searchBox] = [];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestActivityTypeList = (name, offset, count) => {
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
            xhr.open("GET", `/admin/activity-type?name=${name}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, insertActivityTypeList = (name) => {
        const xhr = new window.XMLHttpRequest();
        xhr.onloadstart = () => SELF.startLoadAnimation();
        xhr.onloadend = () => SELF.stopLoadAnimation();
        xhr.onload = () => {
            if (xhr.status === 204) {
                dialog.dialog("close");
                loadActivityTypeList("", 0, 10);
            } else if (xhr.status === 409) {
                layer.msg('活动类型已存在！');
            } else if (xhr.status === 400) {
                layer.msg('请输入类型名称！');
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = (evt) => {
            SELF.errorHandler("error");
        };
        xhr.open("POST", `/admin/activity-type`);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`name=${name}`);
    }, updateActivityType = (name, id) => {
        const xhr = new window.XMLHttpRequest();
        xhr.onloadstart = () => SELF.startLoadAnimation();
        xhr.onloadend = () => SELF.stopLoadAnimation();
        xhr.onload = () => {
            if (xhr.status === 204) {
                dialog.dialog("close");
                loadActivityTypeList("", 0, 10);
            } else if (xhr.status === 409) {
                layer.msg('活动类型已存在！');
            } else if (xhr.status === 400) {
                layer.msg('请输入类型名称！');
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = (evt) => {
            SELF.errorHandler("error");
        };
        xhr.open("PUT", `/admin/activity-type/${id}`);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`name=${name}`);
    }, deleteActivityTypeList = (id) => {
        const xhr = new window.XMLHttpRequest();
        xhr.onloadstart = () => SELF.startLoadAnimation();
        xhr.onloadend = () => SELF.stopLoadAnimation();
        xhr.onload = () => {
            if (xhr.status === 204) {
                loadActivityTypeList("", 0, 10);
            } else if (xhr.status === 409) {
                layer.alert("该活动分类已被其他活动使用，无法删除", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = (evt) => {
            SELF.errorHandler("error");
        };
        xhr.open("DELETE", `/admin/activity-type/${id}`);
        xhr.send();
    }, loadActivityTypeList = (name, offset, count) => {
        pager.pagination("loading");
        requestActivityTypeList(name, offset, count).then(result => {
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
        dialog = $("<div class='add-type'><span id='self-text-activity-type'></span><span id='self-btn-activity-type' class='add-type-submit'></span></div>").appendTo("body");
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
        textbox = $("#self-text-activity-type").textbox({
            label: "分类名称",
            width: 220,
            labelWidth: 100
        });

        dialogBtn = $("#self-btn-activity-type").linkbutton({
            text: "确定",
            iconCls: "icon-ok"
        });

        dialogBtn.bind("click", () => {
            let typeName = textbox.textbox("getValue").trim();
            typeName = encodeURIComponent(typeName);
            if (openType === "add") {
                insertActivityTypeList(typeName);
            } else if (openType === "edit") {
                updateActivityType(typeName, currentId);
            }
        });
    }, genOPButton = (id, name, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 100,
            text: "编辑"
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
            text: "删除"
        });
        del.bind("click", () => {
            $.messager.confirm("删除分类", `是否要删除该分类[${name}]`, ok => {
                if (ok) {
                    deleteActivityTypeList(id);
                }
            });
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "activity-type") {
            /* 页面被加载的处理 */
            table = $("#self-module-activity-type").datagrid({
                columns: [[
                        {field: "name", title: "分类名称", width: "40%", align: "center"},
                        {field: "xxx", title: "操作", width: "60%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-activity-type-toolbar",
                rownumbers: true,
                pagination: true,
                fitColumns: true,
                singleSelect: true,
                fit: true
            });
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadActivityTypeList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-activity-type-toolbar-name").searchbox({
                label: "活动分类",
                width: 400,
                height: 38,
                labelWidth: 100,
                labelAlign: "center",
                prompt: "输入活动分类名称",
                searcher: (value, name) => {
                    loadActivityTypeList(value.trim(), 0, 10);
                }
            });
            searchBox.searchbox("textbox").attr("maxlength", 20);

            addBtn = $("#self-module-activity-type-toolbar-add").linkbutton({
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

            loadActivityTypeList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "activity-type") {
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