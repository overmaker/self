((window, $, layer, SELF) => {
    SELF.registeredPopup("activity-list-management", "module/activity/activity-list-management.html");

    let [table, pager] = [];
    let [activityCombogrid, activityTable, activityPager, searchBox] = [];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [currentActivityPageNumber, currentActivityPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, emailBtn, mobileBtn, exportBtn] = [];
    let [searchName, searchMobile, searchEmail] = [];// 搜索条件

    let activityId = undefined;
    let aid = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestActivityListManagement = (activityId, name, mobile, email, offset, count) => {
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
            xhr.open("GET", `/admin/activity-userTicket/listManagement?id=${activityId}&name=${name}&mobile=${mobile}&email=${email}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadActivityListManagement = (activityId, name, mobile, email, offset, count) => {
        pager.pagination("loading");
        requestActivityListManagement(activityId, name, mobile, email, offset, count).then(result => {
            let dataList = result["v1"],
                    total = result["v2"];
            aid = result["v1"][0].activity.id;
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
    }, loadActivityListManagementEmail = () => {
        const xhr = new window.XMLHttpRequest();
        xhr.onloadstart = () => SELF.startLoadAnimation();
        xhr.onloadend = () => SELF.stopLoadAnimation();
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log(xhr.response);
            } else {
                reject(xhr.status);
            }
        };
        xhr.onerror = (evt) => {
            reject("error");
        };
        xhr.open("GET", `/admin/activity-userTicket/listManagement/email?id=${aid}`);
        xhr.responseType = "json";
        xhr.setRequestHeader("Accept", "application/json");
        xhr.send();
    }, loadActivityListManagementMobile = () => {
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
        xhr.open("GET", `/admin/activity-userTicket/listManagement/mobile?id=${aid}`);
        xhr.responseType = "json";
        xhr.setRequestHeader("Accept", "application/json");
        xhr.send();
    }, initUI = () => {
        let html = SELF.getPopupHtml("activity-list-management");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "名单管理",
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

        table = $("#self-module-activity-list-management").datagrid({
            columns: [[
                    {field: "name", title: "姓名", width: "20%", align: "center", formatter: (value, row, index) => value},
                    {field: "mobile", title: "手机", width: "20%", align: "center", formatter: (value, row, index) => value},
                    {field: "email", title: "邮箱", width: "20%", align: "center", formatter: (value, row, index) => value},
                    {field: "status", title: "状态", width: "20%", align: "center", formatter: (value, row, index) => value === true ? "已签到" : "未签到"},
                    {field: "enable", title: "票状态", width: "20%", align: "center", formatter: (value, row, index) => value === true ? "已生效" : "未生效"},
                    {field: "create-time", title: "报名时间", width: "20%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()}
//                    {field: "zzz", title: "操作", width: "20%", align: "center"}
                ]],
            toolbar: "#self-module-activity-list-management-toolbar",
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
                    loadActivityListManagement(aid, searchName, searchMobile, searchEmail, (currentPageNumber - 1) * currentPageSize, currentPageSize);
                }
            }
        });

        searchBox = $("#self-module-activity-list-management-toolbar-search").searchbox({
            label: "检索条件",
            width: 500,
            height: 38,
            labelWidth: 100,
            labelAlign: "center",
            menu: "#mm",
            prompt: "输入检索条件",
            searcher: (value, name) => {
                [searchName, searchMobile, searchEmail] = [];
                [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                if (name === "name") {
                    searchName = value.trim();
                    searchMobile = "";
                    searchEmail = "";
                } else if (name === "mobile") {
                    searchName = "";
                    searchMobile = value.trim();
                    searchEmail = "";
                } else if (name === "email") {
                    searchName = "";
                    searchMobile = "";
                    searchEmail = value.trim();
                }

                loadActivityListManagement(aid, searchName, searchMobile, searchEmail, (currentPageNumber - 1) * currentPageSize, currentPageSize);
            }
        });

        emailBtn = $(`#self-module-activity-list-management-toolbar-email`).linkbutton({
            width: 100,
            height: 40,
            text: "邮件群发"
        });
        emailBtn.bind("click", () => {
            loadActivityListManagementEmail();
        });

        mobileBtn = $(`#self-module-activity-list-management-toolbar-mobile`).linkbutton({
            width: 100,
            height: 40,
            text: "短信群发"
        });
        mobileBtn.bind("click", () => {
            loadActivityListManagementMobile();
        });

        exportBtn = $(`#self-module-activity-list-management-toolbar-excel`).linkbutton({
            width: 100,
            height: 40,
            text: "导出名单"
        });
        exportBtn.bind("click", () => {
            const uri = `/admin/activity-userTicket/listManagement/export?id=${aid}&name=${searchName}&mobile=${searchMobile}&email=${searchEmail}`;
            window.open(uri);
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
        [dialog, exportBtn] = [];
    };

    SELF.subscribe("activity-list-management", (activityId) => {
        /* 页面被加载的处理 */
        initUI();
        loadActivityListManagement(activityId, "", "", "", 0, 10);
    });
})(this, $, layer, SELF);
