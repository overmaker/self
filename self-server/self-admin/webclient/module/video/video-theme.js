((window, $, layer, SELF) => {
    SELF.registeredModule("video-theme", "module/video/video-theme.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

    let [addBtn, searchBox] = [undefined, undefined];
    
    let themeName = undefined;

    const dynamicButtons = [];

    let requestThemeList = (name, offset, count) => {
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
            let query = `/admin/video-theme?offset=${offset}&count=${count}`;
            if (name && name.length > 0) {
                query += `&name=${name}`;
            }
            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadThemeList = (name, offset, count) => {
        pager.pagination("loading");
        requestThemeList(name, offset, count).then(result => {
            table.datagrid("loadData", result["v1"]);
            pager.pagination({
                total: result["v2"],
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            result["v1"].forEach((data, index) => {
                genOPButton(data["id"], data['name'], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, deleteTheme = (id) => {
        const xhr = new window.XMLHttpRequest();
        xhr.onloadstart = () => SELF.startLoadAnimation();
        xhr.onloadend = () => SELF.stopLoadAnimation();
        xhr.onload = () => {
            if (xhr.status === 204) {
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                themeName = undefined;
                loadThemeList("", 0, 10);
            } else if (xhr.status === 409) {
                layer.alert("该视频主题已被其他视频使用，无法删除", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = (evt) => {
            SELF.errorHandler("error");
        };
        xhr.open("DELETE", `/admin/video-theme/${id}`);
        xhr.send();
    }, genOPButton = (id, name, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 100,
            text: "编辑"
        });
        edit.bind("click", () => {
            SELF.publish("video-theme-update", id);
        });

        const del = $(`#self-admin-module span[data-type=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除"
        });
        del.bind("click", () => {
            $.messager.confirm("删除主题", `是否要删除该主题[${name}]`, ok => {
                if (ok) {
                    deleteTheme(id);
                }
            });
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "video-theme") {
            /* 页面被加载的处理 */
            table = $("#self-module-video-theme").datagrid({
                columns: [[
                        {field: "name", title: "主题名称", width: "40%", align: "center"},
                        {field: "xxx", title: "操作", width: "60%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-video-theme-toolbar",
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
                        loadThemeList(themeName, (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-video-theme-toolbar-name").searchbox({
                label: "视频主题",
                width: 400,
                height: 38,
                labelWidth: 100,
                labelAlign: "center",
                prompt: "输入视频主题名称",
                searcher: (value, name) => {
                    themeName = value.trim();
                    [currentPageNumber, currentPageSize] = [1, 10];
                    loadThemeList(themeName, 0, 10);
                }
            });
            searchBox.searchbox("textbox").attr("maxlength", 20);

            addBtn = $("#self-module-video-theme-toolbar-add").linkbutton({
                text: "新建主题",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                SELF.publish("video-theme-upload");
            });

            loadThemeList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "video-theme") {
            /* 卸载动作 */

            addBtn.unbind("click");

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            searchBox.searchbox("destroy");
            searchBox = undefined;

            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
            themeName = undefined;
        }
    })("video-theme-list-refresh", () => {
        loadThemeList("", (currentPageNumber - 1) * currentPageSize, currentPageSize);
    });
})(this, $, layer, SELF);
