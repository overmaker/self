((window, $, layer, SELF) => {
    SELF.registeredPopup("shipping-method-add", "module/shop/shipping-method-add.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, nameTextBox, logistics_companyTextBox, first_weightTextBox, dialogBtn, continue_weightTextBox, pathBtn] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    let [first_priceTextBox, continue_priceTextBox] = [undefined, undefined];
    let [shippingMethodPath, currentId] = [undefined, undefined];
    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    let insertShippingMethod = (name, logistics_company, first_weight, continue_weight, first_price, continue_price) => {
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
            xhr.open("POST", `/admin/shipping-method`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}&logistics_company=${logistics_company}&first_weight=${first_weight}&continue_weight=${continue_weight}&first_price=${first_price}&continue_price=${continue_price}`);
        });
    }, addShippingMethodVerification = (name, logistics_company, first_weight, continue_weight, first_price, continue_price) => {
        const [shippingMethodName, shippingMethodLogistics_company, shippingMethodFirst_weight, shippingMethodContinue_weight, shippingMethodFirst_price, shippingMethodContinue_price] =
                [name, logistics_company, first_weight, continue_weight, first_price, continue_price];
        if (shippingMethodName === "" || shippingMethodName === null) {
            layer.msg("请输入配送方式名称！");
            nameTextBox.textbox({
                required: true
            });
            return "false";
        }

        if (shippingMethodLogistics_company === "" || shippingMethodLogistics_company === null) {
            layer.msg("请输入物流公司！");
            return "false";
        }

        if (shippingMethodFirst_weight === "" || shippingMethodFirst_weight === null) {
            layer.msg("请输入首重量！");
            return "false";
        }

        if (shippingMethodContinue_weight === "" || shippingMethodContinue_weight === null) {
            layer.msg("请输入续重量！");
            return "false";
        }
        
        if (shippingMethodFirst_price <= 0 || shippingMethodFirst_price === null) {
            layer.msg("请输入首重价格！");
            return "false";
        }
        
        if (shippingMethodContinue_price <= 0 || shippingMethodContinue_price === null) {
            layer.msg("请输入续重价格！");
            return "false";
        }
        
    };


    SELF.subscribe("shipping-method-add", () => {
        let html = SELF.getPopupHtml("shipping-method-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建配送方式 ",
            width: 600,
            height: 460,
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

        dialogBtn = $("#self-btn-shipping-method-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

        dialogBtn.bind("click", () => {
            /*** 验证特殊字符*/
            if (/[~#^$@%&!*<>{}=；？?/、_【】—（）]/gi.test($("#self-text-shipping-method-name").textbox('getValue'))) {
                layer.msg("不能输入特殊字符！");
                return;
            }
            if (/[~#^$@%&!*<>{}=?/、_【】—（）]/gi.test($("#self-text-shipping-method-logistics_company").textbox('getValue'))) {
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
            
            if(shippingMethodPath === undefined){ shippingMethodPath = ""; }
            
            let result = addShippingMethodVerification(name, logistics_company, first_weight, continue_weight, first_price, continue_price);
            if (result !== "false") {
                insertShippingMethod(name, logistics_company, first_weight, continue_weight, first_price, continue_price);
            }
        });

    });

})(this, $, layer, SELF);