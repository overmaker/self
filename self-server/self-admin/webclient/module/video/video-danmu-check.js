((window, $, layer, SELF) => {
    SELF.registeredModule("video-danmu-check", "module/video/video-danmu-check.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, dialogBtn, searchBox, delBtn, chaBtn] = [undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestVideoCommentList = (title, offset, count) => {
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
            xhr.open("GET", `/admin/danmu/admin?video-title=${title}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, deleteVideoCommentList = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadVideoCommentList("", 0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/danmu/${id}`);
            xhr.send();
        });
    }, changeVideoCommentList = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadVideoCommentList("", 0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/danmu/${id}`);
            xhr.send();
        });
    },
            loadVideoCommentList = (title, offset, count) => {
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

            currentId = undefined;

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "video-danmu-check") {
            /* 页面被加载的处理 */
            table = $("#self-module-video-danmu-check").datagrid({
                columns: [[
                        {field: "id", title: "评论id", width: "10%", align: "center", checkbox: true},
                        {field: "content", title: "评论内容", width: "50%", align: "center"}
                    ]],
                toolbar: "#self-module-video-danmu-check-toolbar",
                rownumbers: true,
                pagination: true,
                fitColumns: true,
                height: "100%"
            });
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadVideoCommentList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

//            searchBox = $("#self-module-video-danmu-check-toolbar-change").searchbox({
//                label: "视频标题",
//                width: 220,
//                labelWidth: 100,
//                labelAlign: "center",
//                searcher: (value, change) => {
//                    loadVideoCommentList(value.trim(), 0, 10);
//                }
//            });
            chaBtn = $(`#self-module-video-danmu-check-toolbar-change`).linkbutton({
                iconCls: "icon-edit",
                width: 100,
                text: "审核通过"
            });
            chaBtn.bind("click", () => {
                var checked = table.datagrid("getChecked");
                for (var i = 0; i < checked.length; i++) {
                    changeVideoCommentList(checked[i].id);
                }
            });

            delBtn = $(`#self-module-video-danmu-check-toolbar-delete`).linkbutton({
                iconCls: "icon-cancel",
                width: 100,
                text: "删除评论"
            });
            delBtn.bind("click", () => {
                var checked = table.datagrid("getChecked");
                for (var i = 0; i < checked.length; i++) {
                    deleteVideoCommentList(checked[i].id);
                }
            });

            loadVideoCommentList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "video-danmu-check") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

            /* 卸载对话框 */
            if (dialog) {
                dialog.dialog("destroy");
            }
            dialog = undefined;
            if (dialogBtn) {
                dialogBtn.unbind("click");
            }
            dialogBtn = undefined;

            dynamicButtons.length = 0; // 清空数组元素

            currentId = undefined;
        }
    });
})(this, $, layer, SELF);
