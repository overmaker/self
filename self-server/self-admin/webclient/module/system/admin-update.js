((window, $, layer, SELF) => {
    SELF.registeredPopup("admin-update", "module/system/admin-upload.html");

    let[dialog,
        nameTextBox, usernameTextBox, passwordTextBox,
        roleComboBox, okBtn
    ] = [undefined,
        undefined, undefined, undefined, 
        undefined, undefined];
    
    let userId = undefined;

    const initUI = () => {
        const html = SELF.getPopupHtml("admin-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑 ",
            width: 600,
            height: 400,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });
        
        nameTextBox = $("#self-text-admin-name").textbox({
            label: "姓名：",
            labelWidth: 100,
            width: 400
        });
        nameTextBox.textbox("textbox").attr("maxlength", 30);
        
        usernameTextBox = $("#self-text-admin-username").textbox({
            label: "用户名：",
            labelWidth: 100,
            readonly: true,
            width: 400
        });
        usernameTextBox.textbox("textbox").attr("maxlength", 30);
        
        passwordTextBox = $("#self-text-admin-password").passwordbox({
            label: "密码：",
            labelWidth: 100,
            width: 400
        });
        passwordTextBox.textbox("textbox").attr("maxlength", 30);
        
        roleComboBox = $("#self-text-admin-role").combobox({
            label: "角色",
            labelWidth: 100,
            width: 400,
            panelHeight: 140,
            editable: false
        });
        
        okBtn = $("#self-btn-admin-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        userId = undefined;
        
        nameTextBox.textbox("destroy");
        usernameTextBox.textbox("destroy");
        passwordTextBox.passwordbox("destroy");
        roleComboBox.combobox("destroy");
        okBtn.unbind("click");
        dialog.dialog("destroy");

    [dialog,
        nameTextBox, usernameTextBox, passwordTextBox,
        roleComboBox, okBtn
    ] = [undefined,
        undefined, undefined, undefined, 
        undefined, undefined];
    }, requestAdmin = id => {
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
            xhr.open("GET", `/admin/admins/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadAdmin = () => {
        requestAdmin(userId).then(admin => {
            nameTextBox.textbox("setValue", admin["name"]);
            usernameTextBox.textbox("setValue", admin["user-name"]);
            passwordTextBox.passwordbox("setValue", admin["password"]);
            if (admin["role-id"] && admin["role-id"] !== null) {
                roleComboBox.combobox("setValue", admin["role-id"]);
            }
            
            okBtn.bind("click", () => {
                submitAdmin(userId);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateAdmin = (name, role, password, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-admin-upload");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            console.log(role);
            xhr.open("PUT", `/admin/admins/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`password=${password}&name=${name}&role=${role}`);
        });
    }, loadAllRole = () => {
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
            xhr.open("GET", `/admin/roles?offset=0&count=1000`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, addAdminVerification = (name,role,password) => {
        const [adminName, AdminRole, adminPassword] =
                [name,role,password];
        if (adminName === "" || adminName === null) {
            layer.msg("请输入姓名！");
            return "false";
        }
        
        if (adminPassword === "" || adminPassword === null) {
            layer.msg("请输入密码！");
            return "false";
        }
        
        if (adminPassword === "" || adminPassword === null || AdminRole <= 0) {
            layer.msg("请选择角色！");
            return "false";
        }
    }, submitAdmin = (id) => {

        /** 获取参数*/
        const name = nameTextBox.textbox("getValue");
        const password = passwordTextBox.textbox("getValue");
        const role = roleComboBox.combobox("getValue");
        
        let result = addAdminVerification(name,role,password);
        if (result !== "false") {
            updateAdmin(name,role,password, id);
        }
    };

    SELF.subscribe("admin-update", id => {
        initUI();
        window.Promise.all([loadAllRole()]).then(list => {
            let typeList = [];
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].v1.length; j++) {
                    let name = list[i].v1[j]["name"];
                    let ids = list[i].v1[j]["id"];
                    if (i === 0) {
                        typeList.push({
                            id: ids,
                            text: name
                        });
                    } else {
                        typeList.push({
                            id: ids,
                            text: name
                        });
                    }
                }
                roleComboBox.combobox({
                    valueField: "id",
                    textField: "text",
                    data: typeList
                });
            }
            
            userId = id;
            loadAdmin();
        }, error => {
            SELF.errorHandler(error);
        });
    });
})(this, $, layer, SELF);