((window, $, layer, SELF) => {
    SELF.registeredModule("video-donation", "module/statistics/video-donation.html");

    let [table, table1, table2, pager] = [undefined, undefined, undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, dialogBtn, addBtn, exportBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestVideo = () => {
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
            xhr.open("GET", `/admin/video?offset=0&count=10000`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, requestVideoDonationList = (offset, count) => {
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
            xhr.open("GET", `/admin/video-donation/statistics?offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadVideoDonationList = (offset, count) => {
        pager.pagination("loading");
        requestVideoDonationList(offset, count).then(result => {
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
    }, requestVideoDonationList1 = (offset, count) => {
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
            xhr.open("GET", `/admin/video-donation/statistics1?offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadVideoDonationList1 = (offset, count) => {
        pager.pagination("loading");
        requestVideoDonationList1(offset, count).then(result => {
            let dataList = result["v1"],
                    total = result["v2"];
            table1.datagrid("loadData", dataList);
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
    }, requestVideoDonationList2 = (video, offset, count) => {
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
            xhr.open("GET", `/admin/video-donation/statistics2?video=${video}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadVideoDonationList2 = (video, offset, count) => {
        pager.pagination("loading");
        requestVideoDonationList2(video, offset, count).then(result => {
            let dataList = result["v1"],
                    total = result["v2"];
            table2.datagrid("loadData", dataList);
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
        table.datagrid("fixRowHeight", index);
        table1.datagrid("fixRowHeight", index);
        table2.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "video-donation") {
            /* 页面被加载的处理 */
            table = $("#self-module-video-donation").datagrid({
                columns: [[
                        {field: "video", title: "视频名称", width: "50%", align: "center", formatter: (video, row, index) => video.title},
                        {field: "total-fee", title: "打赏金额", width: "50%", align: "center"}
                    ]],
                rownumbers: true,
                pagination: true,
                fitColumns: true,
                singleSelect: true,
                height: "320"
            });
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadVideoDonationList((currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-video-donation-toolbar-name").combobox({
                label: "视频名称",
                width: 400,
                height: 38,
                labelWidth: 100,
                labelAlign: "center"
            });

            addBtn = $("#self-module-video-donation-toolbar-add").linkbutton({
                text: "查询",
                iconCls: "icon-search"
            });

            addBtn.bind("click", () => {
                $("#div").hide();
                $("#div1").hide();
                loadVideoDonationList2(searchBox.combobox("getValue"), 0, 10);
            });

            exportBtn = $("#self-module-video-donation-toolbar-export").linkbutton({
                text: "导出到excel",
                iconCls: "icon-excel"
            });

            exportBtn.bind("click", () => {
                const video = searchBox.combobox("getValue");
                const uri = `/admin/video-donation/export?video=${video}`;
                window.open(uri);
            });

            table1 = $("#self-module-video-donation1").datagrid({
                columns: [[
                        {field: "user", title: "用户昵称", width: "50%", align: "center", formatter: (user, row, index) => user["user-name"]},
                        {field: "total-fee", title: "打赏金额", width: "50%", align: "center"}
                    ]],
                rownumbers: true,
                pagination: true,
                fitColumns: true,
                singleSelect: true,
                height: "320"
            });
            pager = table1.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadVideoDonationList1((currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            table2 = $("#self-module-video-donation2").datagrid({
                columns: [[
                        {field: "user", title: "用户昵称", width: "50%", align: "center", formatter: (user, row, index) => user["user-name"]},
                        {field: "total-fee", title: "打赏金额", width: "50%", align: "center"}
                    ]],
                rownumbers: true,
                pagination: true,
                fitColumns: true,
                singleSelect: true,
                height: "600"
            });
            pager = table2.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadVideoDonationList2((currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            window.Promise.all([requestVideo()]).then((list) => {
                let titleList = [];
                for (let i = 0; i < list[0].v1.length; i++) {
                    let name = list[0].v1[i]["title"];
                    let id = list[0].v1[i]["id"];
                    titleList.push({
                        id: id,
                        text: name
                    });
                }

                searchBox.combobox({
                    valueField: "id",
                    textField: "text",
                    editable: false,
                    data: titleList
                });
                loadVideoDonationList(0, 10);
                loadVideoDonationList1(0, 10);

            });
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "video-donation") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        }
    });
})(this, $, layer, SELF);