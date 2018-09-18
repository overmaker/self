((window, $, layer, SELF) => {
    SELF.registeredModule("activity-theme", "module/activity/activity-theme.html");

    let [table, pager] = [];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

    let searchTitle = "";

    let [dialog, themeNameTextbox, okBtn, addBtn, searchBox] = [];

    let dynamicButtons = [];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const initUI = () => {
        table = $("#self-module-activity-theme").datagrid({
            columns: [[
                    {field: "name", title: "主题名称", width: "40%", align: "center"},
                    {field: "xxx", title: "操作", width: "60%", align: "center", formatter: (value, row, index) => {
                            return `<span style="margin:5px 10px 5px 0px;" data-text="${row["name"]}" data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-text="${row["name"]}" data-type="op-del" data-id=${row["id"]}></span>`;
                        }}
                ]],
            toolbar: "#self-module-activity-theme-toolbar",
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
                    loadThemeList((currentPageNumber - 1) * currentPageSize, currentPageSize, searchTitle);
                }
            }
        });

        searchBox = $("#self-module-activity-theme-toolbar-name").searchbox({
            label: "活动主题",
            width: 400,
            labelWidth: 100,
            height: 38,
            labelAlign: "center",
            prompt: "输入活动主题名称",
            searcher: (value, name) => {
                searchTitle = value.trim();
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                loadThemeList(0, 10, searchTitle);
            }
        });
        searchBox.searchbox("textbox").attr("maxlength", 20);

        addBtn = $("#self-module-activity-theme-toolbar-add").linkbutton({
            text: "新建主题",
            height: 38,
            iconCls: "icon-add"
        });

        addBtn.bind("click", () => {
            if (!dialog) {
                createDialog();
            }
            dialog.dialog("setTitle", "新建活动主题");
            dialog.dialog("open");
            openType = "add";
        });

    }, destroyUI = () => {
        searchTitle = "";
        [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

        /* 解绑点击事件 */
        dynamicButtons.forEach((btn, index) => {
            btn.unbind("click");
        });
        dynamicButtons.length = 0;

        addBtn.unbind("click");

        [addBtn, searchBox] = [];
        [table, pager] = [];

        currentId = undefined; // 当前选中的视频类型ID
        openType = undefined;

        if (themeNameTextbox) {
            themeNameTextbox.textbox("clear");
            themeNameTextbox.textbox("destroy");
        }
        if (okBtn) {
            okBtn.unbind("click");
        }
        if (dialog) {
            dialog.dialog("destroy");
        }
        [dialog, themeNameTextbox, okBtn] = [];
    }, genOPButton = (id, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 100,
            text: "编辑"
        });
        edit.bind("click", () => {
            if (!dialog) {
                createDialog();
            }

            themeNameTextbox.textbox("setValue", edit.attr("data-text"));

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
            deleteTheme(id, del.attr("data-text"));
        });

        dynamicButtons.push(edit, del);

        table.datagrid("fixRowHeight", index);
    }, createDialog = () => {
        dialog = $("<div class='add-type'><span id='self-text-activity-theme'></span><span id='self-btn-activity-theme' class='add-type-submit'></span></div>").appendTo("body");
        dialog.dialog({
            title: " ",
            width: 400,
            height: 135,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                themeNameTextbox.textbox("clear");
            }
        });
        themeNameTextbox = $("#self-text-activity-theme").textbox({
            label: "主题名称",
            width: 220,
            labelWidth: 100
        });
        themeNameTextbox.textbox("textbox").attr("maxlength", 20);

        okBtn = $("#self-btn-activity-theme").linkbutton({
            text: "确定",
            iconCls: "icon-ok"
        });

        okBtn.bind("click", () => {
            let themeName = themeNameTextbox.textbox("getValue").trim();
            themeName = encodeURIComponent(themeName);
            if (openType === "add") {
                uploadTheme(themeName);
            } else if (openType === "edit") {
                updateTheme(currentId, themeName);
            }
        });
    }, requestThemeList = (offset, count, name) => {
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
            xhr.open("GET", `/admin/activity-theme?offset=${offset}&count=${count}&name=${name}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadThemeList = (offset, count, name) => {
        pager.pagination("loading");
        requestThemeList(offset, count, name).then(result => {
            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            table.datagrid("loadData", result["v1"]);
            pager.pagination({
                total: result["v2"],
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });

            dynamicButtons.length = 0; // 清空数组元素

            result["v1"].forEach((data, index) => {
                genOPButton(data["id"], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, requestUploadTheme = name => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    resolve();
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", "/admin/activity-theme");
            xhr.setRequestHeader("Content-Type", "application/json");
            let obj = {
                name: name
            };
            xhr.send(JSON.stringify(obj));
        });
    }, uploadTheme = name => {
        requestUploadTheme(name).then(() => {
            layer.msg("添加成功");
            dialog.dialog("close");
        }, error => {
            if (error === 400) {
                layer.msg('请输入主题名称！');
            } else if (error === 409) {
                layer.alert("活动主题名称已存在", {icon: 2, title: false});
            } else {
                SELF.errorHandler(error);
            }
        }).finally(() => {
            SELF.publish("activity-theme-reftesh");
        });
    }, requestUpdateTheme = (id, name) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    resolve();
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", "/admin/activity-theme/");
            xhr.setRequestHeader("Content-Type", "application/json");
            let obj = {
                id: id,
                name: name
            };
            xhr.send(JSON.stringify(obj));
        });
    }, updateTheme = (id, name) => {
        requestUpdateTheme(id, name).then(() => {
            layer.msg("编辑成功");
            dialog.dialog("close");
        }, error => {
            if (error === 400) {
                layer.msg('请输入主题名称！');
            } else if (error === 409) {
                layer.alert("活动主题名称已存在", {icon: 2, title: false});
            } else {
                SELF.errorHandler(error);
            }
        }).finally(() => {
            SELF.publish("activity-theme-reftesh");
        });
    }, requestDeleteTheme = id => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    resolve();
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/activity-theme/${id}`);
            xhr.send();
        });
    }, deleteTheme = (id, name) => {
        $.messager.confirm("删除主题", `是否要删除该主题[${name}]？`, ok => {
            if (ok) {
                requestDeleteTheme(id).then(() => {
                    layer.msg("删除成功");
                }, error => {
                    if (error === 409) {
                        layer.alert("该活动主题已被其他活动使用，无法删除", {icon: 2, title: false});
                    } else {
                        SELF.errorHandler(error);
                    }
                }).finally(() => {
                    SELF.publish("activity-theme-reftesh");
                });
            }
        });
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "activity-theme") {
            initUI();

            loadThemeList(0, 10, "");
        }

    })("unload-module", moduleName => {
        if (moduleName === "activity-theme") {
            destroyUI();
        }
    })("activity-theme-reftesh", () => {
        [currentPageNumber, currentPageSize] = [1, 10];
        loadThemeList((currentPageNumber - 1) * currentPageSize, currentPageSize, searchTitle);
    });
})(this, $, layer, SELF);
