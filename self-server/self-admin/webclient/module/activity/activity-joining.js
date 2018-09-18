((window, $, layer, layuiElement, SELF) => {

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

    let [searchBox] = [];

    const dynamicButtons = [];
    
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
            xhr.open("PUT", `/admin/activity/list?is-joining=true&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            let obj = {
                title: title,
                publish: true
            };
            xhr.send(JSON.stringify(obj));
        });
    }, loadActivityList = (title, offset, count) => {
        pager.pagination("loading");
        requestActivityList(title, offset, count).then(result => {
            table.datagrid("loadData", result["v1"]);
            pager.pagination({
                total: result["v2"],
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });
            
            $("#activity-badge-joining").text(result["v2"]);

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
    }, genOPButton = (id, name, index) => {
        const view = $(`#self-admin-module span[data-type=op-view][data-id=${id}]`).linkbutton({
            iconCls: "icon-more",
            width: 80,
            text: "查看"
        });
        view.bind("click", () => {
        });
        
        const copy = $(`#self-admin-module span[data-type=op-copy][data-id=${id}]`).linkbutton({
            iconCls: "icon-print",
            width: 80,
            text: "复制"
        });

        copy.bind("click", () => {
            SELF.publish("activity-copy", id);
        });
        
        const qr = $(`#self-admin-module span[data-type=op-qr][data-id=${id}]`).linkbutton({
            iconCls: "icon-qr",
            width: 120,
            text: "签到二维码"
        });
        qr.bind("click", () => {
            const activityId = qr.attr("data-id"),
                    title = qr.attr("data-title");
            const uri = `/admin/activity/qr-code?id=${activityId}&title=${title}`;
            window.open(uri);
        });

        dynamicButtons.push(view, copy, qr);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "activity") {
            table = $("#self-module-activity-joining").datagrid({
                columns: [[
                        {field: "thumbnail", title: "活动封面图", width: "220rem;", align: "center", formatter: (value, row, index) => {
                                return `<img width=180 height=120 src="${value}" style="margin-top: 10px; margin-bottom: 10px;" />`;
                            }},
                        {field: "title", title: "活动标题", width: "360rem;", formatter: (value, row, index) => {
                                let html = `<p style="margin-bottom: 15%;">${value}</p><p>免费</p>`;
                                return html;
                            }},
                        {field: "start-time", title: "活动时间", width: "220rem;", align: "center", formatter: (value, row, index) => new Date(row["start-time"]).toLocaleString() + "<br>到<br>" + new Date(row["end-time"]).toLocaleString()},
                        {field: "live", title: "是否直播", width: "100rem;", align: "center", formatter: (value, row, index) => value === true ? "是" : "否"},
                        {field: "self-plus", title: "self+活动", width: "100rem;", align: "center", formatter: (value, row, index) => value === true ? "是" : "否"},
                        {field: "publish-time", title: "发布时间", width: "220rem;", align: "center", formatter: (value, row, index) => row["publish"] === true ? new Date(row["publish-time"]).toLocaleString() : ""},
                        {field: "xxx", title: "操作", width: "150rem;", align: "left", formatter: (value, row, index) => {
                                let str = ``;
                                str += `<div><span style="margin:5px 10px 5px 0px;" data-type="op-view" data-id=${row["id"]}></span></div>`;
                                str += `<div><span style="margin:5px 10px 5px 0px;" data-type="op-qr" data-id=${row["id"]} data-title=${row["title"]} ></span></div>`;
                                str += `<div><span style="margin:5px 10px 5px 0px;" data-type="op-copy" data-id=${row["id"]}></span></div>`;
                                return str;
                            }}
                    ]],
                toolbar: "#self-module-activity-joining-toolbar",
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
                        loadActivityList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-activity-joining-toolbar-name").searchbox({
                label: "活动标题",
                width: 400,
                labelWidth: 100,
                height: 38,
                labelAlign: "center",
                searcher: (value, name) => {
                    loadActivityList(value.trim(), 0, 10);
                }
            });

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

            searchBox.searchbox("destroy");
            searchBox = undefined;

            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
        }
    })("activity-tab-changed", () => {
        if (table) {
            table.datagrid("resize");
        }
    });
})(this, $, layer, layui.element, SELF);
