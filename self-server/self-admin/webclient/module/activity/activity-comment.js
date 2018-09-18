((window, $, layer, SELF) => {
    SELF.registeredPopup("activity-comment", "module/activity/activity-comment.html");

    let [table, pager] = [];
    let [activityCombogrid, activityTable, activityPager, activitySearchBox, activityTable1] = [];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [currentActivityPageNumber, currentActivityPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, delBtn, pasBtn, commentFilterAll, commentFilterChecked, commentFilterUnchecked] = [];

    let activityId = undefined;
    let searchActivityTitle = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestActivityCommentList = (activityId, enable, offset, count) => {
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
            xhr.open("PUT", `/admin/activity-comment/admin?offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            let obj = {};
            if (activityId) {
                obj["activity"] = {
                    id: activityId
                };
            }
            if (enable === true) {
                obj["enable"] = true;
            }
            if (enable === false) {
                obj["enable"] = false;
            }
            xhr.send(JSON.stringify(obj));
        });
    }, deleteActivityCommentList = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadActivityCommentList(undefined, undefined, 0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/activity-comment/${id}`);
            xhr.send();
        });
    }, checkComment = id => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadActivityCommentList(undefined, undefined, 0, 10);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/activity-comment/${id}`);
            xhr.send();
        });
    }, loadActivityCommentList = (activityId, enable, offset, count) => {
        pager.pagination("loading");
        requestActivityCommentList(activityId, enable, offset, count).then(result => {
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

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, requestActivityList = (title, offset, count) => {
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
            xhr.open("PUT", `/admin/activity/list?offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            let obj = {
                title: title
            };
            xhr.send(JSON.stringify(obj));
        });
    }, loadActivityList = (title, offset, count) => {
        activityPager.pagination("loading");
        requestActivityList(title, offset, count).then(result => {
            activityTable.datagrid("loadData", result["v1"]);
            activityPager.pagination({
                total: result["v2"],
                pageNumber: currentActivityPageNumber,
                pageSize: currentActivityPageSize
            });

            activityPager.pagination("loaded");
        }, error => {
            activityPager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, initUI = () => {
        let html = SELF.getPopupHtml("activity-comment");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "活动评论",
            collapsible: false,
            minimizable: false,
            maximizable: false,
            resizable: false,
            maximized: true,
            closed: false,
            cache: false,
            modal: true,
            onClose: function () {
                destroyUI();
            }
        });

        table = $("#self-module-activity-comment").datagrid({
            columns: [[
                    {field: "xxx", title: "", width: "10%", align: "center", checkbox: true},
                    {field: "yyy", title: "", width: "40%", align: "left", formatter: (value, row, index) => {
                            let html = `<div style="margin-top: 5px;margin-left: 10px;">` +
                                    `<p style="line-height: 25px; color:#C0C0C0;">${row["user"]["user-name"]}</p>` +
                                    `<p style="line-height: 25px;">${row["comment"]}</p>` +
                                    `<p style="line-height: 25px; color:#C0C0C0;">${new Date(row ["create-time"]).toLocaleString()}</p>` +
                                    `</div>`;
                            return html;
                        }},
                    {field: "create-time", title: "评论时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                    {field: "enable", title: "审核状态", width: "10%", align: "center", formatter: (value, row, index) => value === true ? "审核通过" : "待审核"}
//                    {field: "zzz", title: "操作", width: "20%", align: "center"}
                ]],
            toolbar: "#self-module-activity-comment-toolbar",
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
                    loadActivityCommentList(undefined, undefined, (currentPageNumber - 1) * currentPageSize, currentPageSize);
                }
            }
        });

        activityCombogrid = $("#self-module-activity-comment-toolbar-activity").combogrid({
            label: "活动",
            labelWidth: 80,
            width: 600,
            height: 38,
            editable: false,
            idField: "id",
            textField: "title",
            pagination: true,
            fitColumns: true,
            singleSelect: true,
            rownumbers: true,
            columns: [[
                    {field: "thumbnail", title: "", width: "25%", align: "center", formatter: (value, row, index) => `<img src="${value}" width="50px" height="50px" style="margin-top: 5px; margin-bottom: 5px;" />`},
                    {field: "title", title: "标题", width: "75%"}
                ]],
            toolbar: "#self-module-activity-comment-toolbar-activity-toolbar",
            onChange: (newValue, oldValue) => loadActivityCommentList(newValue, undefined, 0, 10)
        });
//        var g = $('#cc').combogrid('grid');	// 获取表格控件对象
//        var r = g.datagrid('getSelected');	//获取表格当前选中行
//        alert(r.name);//随便 点出行内各个字段属性值
        activityTable = activityCombogrid.combogrid("grid");
        activityTable1 = activityTable.datagrid('getSelected');
        activityPager = activityTable.datagrid("getPager");
        activityPager.pagination({
            onSelectPage: (pageNumber, pageSize) => {
                if (pageNumber > 0) {
                    [currentActivityPageNumber, currentActivityPageSize] = [pageNumber, pageSize];
                    loadActivityList(searchActivityTitle, (currentActivityPageNumber - 1) * currentActivityPageSize, currentActivityPageSize);
                }
            }
        });

        activitySearchBox = $("#self-module-activity-comment-toolbar-activity-toolbar-title").searchbox({
            label: "活动标题",
            labelWidth: 100,
            width: 400,
            height: 38,
            searcher: function (value, name) {
                [currentActivityPageNumber, currentActivityPageSize] = [1, 10]; // 初始化第1页，每页10行
                searchActivityTitle = value.trim();
                loadActivityList(searchActivityTitle, (currentActivityPageNumber - 1) * currentActivityPageSize, currentActivityPageSize);
            },
            prompt: "输入活动标题"
        });
        activitySearchBox.searchbox("textbox").attr("maxlength", 30);

        /*评论过滤commentFilter*/
        commentFilterAll = $(`#self-module-activity-comment-filter-all`).linkbutton({
        });
        commentFilterAll.bind("click", () => {
            loadActivityCommentList(undefined, undefined, 0, 10);
        });

        commentFilterChecked = $(`#self-module-activity-comment-filter-checked`).linkbutton({
        });
        commentFilterChecked.bind("click", () => {
            loadActivityCommentList(undefined, true, 0, 10);
        });

        commentFilterUnchecked = $(`#self-module-activity-comment-filter-uncheck`).linkbutton({
        });
        commentFilterUnchecked.bind("click", () => {
            loadActivityCommentList(undefined, false, 0, 10);
        });
        /*delBtn&pasBtn 审核与删除评论*/
        delBtn = $(`#self-module-activity-comment-toolbar-delete`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除评论"
        });
        delBtn.bind("click", () => {
            var checked = table.datagrid("getChecked");
            for (var i = 0; i < checked.length; i++) {
                deleteActivityCommentList(checked[i].id);
            }
        });
        pasBtn = $(`#self-module-activity-comment-toolbar-pass`).linkbutton({
            iconCls: "icon-ok",
            width: 100,
            text: "审核评论"
        });
        pasBtn.bind("click", () => {
            var checked = table.datagrid("getChecked");
            for (var i = 0; i < checked.length; i++) {
                checkComment(checked[i].id);
            }
        });
    }, destroyUI = () => {
        dynamicButtons.forEach((btn, index) => {
            btn.unbind("click");
        });
        dynamicButtons.length = 0; // 清空数组元素
        activityId = undefined;

        dialog.dialog("destroy");
        [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        [table, pager] = [];
        [dialog, delBtn, pasBtn, commentFilterAll, commentFilterChecked, commentFilterUnchecked] = [];
    };

    SELF.subscribe("activity-comment", (id) => {
        /* 页面被加载的处理 */
        initUI();
        loadActivityList("", 0, 10);
        loadActivityCommentList(id, undefined, 0, 10);
    });
})(this, $, layer, SELF);
