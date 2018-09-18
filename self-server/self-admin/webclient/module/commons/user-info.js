((window, $, layer, form, SELF) => {
    SELF.registeredModule("user-info", "module/commons/user-info.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let searchBox = undefined;

    let [searchName, searchNickname, searchMobile, searchEmail] = []; // 搜索条件

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    let requestUserInfoList = (offset, count, name, nickname, mobile, email, isVip, isVolunteer) => {
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
            let query = `/admin/user-info?offset=${offset}&count=${count}`;

            if (name && name.length > 0) {
                query += `&name=${name}`;
            }
            if (nickname && nickname.length > 0) {
                query += `&nickname=${nickname}`;
            }
            if (mobile && mobile.length > 0) {
                query += `&mobile=${mobile}`;
            }
            if (email && email.length > 0) {
                query += `&email=${email}`;
            }
            if (isVip === true) {
                query += `&isVip=${isVip}`;
            }
            if (isVolunteer === true) {
                query += `&isVolunteer=${isVolunteer}`;
            }
            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadUserInfoList = (offset, count, name, nickname, mobile, email, isVip, isVolunteer) => {
        pager.pagination("loading");
        requestUserInfoList(offset, count, name, nickname, mobile, email, isVip, isVolunteer).then(result => {
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

            dataList.forEach((data, index) => {
                genOPButton(data["id"], "", index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, genOPButton = (id, name, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 120,
            text: "详细"
        });
        edit.bind("click", () => {
            SELF.publish("user-info-particulars", id);
        });
        dynamicButtons.push(edit);
        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "user-info") {
            /* 页面被加载的处理 */
            table = $("#self-module-user").datagrid({
                columns: [[
                        {field: "photo", title: "", width: "220rem;", align: "center", formatter: (value, row, index) => {
                                return `<img width=180 height=120 src="${value}" style="margin-top: 10px; margin-bottom: 10px;" />`;
                            }},
                        {field: "nick-name", title: "昵称", width: "200rem;", align: "center"},
                        {field: "gender", title: "性别", width: "100rem;", align: "center", formatter: (value, row, index) => {
                                if (value === false) {
                                    return "女";
                                } else {
                                    return "男";
                                }
                            }},
                        {field: "modified-time", title: "上次登录时间", width: "220rem;", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
//                        {field: "vip", title: "是否是VIP", width: "150rem;", align: "center", formatter: (value, row, index) => {
//                                if (value === false) {
//                                    return "否";
//                                } else if (value === true) {
//                                    return "是";
//                                }
//                            }},
//                        {field: "volunteer", title: "是否是志愿者", width: "150rem;", align: "center", formatter: (value, row, index) => {
//                                if (value === false) {
//                                    return "否";
//                                } else if (value === true) {
//                                    return "是";
//                                }
//                            }},
                        {field: "mobile", title: "手机号", width: "200rem;", align: "center"},
                        {field: "email", title: "邮箱", width: "220rem;", align: "center"},
                        {field: "cc", title: "操作", width: "150rem;", align: "center", formatter: (value, row, index) => {
                                return `<span style='margin:5px 10px 5px 0px;' data-type="op-edit" data-id=${row["id"]} ></span>`;
                            }}
                    ]],
                toolbar: "#self-module-user-toolbar",
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
//                        let searchVip = document.getElementById("seach-user-vip").checked;
//                        let searchVolunteer = document.getElementById("seach-user-volunteer").checked;

                        loadUserInfoList((currentPageNumber - 1) * currentPageSize, currentPageSize, searchName, searchNickname, searchMobile, searchEmail, false, false);
                    }
                }
            });

            searchBox = $("#self-module-user-toolbar-search").searchbox({
                label: "检索条件",
                width: 500,
                height: 38,
                labelWidth: 100,
                labelAlign: "center",
                menu: "#mm",
                prompt: "输入检索条件",
                searcher: (value, name) => {
                    [searchName, searchNickname, searchMobile, searchEmail] = [];
                    [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                    if (name === "name") {
                        searchName = value.trim();
                    } else if (name === "nickname") {
                        searchNickname = value.trim();
                    } else if (name === "mobile") {
                        searchMobile = value.trim();
                    } else if (name === "email") {
                        searchEmail = value.trim();
                    }
//                    let searchVip = document.getElementById("seach-user-vip").checked;
//                    let searchVolunteer = document.getElementById("seach-user-volunteer").checked;

                    loadUserInfoList((currentPageNumber - 1) * currentPageSize, currentPageSize, searchName, searchNickname, searchMobile, searchEmail, false, false);
                }
            });

            loadUserInfoList((currentPageNumber - 1) * currentPageSize, currentPageSize, searchName, searchNickname, searchMobile, searchEmail, false, false);

            form.render("checkbox");
        }
    })("unload-module", moduleName => {
        if (moduleName === "user-info") {
            [searchName, searchNickname, searchMobile, searchEmail] = [];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            searchBox.searchbox("destroy");
        }
    })("load-user-info", () => {
        [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
//        let searchVip = document.getElementById("seach-user-vip").checked;
//        let searchVolunteer = document.getElementById("seach-user-volunteer").checked;
        loadUserInfoList((currentPageNumber - 1) * currentPageSize, currentPageSize, searchName, searchNickname, searchMobile, searchEmail, false, false);
    });
})(this, $, layer, layui.form, SELF);