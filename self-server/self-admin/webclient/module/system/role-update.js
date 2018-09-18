((window, $, layer, SELF) => {
    SELF.registeredPopup("role-update", "module/system/role-upload.html");

    let [dialog, nameTextBox, roleTable, okBtn] = [undefined, undefined, undefined, undefined];

    let data = [];
    
    let roleId = undefined;

    const initUI = () => {
        let html = SELF.getPopupHtml("role-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑角色",
            width: 820,
            height: 600,
            closed: false,
            maximizable: true,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });
        
        nameTextBox = $("#self-role-name").textbox({
            label: "角色名",
            prompt: "请填写角色名称，不要超过15字，必填",
            width: "100%",
            labelWidth: 100
        });
        nameTextBox.textbox("textbox").attr("maxlength", 15);

        roleTable = $("#self-role-property").propertygrid({
            showGroup: true,
            scrollbarSize: 0,
            columns: [[
                    {field: "name", title: "权限名", width: 80, sortable: false, resizable: false},
                    {field: "value", title: "授权", width: 100, sortable: false, resizable: false, formatter: (value, row, index) => {
                            return value === 0 ? "未授权" : "已授权";
                        }, styler: (value, row, index) => {
                            return value === 0 ? "color:red;" : "color:green;";
                        }}
                ]]
        });

        okBtn = $("#self-role-ok-btn").linkbutton({
            text: "确定",
            width: "100%"
        });
        
        okBtn.bind("click", () => {
            if (nameTextBox.textbox("getValue") === null || nameTextBox.textbox("getValue") === "") {
                layer.msg("请输入角色名！");
                return "false";
            }
            
            let modules = data.
                    filter(item => item["value"] === 1).
                    map(item => {
                        return {
                            name: item["key"]
                        };
                    });
            let role = {
                id: roleId,
                name: nameTextBox.textbox("getValue"),
                modules: modules
            };
            update(role);
        });
        
    }, destoryUI = () => {
        okBtn.unbind("click");
        nameTextBox.textbox("destroy");
        dialog.dialog("destroy");
        
        [dialog, nameTextBox, roleTable, okBtn] = [undefined, undefined, undefined, undefined];
        
        data = [];
        
        roleId = undefined;
    }, requestModules = roleId => {
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
            xhr.open("GET", `/admin/roles/${roleId}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadModules = roleId => {
        requestModules(roleId).then(result => {
            let roleName = result["name"];
            nameTextBox.textbox("setValue", roleName);
            data = result["modules"].map(item => {
                return {
                    name: item["display-name"],
                    group: item["group"],
                    key: item["name"],
                    value: item["grant"],
                    editor: {type: "moduleEditor"}
                };
            });
            roleTable.propertygrid({
                data: data
            });
            
            dialog.dialog("doLayout");
        }, error => {
            SELF.errorHandler(error);
        });
    }, requestUpdate = role => {
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
            xhr.open("PUT", "/admin/roles");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(role));
        });
    }, update = role => {
        requestUpdate(role).then(() => {
            dialog.dialog("close");
            SELF.publish("role-refresh");
        }, error => {
            SELF.errorHandler(error);
        });
    };

    SELF.subscribe("role-update", id => {
        roleId = id;
        initUI();
        loadModules(roleId);
    });
})(this, $, layer, SELF);
