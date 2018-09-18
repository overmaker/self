((window, $, layer, SELF) => {
    SELF.registeredPopup("admin-upload", "module/system/admin-upload.html");
    let [dialog, nameTextBox, usernameTextBox, passwordTextBox, roleComboBox, dialogBtn] = [undefined, undefined, undefined, undefined, undefined, undefined];

    let [currentId] = [undefined];

    let insertAdmin = (name, role, username, password) => {
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
            xhr.open("POST", `/admin/admins`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`user-name=${username}&password=${password}&name=${name}&role=${role}`);
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
    }, addAdminVerification = (name, role, username, password) => {
        const [adminName, AdminRole, adminUsername, adminPassword] =
                [name, role, username, password];
        if (adminName === "" || adminName === null) {
            layer.msg("请输入姓名！");
            return "false";
        }

        if (adminUsername === "" || adminUsername === null) {
            layer.msg("请输入用户名！");
            return "false";
        }

        if (adminPassword === "" || adminPassword === null) {
            layer.msg("请输入密码！");
            return "false";
        }
        
        if (adminPassword.length < 8) {
            layer.msg("请输入最少8位密码！");
            return "false";
        }

        if (adminPassword === "" || adminPassword === null || AdminRole <= 0) {
            layer.msg("请选择角色！");
            return "false";
        }
    };


    SELF.subscribe("admin-upload", () => {
        let html = SELF.getPopupHtml("admin-upload");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建用户",
            width: 600,
            height: 400,
            closed: false,
            cache: false,
            modal: true,
            onClose: function () {
                /* 卸载对话框 */
                if (dialog) {
                    dialog.dialog("destroy");
                }
                dialog = undefined;

                if (dialogBtn) {
                    dialogBtn.unbind("click");
                }
                dialogBtn = undefined;
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
            width: 400
        });
        usernameTextBox.textbox("textbox").attr("maxlength", 30);

        passwordTextBox = $("#self-text-admin-password").textbox({
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

        dialogBtn = $("#self-btn-admin-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

        window.Promise.all([loadAllRole()]).then((list) => {
            let typeList = [];
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].v1.length; j++) {
                    let name = list[i].v1[j]["name"];
                    let id = list[i].v1[j]["id"];
                    if (i === 0) {
                        typeList.push({
                            id: id,
                            text: name,
                            "selected": true
                        });
                    } else {
                        typeList.push({
                            id: id,
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
        });

        dialogBtn.bind("click", () => {

            /** 获取参数*/
            const name = nameTextBox.textbox("getValue");
            const username = usernameTextBox.textbox("getValue");
            const password = passwordTextBox.textbox("getValue");
            const role = roleComboBox.combobox("getValue");

            let result = addAdminVerification(name, role, username, password);
            if (result !== "false") {
                insertAdmin(name, role, username, password).then(() => {
                    dialog.dialog("close");
                    SELF.publish("load-admin-upload");
                }, error => {
                    if (error === 409) {
                        layer.msg("用户名已存在");
                    } else {
                        SELF.errorHandler(error);
                    }
                });
            }
        });

    });

})(this, $, layer, SELF);