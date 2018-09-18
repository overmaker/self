((window, $, layer, SELF) => {
    SELF.registeredPopup("order-view", "module/shop/order-view.html");
    
    let [dialog,
        snTextBox, addressTextBox, zipCodeTextBox, 
        amountPriceTextBox, amountScoreTextBox, paymentMethodTextBox, 
        shippingMethodTextBox, userTextBox, mobileTextBox,
        orderStatusTextBox, paymentStatusTextBox, shippingStatusTextBox,
        feeTextBox, consigneeTextBox, table,
        fokBtn, wokBtn,
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined, 
        undefined, undefined];
    
    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    const initUI = () => {
        const html = SELF.getPopupHtml("order-view");
        dialog = $(html).appendTo("body").dialog({
            title: "查看订单",
            width: 660,
            height: 660,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });
        snTextBox = $("#self-text-order-sn").textbox({
            label: "订单编号：",
            labelWidth: 100,
            width: 450,
            readonly: true
        });
        
        addressTextBox = $("#self-text-order-address").textbox({
            label: "收货地址：",
            labelWidth: 100,
            width: 450,
            readonly: true
        });
        
        zipCodeTextBox = $("#self-text-order-zipCode").textbox({
            label: "邮编：",
            width: 450,
            labelWidth: 100,
            readonly: true
        });
            
        consigneeTextBox = $("#self-text-order-consignee").textbox({
            label: "收货人：",
            width: 450,
            labelWidth: 100,
            readonly: true
        });
            
        amountPriceTextBox = $("#self-text-order-amountPrice").textbox({
            label: "订单金额：",
            width: 450,
            labelWidth: 100,
            readonly: true
        });
            
        amountScoreTextBox = $("#self-text-order-amountScore").textbox({
            label: "订单积分：",
            width: 450,
            labelWidth: 100,
            readonly: true
        });

        paymentMethodTextBox = $("#self-text-order-paymentMethod").textbox({
            label: "支付方式：",
            labelWidth: 100,
            width: 450,
            readonly: true
        });
        
        shippingMethodTextBox = $("#self-text-order-shippingMethod").textbox({
            label: "配送方式：",
            labelWidth: 100,
            width: 450,
            readonly: true
        });
        
        orderStatusTextBox = $("#self-text-order-orderStatus").textbox({
            label: "订单状态：",
            labelWidth: 100,
            width: 450,
            readonly: true
        });
        
        paymentStatusTextBox = $("#self-text-order-paymentStatus").textbox({
            label: "支付状态：",
            labelWidth: 100,
            width: 450,
            readonly: true
        });

        shippingStatusTextBox = $("#self-text-order-shippingStatus").textbox({
            label: "配送状态",
            labelWidth: 100,
            width: 450,
            readonly: true
        });
        
        userTextBox = $("#self-text-order-user").textbox({
            label: "用户名",
            labelWidth: 100,
            width: 450,
            readonly: true
        });
        
        mobileTextBox = $("#self-text-order-mobile").textbox({
            label: "联系手机号",
            labelWidth: 100,
            width: 450,
            readonly: true
        });
        
        feeTextBox = $("#self-text-order-fee").textbox({
            label: "手续费",
            labelWidth: 100,
            width: 450,
            readonly: true
        });
        
        fokBtn = $("#self-btn-order-fsubmit").linkbutton({
            text: "发货",
            width: 115,
            height: 30
        });

        wokBtn = $("#self-btn-order-wsubmit").linkbutton({
            text: "完成",
            width: 115,
            height: 30
        });

    }, destoryUI = () => {
        snTextBox.textbox("destroy");
        addressTextBox.textbox("destroy");
        zipCodeTextBox.textbox("destroy");
        amountPriceTextBox.textbox("destroy");
        amountScoreTextBox.textbox("destroy");
        paymentMethodTextBox.textbox("destroy");
        shippingMethodTextBox.textbox("destroy");
        userTextBox.textbox("destroy");
        mobileTextBox.textbox("destroy");
        orderStatusTextBox.textbox("destroy");
        paymentStatusTextBox.textbox("destroy");
        shippingStatusTextBox.textbox("destroy");
        feeTextBox.textbox("destroy");
        consigneeTextBox.textbox("destroy");
        fokBtn.unbind("click");
        wokBtn.unbind("click");
        dialog.dialog("destroy");

    [dialog,
        snTextBox, addressTextBox, zipCodeTextBox, 
        amountPriceTextBox, amountScoreTextBox, paymentMethodTextBox, 
        shippingMethodTextBox, userTextBox, mobileTextBox,
        orderStatusTextBox, paymentStatusTextBox, shippingStatusTextBox,
        feeTextBox, consigneeTextBox, table,
        fokBtn, wokBtn,
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined, 
        undefined, undefined];
    },requestOrder = id => {
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
            xhr.open("GET", `/admin/order/find/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    },requestOrderItemList = id => {
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
            xhr.open("GET", `/admin/order-item/select-all/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadOrder = id => {
        requestOrder(id).then(order => {
            snTextBox.textbox("setValue", order.sn);
            addressTextBox.textbox("setValue", order.address);
            zipCodeTextBox.textbox("setValue", order.zip_code);
            amountPriceTextBox.textbox("setValue", order.amount_price);
            amountScoreTextBox.textbox("setValue", order.amount_score);
            shippingMethodTextBox.textbox("setValue", order.shipping_method.name);
            userTextBox.textbox("setValue", order.user["user-name"]);
            mobileTextBox.textbox("setValue", order.mobile);
            
            if (order.order_status === 0) {
                orderStatusTextBox.textbox("setValue", "未确认");
            } else if (order.order_status === 1) {
                orderStatusTextBox.textbox("setValue", "已确认");
            } else if (order.order_status === 2) {
                orderStatusTextBox.textbox("setValue", "已完成");
                wokBtn = $("#self-btn-order-wsubmit").linkbutton("disable");
            }
            
            if (order.payment_status === 0) {
                paymentStatusTextBox.textbox("setValue", "未支付");
            } else if (order.payment_status === 1) {
                paymentStatusTextBox.textbox("setValue", "已支付");
            }
            
            if (order.shipping_status === 0) {
                shippingStatusTextBox.textbox("setValue", "未发货");
            } else if (order.shipping_status === 1) {
                shippingStatusTextBox.textbox("setValue", "已发货");
            }

            feeTextBox.textbox("setValue", order.fee);
            consigneeTextBox.textbox("setValue", order.consignee);
            
            if (order.shipping_status === 1 || order.shipping_status === 0 && order.order_status === 2) {
                fokBtn = $("#self-btn-order-fsubmit").linkbutton("disable");
            }
            
            if (order.shipping_status !== 1 && order.order_status !== 2) {
                fokBtn.bind("click", () => {
                    updateOrderf(id);
                });
            } 
            
            if (order.order_status !== 2) {
                wokBtn.bind("click", () => {
                    updateOrderw(id);
                });
            }
            
        }, error => {
            SELF.errorHandler(error);
        });
    },loadOrderItemList = id => {
        requestOrderItemList(id).then(result => {
            let dataList = result["v1"];
            
            table.datagrid("loadData", dataList);
            
            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            dataList.forEach((data, index) => {
                genOPButton(data["id"], data['name'], index);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateOrderf = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-order-view");
                } else {
                    alert("订单中有商品库存不足");
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            
            xhr.open("PUT", `/admin/order/updatef/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send();
        });
    }, updateOrderw = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-order-view");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/order/updatew/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send();
        });
    }, genOPButton = (id, name, index) => {
        table.datagrid("fixRowHeight", index);
    };


    SELF.subscribe("order-view", id => {
        initUI();
        
        loadOrder(id);
        loadOrderItemList(id);
        
        table = $("#self-module-order-item").datagrid({
                columns: [[
                        {field: "product_thumbnail", title: "商品图片", width: "25%", align: "center"},
                        {field: "product_sn", title: "商品编号", width: "25%", align: "center"},
                        {field: "product_name", title: "商品名称", width: "25%", align: "center"},
                        {field: "product_price", title: "商品价格", width: "13%", align: "center"},
                        {field: "quantity", title: "商品数量", width: "13%", align: "center"},
                        {field: "product_score", title: "商品积分", width: "13%", align: "center"},
                        {field: "product_weight", title: "商品重量", width: "13%", align: "center"}
                    ]],
                rownumbers: true,
                fitColumns: true,
                singleSelect: true,
                height: "100%"
            });
    });

})(this, $, layer, SELF);