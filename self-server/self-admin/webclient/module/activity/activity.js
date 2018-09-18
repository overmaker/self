((window, $, layer, layuiElement, SELF) => {
    SELF.registeredModule("activity", "module/activity/activity.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

    let [searchBox, commentBtn] = [];

    const dynamicButtons = [];
    const dynamicCommentMenus = [];

    let requestActivityList = (title, offset, count) => {
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
        pager.pagination("loading");
        requestActivityList(title, offset, count).then(result => {

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });
            dynamicButtons.length = 0; // 清空数组元素
            
            dynamicCommentMenus.forEach((menu, index) => {
                menu.menu("destroy");
            });
            dynamicCommentMenus.length = 0; // 清空数组元素
            
            table.datagrid("loadData", result["v1"]);
            pager.pagination({
                total: result["v2"],
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });

            $("#activity-badge-total").text(result["v2"]);

            result["v1"].forEach((data, index) => {
                genOPButton(data["id"], index);
                table.datagrid("expandRow", index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, requestActivityCommentList = (activityId, enable, offset, count) => {
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
    }, loadActivityCommentList = (table, pager, pageNumber, pageSize, activityId, enable, offset, count) => {
        pager.pagination("loading");
        requestActivityCommentList(activityId, enable, offset, count).then(result => {
            let dataList = result["v1"],
                    total = result["v2"];
            table.datagrid("loadData", dataList);
            pager.pagination({
                total: total,
                pageNumber: pageNumber,
                pageSize: pageSize
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, deleteComment = id => {
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
                    resolve();
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
    }, genOPButton = (id, index) => {
        const edit = $(`#self-admin-module button[data-type=op-edit][data-id="${id}"]`);
        edit.bind("click", () => {
            SELF.nav("activity-update", id);
        });

        const copy = $(`#self-admin-module button[data-type=op-copy][data-id="${id}"]`);
        copy.bind("click", () => {
            SELF.publish("activity-copy", id);
        });

        const view = $(`#self-admin-module button[data-type=op-view][data-id="${id}"]`);
        view.bind("click", () => {
            SELF.nav("activity-view", id);
        });

        const qr = $(`#self-admin-module button[data-type=op-qr][data-id="${id}"]`);
        qr.bind("click", () => {
            const activityId = qr.attr("data-id"),
                    title = qr.attr("data-title");
            const uri = `/admin/activity/qr-code?id=${activityId}&title=${title}`;
            window.open(uri);
        });
        
        const listManagement = $(`#self-admin-module button[data-type=op-list-management][data-id="${id}"]`);
        listManagement.bind("click", () => {
            const activityId = listManagement.attr("data-id");
            SELF.publish("activity-list-management", activityId);
        });
        
//        const commentbutton = $(`#self-admin-module span[data-type=op-comment-view][data-id="${id}"]`).menubutton({
//            iconCls: "icon-about-setting",
//            menu: $(`#self-admin-module div[data-type=op-comment-menu][data-id=${id}]`)
//        });

        const commentbutton = $(`#self-admin-module button[data-type=op-comment-view][data-id="${id}"]`);
        commentbutton.bind("click", () => {
            const activityId = commentbutton.attr("data-id");
            SELF.publish("activity-comment", activityId);
        });
        
        let [commentPageNumber, commentPageSize] = [1, 10];
        let commentFilter = undefined;
        const commentTable = $(`#op-comment-table-${id}`).datagrid({
            columns: [[
                    {field: "xxx", title: "", width: "10%", align: "center", checkbox: true},
                    {field: "yyy", title: "", width: "60%", align: "left", formatter: (value, row, index) => {
                            let html = `<div style="margin-top: 5px;margin-left: 10px;">` +
                                    `<p style="line-height: 25px; color:#C0C0C0;">${row["user"]["user-name"]}</p>` +
                                    `<p style="line-height: 25px;">${row["comment"]}</p>` +
                                    `<p style="line-height: 25px; color:#C0C0C0;">${new Date(row ["create-time"]).toLocaleString()}</p>` +
                                    `</div>`;
                            return html;
                        }},
                    {field: "create-time", title: "评论时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                    {field: "enable", title: "审核状态", width: "10%", align: "center", formatter: (value, row, index) => value === true ? "审核通过" : "待审核"}
                ]],
            toolbar: `#op-comment-toolbar-${id}`,
            rownumbers: true,
            pagination: true,
            fitColumns: true,
            fit: true
        });
//        const commentPager = commentTable.datagrid("getPager");
//        commentPager.pagination({
//            onSelectPage: (pageNumber, pageSize) => {
//                if (pageNumber > 0) {
//                    [commentPageNumber, commentPageSize] = [pageNumber, pageSize];
//                    loadActivityCommentList(commentTable, commentPager, commentPageNumber, commentPageSize, id, commentFilter, (commentPageNumber - 1) * commentPageSize, commentPageSize);
//                }
//            }
//        });
//        $(`#op-comment-toolbar-${id}`).removeClass("menu-item"); // 祛除菜单项效果，免得单击后菜单消失
        
        let loaded = false;
//        let commentMenu = $(commentbutton.menubutton("options").menu).menu({
//            onShow: () => {
//                if (loaded === false) {
//                    loadActivityCommentList(commentTable, commentPager, commentPageNumber, commentPageSize, id, commentFilter, (commentPageNumber - 1) * commentPageSize, commentPageSize);
//                    loaded = true;
//                }
//            }
//        });
//        dynamicCommentMenus.push(commentMenu);
//        const commentFilterAll = $(`#op-comment-toolbar-filter-all-${id}`);
//        commentFilterAll.bind("click", () => {
//            commentFilter = undefined;
//            [commentPageNumber, commentPageSize] = [1, 10];
//            loadActivityCommentList(commentTable, commentPager, commentPageNumber, commentPageSize, id, commentFilter, (commentPageNumber - 1) * commentPageSize, commentPageSize);
//        });
        
//        const commentFilterChecked = $(`#op-comment-toolbar-filter-checked-${id}`);
//        commentFilterChecked.bind("click", () => {
//            commentFilter = true;
//            [commentPageNumber, commentPageSize] = [1, 10];
//            loadActivityCommentList(commentTable, commentPager, commentPageNumber, commentPageSize, id, commentFilter, (commentPageNumber - 1) * commentPageSize, commentPageSize);
//        });
//        
//        const commentFilterUncheck = $(`#op-comment-toolbar-filter-uncheck-${id}`);
//        commentFilterUncheck.bind("click", () => {
//            commentFilter = false;
//            [commentPageNumber, commentPageSize] = [1, 10];
//            loadActivityCommentList(commentTable, commentPager, commentPageNumber, commentPageSize, id, commentFilter, (commentPageNumber - 1) * commentPageSize, commentPageSize);
//        });
        
        const commentAllPass = $(`#op-comment-toolbar-allpass-${id}`).linkbutton({
            iconCls: "icon-ok",
            width: 100,
            text: "审核通过"
        });
//        commentAllPass.bind("click", () => {
//            const checked = commentTable.datagrid("getChecked");
//            if (checked.length === 0) {
//                return;
//            }
//            const arr = [];
//            for (let i = 0; i < checked.length; i++) {
//                arr.push(checkComment(checked[i]["id"]));
//            }
//            window.Promise.all(arr).then(() => {
//                layer.msg("审核成功");
//            }, error => {
//                SELF.errorHandler(error);
//            }).finally(() => {
//                [commentPageNumber, commentPageSize] = [1, 10];
//                loadActivityCommentList(commentTable, commentPager, commentPageNumber, commentPageSize, id, commentFilter, (commentPageNumber - 1) * commentPageSize, commentPageSize);
//            });
//        });
        
        const commentAllDel = $(`#op-comment-toolbar-alldel-${id}`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除评论"
        });
//        commentAllDel.bind("click", () => {
//            const checked = commentTable.datagrid("getChecked");
//            if (checked.length === 0) {
//                return;
//            }
//            const arr = [];
//            for (let i = 0; i < checked.length; i++) {
//                arr.push(deleteComment(checked[i]["id"]));
//            }
//            window.Promise.all(arr).then(() => {
//                layer.msg("删除成功");
//            }, error => {
//                SELF.errorHandler(error);
//            }).finally(() => {
//                [commentPageNumber, commentPageSize] = [1, 10];
//                loadActivityCommentList(commentTable, commentPager, commentPageNumber, commentPageSize, id, commentFilter, (commentPageNumber - 1) * commentPageSize, commentPageSize);
//            });
//        });
//
//        dynamicButtons.push(edit, copy, view, qr, commentFilterAll, commentFilterChecked, commentFilterUncheck, commentAllPass, commentAllDel);

        table.datagrid("fixRowHeight", index);
    }, copyActivity = id => {
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
            xhr.open("POST", `/admin/activity/copy`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`id=${id}`);
        });
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "activity") {
            /* 页面被加载的处理 */
            $("#self-module-activity-panel").panel();
            table = $("#self-module-activity").datagrid({
                columns: [[
                        {field: "thumbnail", title: "封面图", width: "220rem;", align: "center", formatter: (value, row, index) => {
                                return `<img width=180 height=120 src="${value}" style="margin-top: 10px; margin-bottom: 10px;" />`;
                            }},
                        {field: "title", title: "活动标题", width: "380rem;", formatter: (value, row, index) => {
                                let html = `<p style="margin-bottom: 15%;">${value}</p><p>免费</p>`;
                                return html;
                            }},
                        {field: "info", title: "已报名", width: "100rem;", align: "center", formatter: (value, row, index) => {
                                let html = `${value["roll-num"]}/${row["max-num"]}`;
                                return html;
                            }},
                        {field: "start-time", title: "活动时间", width: "220rem;", align: "center", formatter: (value, row, index) => new Date(row["start-time"]).toLocaleString() + "<br>到<br>" + new Date(row["end-time"]).toLocaleString()},
//                        {field: "live", title: "是否直播", width: "100rem;", align: "center", formatter: (value, row, index) => value === true ? "是" : "否"},
//                        {field: "type", title: "活动类型", width: "120rem;", align: "center", formatter: (value, row, index) => value["name"]},
                        {field: "publish", title: "状态", width: "100rem;", align: "center", formatter: (value, row, index) => value === true ? "已发布" : "草稿", styler: (value, row, index) => value === true ? "color:green;" : "color:red;"},
                        {field: "publish-time", title: "发布时间", width: "220rem;", align: "center", formatter: (value, row, index) => row["publish"] === true ? new Date(row["publish-time"]).toLocaleString() : ""}
                    ]],
                toolbar: "#self-module-activity-toolbar",
                rownumbers: true,
                pagination: true,
                fitColumns: true,
                singleSelect: true,
                fit: true,
                view: detailview,
                detailFormatter: (index, row) => {
                    let html = `<div class="layui-btn-container" style="float: right;">`;
                    html += `<button class="layui-btn layui-btn-normal" data-type="op-view" style="margin-bottom: 0px;" data-id="${row["id"]}">查看</button>`;
                    if (row["publish"] === true) {
                        html += `<button class="layui-btn layui-btn-normal" data-type="op-qr" style="margin-bottom: 0px;" data-id="${row["id"]}" data-title="${row["title"]}">签到二维码</button>`;
                        html += `<button class="layui-btn layui-btn-normal" data-type="op-copy" style="margin-bottom: 0px;" data-id="${row["id"]}">复制</button>`;
                    }
                    html += `<button class="layui-btn layui-btn-normal" data-type="op-edit" style="margin-bottom: 0px;" data-id="${row["id"]}">编辑</button>`;
                    html += `<button class="layui-btn layui-btn-normal" data-type="op-list-management" style="margin-bottom: 0px;" data-id="${row["id"]}">名单管理</button>`;
                    html += `<button class="layui-btn layui-btn-normal" data-type="op-comment-view" style="margin-bottom: 0px;" data-id="${row["id"]}">管理评论</button>`;
//                    html += `<span data-type="op-comment-view" data-id="${row["id"]}">管理评论</span>`;
//                    html += `<div style="width: 800px; height: 400px;" data-type="op-comment-menu" data-id=${row["id"]}>` +
//                                `<div id="op-comment-table-${row["id"]}"></div>` +
//                                    `<div id="op-comment-toolbar-${row["id"]}">` +
//                                        `<button id="op-comment-toolbar-filter-all-${row["id"]}" class="layui-btn layui-btn-primary layui-btn-xs">全部</button>` +
//                                        `<button id="op-comment-toolbar-filter-checked-${row["id"]}" class="layui-btn layui-btn-primary layui-btn-xs">审核通过</button>` +
//                                        `<button id="op-comment-toolbar-filter-uncheck-${row["id"]}" class="layui-btn layui-btn-primary layui-btn-xs">待审核</button>` +
//                                        `<span id="op-comment-toolbar-allpass-${row["id"]}" />` +
//                                        `<span id="op-comment-toolbar-alldel-${row["id"]}" />` +
//                                    `</div>`;
//                    html += `</div>`;
                    return html;
                }
            });
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadActivityList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-activity-toolbar-name").searchbox({
                label: "活动标题",
                width: 400,
                labelWidth: 100,
                height: 38,
                labelAlign: "center",
                prompt: "输入活动标题",
                searcher: (value, name) => {
                    loadActivityList(value.trim(), 0, 10);
                }
            });
            
//            commentBtn = $("#self-module-activity-toolbar-comment").linkbutton({
//                text: "评论管理",
//                iconCls: "icon-about-setting"
//            });
//            commentBtn.bind("click", () => {
//                SELF.publish("activity-comment");
//            });

            loadActivityList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "activity") {
            /* 卸载动作 */

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });
            dynamicButtons.length = 0; // 清空数组元素
            
            dynamicCommentMenus.forEach((menu, index) => {
                menu.menu("destroy");
            });
            dynamicCommentMenus.length = 0; // 清空数组元素

            searchBox.searchbox("destroy");
            searchBox = undefined;

            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        }
    })("activity-copy", id => {
        layer.confirm("复制的活动是未发布状态，是否复制？", {icon: 3, title: null}, function (index) {
            layer.close(index);
            let i = layer.load(1);
            copyActivity(id).then(result => {
                layer.close(i);
                SELF.publish("activity-copy-complete");
            }, error => {
                layer.close(i);
                SELF.errorHandler(error);
            });
        });
    })("activity-tab-changed", () => {
        if (table) {
            table.datagrid("resize");
        }
    });

    layuiElement.on("tab(activity-tab)", data => {
        SELF.publish("activity-tab-changed");
    });
})(this, $, layer, layui.element, SELF);
