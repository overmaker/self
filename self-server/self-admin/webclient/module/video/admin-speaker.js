((window, $, layer, SELF) => {
    SELF.registeredModule("admin-speaker", "module/video/admin-speaker.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, dialogBtn, textboxName, textboxUnit, textboxField] = [undefined, undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID

    let [searchName, searchField] = ["", ""];

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    let requestSpeaker = (offset, count, name) => {
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
            let query = `/admin/speaker/admin?offset=${offset}&count=${count}`;

            if (name && name.length > 0) {
                query += `&name=${name}`;
            }

            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadSpeaker = (offset, count, name) => {
        pager.pagination("loading");
        requestSpeaker(offset, count, name).then(result => {
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
                genOPButton(data["id"], data["name"], data["field"]);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, genOPButton = (id, name, field, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 120,
            text: "编辑"
        });
        edit.bind("click", () => {
            SELF.publish("admin-speaker-update", id);
        });

        dynamicButtons.push(edit);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "admin-speaker") {
            /* 页面被加载的处理 */
            table = $("#self-module-admin-speaker").datagrid({
                columns: [[
                        {field: "photo", title: "演讲者信息", width: "25%", formatter: (value, row, index) => {
                                // return `<img width=80 height=80 src="${value}" style="margin-top: 10px; margin-bottom: 10px;" />`;
                                let html = `<img width=80 height=80 src="${value}" style="margin-top: 10px; margin-bottom: 10px;float: left;" /><div style="margin: 5% 25%;"><p>${row["name"]}</p><p style="margin-top: 15%;">${row["mobile"]}</p></div>`;
                                return html;
                            }
                        },
                        //     {field: "name", title: "演讲者姓名", width: "25%", align: "center"},
                        //     {field: "mobile", title: "电话", width: "25%", align: "center"},
                        {field: "cc", title: "操作", width: "25%", align: "center", formatter: (value, row, index) => {
                                return `<span style='margin:5px 10px 5px 0px;' id='self-text-video' data-type="op-edit" data-id=${row["id"]} ></span>`;
                            }}
                    ]],
                toolbar: "#self-module-admin-speaker-toolbar",
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
                        loadSpeaker((currentPageNumber - 1) * currentPageSize, currentPageSize, searchName);
                    }
                }
            });

            textboxName = $("#self-module-admin-speaker-toolbar-name").textbox({
                label: "演讲者姓名",
                width: 220,
                height: 38,
                labelWidth: 120,
                labelAlign: "center"
            });
            const searchBtn = $("#self-module-admin-speaker-toolbar-seach").linkbutton({
                text: "查询",
                height: 38,
                iconCls: "icon-search"
            });

            addBtn = $("#self-module-admin-speaker-toolbar-add").linkbutton({
                text: "添加演讲者",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                SELF.publish("admin-speaker-add");
            });

            searchBtn.bind("click", () => {
                searchName = textboxName.textbox("getValue");

                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

                loadSpeaker(0, 10, searchName);
            });

            loadSpeaker(0, 10, "");
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "admin-speaker") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

            currentId = undefined;

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            [searchName, searchField] = ["", ""];
        }
    })("load-admin-speaker-upload", () => {
        [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        loadSpeaker(0, 10, "");
    });
})(this, $, layer, SELF);