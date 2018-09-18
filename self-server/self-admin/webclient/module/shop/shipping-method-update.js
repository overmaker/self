((window, $, layer, SELF) => {
    SELF.registeredPopup("shipping-method-update", "module/shop/shipping-method-add.html");

    let[dialog,
        nameTextBox, logistics_companyTextBox, continue_priceTextBox,
        first_weightTextBox, continue_weightTextBox, first_priceTextBox,
        okBtn
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined];

    const initUI = () => {
        const html = SELF.getPopupHtml("shipping-method-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑配送方式",
            width: 600,
            height: 460,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });
        
        nameTextBox = $("#self-text-shipping-method-name").textbox({
            label: "配送方式名称：",
            width: 450,
            labelWidth: 100
        });
            
        logistics_companyTextBox = $("#self-text-shipping-method-logistics_company").textbox({
            label: "物流公司：",
            width: 450,
            labelWidth: 100
        });
            
        first_weightTextBox = $("#self-text-shipping-method-first_weight").textbox({
            label: "首重量：",
            width: 450,
            labelWidth: 100
        });
            
        continue_weightTextBox = $("#self-text-shipping-method-continue_weight").textbox({
            label: "续重量：",
            labelWidth: 100,
            width: 450
        });
            
        first_priceTextBox = $("#self-text-shipping-method-first_price").textbox({
            label: "首重价格：",
            labelWidth: 100,
            width: 450
        });

        continue_priceTextBox = $("#self-text-shipping-method-continue_price").textbox({
            label: "续重价格：",
            labelWidth: 100,
            width: 450
        });

        okBtn = $("#self-btn-shipping-method-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        nameTextBox.textbox("destroy");
        logistics_companyTextBox.textbox("destroy");
        first_weightTextBox.textbox("destroy");
        continue_weightTextBox.textbox("destroy");
        first_priceTextBox.textbox("destroy");
        continue_priceTextBox.textbox("destroy");
        okBtn.unbind("click");
        dialog.dialog("destroy");

        [dialog,
        nameTextBox, logistics_companyTextBox, continue_priceTextBox,
        first_weightTextBox, continue_weightTextBox, first_priceTextBox,
        okBtn
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined];
    }, requestShippingMethod = id => {
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
            xhr.open("GET", `/admin/shipping-method/find/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadShippingMethod = id => {
        requestShippingMethod(id).then(shippingMethod => {
            nameTextBox.textbox("setValue", shippingMethod.name);
            logistics_companyTextBox.textbox("setValue", shippingMethod.logistics_company);
            first_weightTextBox.textbox("setValue", shippingMethod.first_weight);
            continue_weightTextBox.textbox("setValue", shippingMethod.continue_weight);
            first_priceTextBox.textbox("setValue", shippingMethod.first_price);
            continue_priceTextBox.textbox("setValue", shippingMethod.continue_price);
            
            okBtn.bind("click", () => {
                submitShippingMethod(id);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateShippingMethod = (name, logistics_company, first_weight, continue_weight, first_price, continue_price, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-shipping-method-add");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/shipping-method/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}&logistics_company=${logistics_company}&first_weight=${first_weight}&continue_weight=${continue_weight}&first_price=${first_price}&continue_price=${continue_price}`);
        });
    }, submitShippingMethod = (id) => {
        /*** 验证特殊字符*/
        if (/[~#^$@%&!*<>{}=；？?/、_【】—（）]/gi.test(nameTextBox.textbox('getValue'))) {
            layer.msg("不能输入特殊字符！");
            return;
        }
        if (/[~#^$@%&!*<>{}=?/、_【】—（）]/gi.test(logistics_companyTextBox.textbox('getValue'))) {
            layer.msg("不能输入特殊字符！");
            return;
        }

        /** 获取参数*/
        const name = nameTextBox.textbox("getValue");
        const logistics_company = logistics_companyTextBox.textbox("getValue");
        const first_weight = first_weightTextBox.textbox("getValue");
        const continue_weight = continue_weightTextBox.textbox("getValue");
        const first_price = first_priceTextBox.textbox("getValue");
        const continue_price = continue_priceTextBox.textbox("getValue");
        
        updateShippingMethod(name, logistics_company, first_weight, continue_weight, first_price, continue_price, id);
    };

    SELF.subscribe("shipping-method-update", id => {
        initUI();
        loadShippingMethod(id);
    });
})(this, $, layer, SELF);