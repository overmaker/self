((window, $, layer, SELF) => {
    SELF.registeredModule("video", "module/video/video.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

    let [searchBox, publishCombobox, recommendCombobox, publishtimeCombobox, commentnumCombobox] = [];

    let videoSearch = {};

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    const initUI = () => {
        table = $("#self-module-video").datagrid({
            columns: [[
                    {field: "thumbnail", title: "封面图", width: "220rem;", align: "center", formatter: (value, row, index) => {
                            return `<img width=180 height=120 src="${value}" style="margin-top: 10px; margin-bottom: 10px;" />`;
                        }},
                    {field: "title", title: "视频标题", width: "360rem;", align: "center", formatter: (value, row, index) => {
                            let html = `<p>${value}</p>`;
                            if (row["enable"] === true) {
                                html += `<p>发布于：${new Date(row["publish-time"]).toLocaleString()}</p>`;
                            }
                            if (row["enable"] === false) {
                                html += `<p style="color:#808080;">未发布</p>`;
                            } else if (row["status"] === 0) {
                                html += `<p style="color:#808080;">待审核</p>`;
                            } else if (row["status"] === 1) {
                                html += `<p style="color:green;">审核通过</p>`;
                            } else {
                                html += `<p style="color:red;">审核不通过</p>`;
                            }
                            return html;
                        }},
                    {field: "xxx", title: "指数", width: "100rem;", align: "center", formatter: (value, row, index) => {
                            let html = `<p><i class="layui-icon layui-icon-play">&nbsp;${row["hits-num"]}</i></p>`;
                            html += `<p></p>`;
                            html += `<p><button data-type="op-comment" data-id="${row["id"]}" class="layui-btn layui-btn-primary layui-btn-xs"><i class="layui-icon layui-icon-dialogue">&nbsp;${row["comment-num"]}</i></button></p>`;
                            return html;
                        }},
//                    {field: "vip", title: "VIP", width: "100rem;", align: "center", formatter: (value, row, index) => {
//                            return value === true ? "是" : "否";
//                        }},
                    {field: "recommend", title: "首页显示", width: "100rem;", align: "center", formatter: (value, row, index) => {
                            return value === true ? "是" : "否";
                        }},
                    {field: "yyy", title: "操作", width: "150rem;", align: "center", formatter: (value, row, index) => {
                            let html = ``;
                            html += `<div><span style="margin:5px 10px 5px 0px;" data-type="op-view" data-id="${row["id"]}"></span></div>`;
//                            if (row["enable"] === false) {
                                html += `<div><span style="margin:5px 10px 5px 0px;" data-type="op-edit" data-id="${row["id"]}"></span></div>`;
//                            }
                            html += `<div><span style="margin:5px 10px 5px 0px;" data-type="op-delete" data-id="${row["id"]}"></span></div>`;
                            return html;
                        }}
                ]],
            toolbar: "#self-module-video-toolbar",
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
                    videoSearch["offset"] = (currentPageNumber - 1) * currentPageSize;
                    videoSearch["count"] = currentPageSize;
                    loadVideoList(videoSearch);
                }
            }
        });

        searchBox = $("#self-module-video-toolbar-title").searchbox({
            label: "视频标题",
            width: 400,
            labelWidth: 100,
            height: 38,
            labelAlign: "center",
            prompt: "输入视频标题",
            searcher: function (value, name) {
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                videoSearch["offset"] = (currentPageNumber - 1) * currentPageSize;
                videoSearch["count"] = currentPageSize;
                videoSearch["title"] = value.trim();
                loadVideoList(videoSearch);
            }
        });

        publishCombobox = $("#self-module-video-toolbar-publish").combobox({
            label: "发布状态&nbsp;&nbsp;",
            width: 220,
            labelWidth: 100,
            height: 38,
            labelAlign: "right",
            valueField: "id",
            textField: "text",
            editable: false,
            data: [{id: 0, text: "全部"}, {id: 1, text: "已发布"}, {id: 2, text: "未发布"}],
            onChange: (newValue, oldValue) => {
                if (newValue === 1) {
                    videoSearch["enable"] = true;
                } else if (newValue === 2) {
                    videoSearch["enable"] = false;
                } else {
                    delete videoSearch.enable;
                }
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                videoSearch["offset"] = (currentPageNumber - 1) * currentPageSize;
                videoSearch["count"] = currentPageSize;
                loadVideoList(videoSearch);
            }
        });

        recommendCombobox = $("#self-module-video-toolbar-recommend").combobox({
            label: "首页显示&nbsp;&nbsp;",
            width: 220,
            labelWidth: 100,
            height: 38,
            labelAlign: "right",
            valueField: "id",
            textField: "text",
            editable: false,
            data: [{id: 0, text: "全部"}, {id: 1, text: "是"}, {id: 2, text: "否"}],
            onChange: (newValue, oldValue) => {
                if (newValue === 1) {
                    videoSearch["recommend"] = true;
                } else if (newValue === 2) {
                    videoSearch["recommend"] = false;
                } else {
                    delete videoSearch.recommend;
                }
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                videoSearch["offset"] = (currentPageNumber - 1) * currentPageSize;
                videoSearch["count"] = currentPageSize;
                loadVideoList(videoSearch);
            }
        });

        publishtimeCombobox = $("#self-module-video-toolbar-publishtime").combobox({
            label: "发布时间&nbsp;&nbsp;",
            width: 220,
            labelWidth: 100,
            height: 38,
            labelAlign: "right",
            valueField: "id",
            textField: "text",
            editable: false,
            data: [{id: 0, text: "忽略排序"}, {id: -1, text: "从新到旧"}, {id: 1, text: "从旧到新"}],
            onChange: (newValue, oldValue) => {
                if (newValue === 0) {
                    delete videoSearch["publish-time-order"];
                } else {
                    videoSearch["publish-time-order"] = newValue;
                }
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                videoSearch["offset"] = (currentPageNumber - 1) * currentPageSize;
                videoSearch["count"] = currentPageSize;
                loadVideoList(videoSearch);
            }
        });

        commentnumCombobox = $("#self-module-video-toolbar-commentnum").combobox({
            label: "评论数&nbsp;&nbsp;",
            width: 220,
            labelWidth: 100,
            height: 38,
            labelAlign: "right",
            valueField: "id",
            textField: "text",
            editable: false,
            data: [{id: 0, text: "忽略排序"}, {id: -1, text: "从多到少"}, {id: 1, text: "从少到多"}],
            onChange: (newValue, oldValue) => {
                if (newValue === 0) {
                    delete videoSearch["hite-order"];
                } else {
                    videoSearch["hite-order"] = newValue;
                }
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                videoSearch["offset"] = (currentPageNumber - 1) * currentPageSize;
                videoSearch["count"] = currentPageSize;
                loadVideoList(videoSearch);
            }
        });

    }, destroy = () => {
        /* 卸载动作 */

        /* 解绑点击事件 */
        dynamicButtons.forEach((btn, index) => {
            btn.unbind("click");
        });
        dynamicButtons.length = 0; // 清空数组元素

        videoSearch = {};
        [table, pager] = [];
        [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行


    }, genOPButton = (id, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 100,
            text: "编辑"
        });
        edit.bind("click", () => {
            SELF.nav("video-update", id);
        });
        
        const del = $(`#self-admin-module span[data-type=op-delete][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除"
        });
        del.bind("click", () => {
            deleteVideoList(id);
        });

        const view = $(`#self-admin-module span[data-type=op-view][data-id=${id}]`).linkbutton({
            iconCls: "icon-more",
            width: 100,
            text: "查看"
        });

        view.bind("click", () => {
        });
        
        const comment = $(`#self-admin-module button[data-type=op-comment][data-id=${id}]`);
        
        comment.bind("click", () => {
            SELF.nav("video-comment-view", id);
        });

        dynamicButtons.push(edit, view, comment);

        table.datagrid("fixRowHeight", index);
    }, deleteVideoList = (id) => {
        const xhr = new window.XMLHttpRequest();
        xhr.onloadstart = () => SELF.startLoadAnimation();
        xhr.onloadend = () => SELF.stopLoadAnimation();
        xhr.onload = () => {
            if (xhr.status === 204) {
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                videoSearch["offset"] = (currentPageNumber - 1) * currentPageSize;
                videoSearch["count"] = currentPageSize;
                loadVideoList(videoSearch);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = (evt) => {
            SELF.errorHandler("error");
        };
        xhr.open("DELETE", `/admin/video/${id}`);
        xhr.send();
    }, requestVideoList = (videoSearch) => {
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
            xhr.open("PUT", `/admin/video/advance`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(videoSearch));
        });
    }, loadVideoList = (videoSearch) => {
        pager.pagination("loading");
        requestVideoList(videoSearch).then(result => {
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
                genOPButton(data["id"], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "video") {
            initUI();

            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
            videoSearch["offset"] = (currentPageNumber - 1) * currentPageSize;
            videoSearch["count"] = currentPageSize;
            loadVideoList(videoSearch);
        }
    })("unload-module", moduleName => {
        if (moduleName === "video") {
            destroy();
        }
    });
})(this, $, layer, SELF);
