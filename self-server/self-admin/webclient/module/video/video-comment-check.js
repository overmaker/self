((window, $, layer, SELF) => {
    SELF.registeredModule("video-comment-check", "module/video/video-comment-check.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [searchBox, delBtn, chaBtn] = [];

    let searchTitle = "";

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestVideoCommentList = (title, offset, count) => {
        return new window.Promise((resolve, reject) => {
            let obj = {
                "video": {
                    "title": title
                }
            };
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
            xhr.open("PUT", `/admin/video-comment/admin?offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(obj));
        });
    }, deleteVideoCommentList = (id) => {
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
            xhr.open("DELETE", `/admin/video-comment/${id}`);
            xhr.send();
        });
    }, changeVideoCommentList = (id) => {
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
            xhr.open("PUT", `/admin/video-comment/${id}`);
            xhr.send();
        });
    }, genOPButton = (id, index) => {
        const check = $(`#self-admin-module span[data-type=op-check][data-id=${id}]`).linkbutton({
            iconCls: "icon-ok",
            width: 100,
            text: "审核通过"
        });
        check.bind("click", () => {
            changeVideoCommentList(id).then().finally(() => {
                [currentPageNumber, currentPageSize] = [1, 10];
                loadVideoCommentList(searchTitle, 0, 10);
            });
        });
        const del = $(`#self-admin-module span[data-type=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除评论"
        });
        del.bind("click", () => {
            deleteVideoCommentList(id).then().finally(() => {
                [currentPageNumber, currentPageSize] = [1, 10];
                loadVideoCommentList(searchTitle, 0, 10);
            });
        });

        dynamicButtons.push(check, del);

        table.datagrid("fixRowHeight", index);
    }, loadVideoCommentList = (title, offset, count) => {
        pager.pagination("loading");
        requestVideoCommentList(title, offset, count).then(result => {
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

            result["v1"].forEach((data, index) => {
                genOPButton(data["id"], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "video-comment-check") {
            /* 页面被加载的处理 */
            table = $("#self-module-video-comment-check").datagrid({
                columns: [
                    [
                        {field: "id", title: "评论id", width: "10%", align: "center", checkbox: true},
                        {field: "user-info", title: "", width: "40%", align: "center", formatter: (value, row, index) => {
                                let html = `<img width=65 height=auto src="${value["photo"]}" style="margin-top: 20px; margin-left: 5%;float: left;" /><div style="margin-top: 5%;margin-left: 30%;"><div style="line-height: 25px;">${row.user["user-name"]}</div><div style="line-height: 25px;">${row["comment"]}</div><div style="line-height: 25px;">${new Date(row ["create-time"]).toLocaleString()}</div></div>`;
                                return html;
                            }},
                        {field: "video", title: "视频名称", width: "25%", align: "center", formatter: (value, row, index) => value.title},
                        {field: "xxx", title: "操作", width: "15%", align: "center", formatter: (value, row, index) => {
                                let html = "";
                                html += `<div><span style="margin:5px 10px 5px 0px;" data-type="op-check" data-id=${row["id"]}></span></div>`;
                                html += `<div><span style="margin:5px 10px 5px 0px;" data-type="op-del" data-id=${row["id"]}></span></div>`;
                                return html;
                            }}
                    ]
                ],
                toolbar: "#self-module-video-comment-check-toolbar",
                rownumbers: true,
                pagination: true,
                fitColumns: true,
                fit: true
            });
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadVideoCommentList(searchTitle, (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-video-comment-check-toolbar-name").searchbox({
                label: "视频标题",
                width: 500,
                height: 38,
                labelWidth: 100,
                labelAlign: "center",
                searcher: (value, change) => {
                    searchTitle = value.trim();
                    [currentPageNumber, currentPageSize] = [1, 10];
                    loadVideoCommentList(searchTitle, 0, 10);
                }
            });
            chaBtn = $(`#self-module-video-comment-check-toolbar-change`).linkbutton({
                iconCls: "icon-ok",
                width: 100,
                height: 38,
                text: "审核通过"
            });
            chaBtn.bind("click", () => {
                var checked = table.datagrid("getChecked");
                for (let i = 0; i < checked.length; i++) {
                    changeVideoCommentList(checked[i].id);
                }
                [currentPageNumber, currentPageSize] = [1, 10];
                loadVideoCommentList(searchTitle, 0, 10);
            });

            delBtn = $(`#self-module-video-comment-check-toolbar-delete`).linkbutton({
                iconCls: "icon-cancel",
                width: 100,
                height: 38,
                text: "删除评论"
            });
            delBtn.bind("click", () => {
                var checked = table.datagrid("getChecked");
                for (let i = 0; i < checked.length; i++) {
                    deleteVideoCommentList(checked[i].id);
                }
                [currentPageNumber, currentPageSize] = [1, 10];
                loadVideoCommentList(searchTitle, 0, 10);
            });

            loadVideoCommentList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "video-comment-check") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
            
            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });
            dynamicButtons.length = 0; // 清空数组元素
            
            delBtn.unbind("click");
            chaBtn.unbind("click");
            
            searchBox.searchbox("destroy");

            searchTitle = "";
        }
    });
})(this, $, layer, SELF);