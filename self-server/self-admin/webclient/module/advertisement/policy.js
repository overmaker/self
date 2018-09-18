((window, $, layer, SELF) => {
    SELF.registeredModule("policy", "module/advertisement/policy.html");

    let [table, pager] = [undefined, undefined];
    let [dialog, dialogBtn] = [undefined, undefined];

    let currentId = undefined; 
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestPolicyList = () => {
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
            xhr.open("GET", `/admin/policy/selectAll`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadPolicyList = () => {
        requestPolicyList().then(result => {
            let dataList = result;
            table.datagrid("loadData", dataList);

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            currentId = undefined;

            dataList.forEach((data, index) => {
                genOPButton(data["id"], data['name'], index);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, genOPButton = (id, name, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 100,
            text: "编辑"
        });
        edit.bind("click", () => {
            SELF.publish("policy-update",id);
        });

        dynamicButtons.push(edit);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "policy") {
            /* 页面被加载的处理 */
            table = $("#self-module-policy").datagrid({
                columns: [[
                        {field: "create-time", title: "创建时间", width: "25%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "modified-time", title: "修改时间", width: "25%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "title", title: "标题", width: "25%", align: "center"},
                        {field: "xxx", title: "操作", width: "25%", align: "center", formatter: (value, row, index) => {
                                return `<span style="margin:5px 10px 5px 0px;" data-text=${row["name"]} data-type="op-edit" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                rownumbers: true,
                fitColumns: true,
                singleSelect: true,
                height: "100%"
            });

            loadPolicyList();
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "policy") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
        }
    })("load-policy-update", () => {
        loadPolicyList();
    });
})(this, $, layer, SELF);