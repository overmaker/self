((window, $, layer, SELF) => {
    SELF.registeredPopup("donation-add", "module/advertisement/donation-add.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, nameTextBox, noTextBox, amountTextBox, dialogBtn] = [undefined, undefined, undefined, undefined, undefined];
    
    let [currentId] = [undefined];

    let insertDonation = (name, no, amount) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-donation-add");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/donation`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}&amount=${amount}`);
        });
    }, addDonationVerification = (name, amount) => {
        const [donationName, donationAmount] =
                [name, amount];
        if (donationName === "" || donationName === null) {
            layer.msg("请输入名称！");
            return "false";
        }
        
        if (donationAmount === "" || donationAmount === null) {
            layer.msg("请输入金额！");
            return "false";
        }
    };


    SELF.subscribe("donation-add", () => {
        let html = SELF.getPopupHtml("donation-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建",
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
        
        nameTextBox = $("#self-text-donation-name").textbox({
            label: "名称：",
            labelWidth: 100,
            width: 400
        });
        
//        noTextBox = $("#self-text-donation-no").textbox({
//            label: "证件号：",
//            labelWidth: 100,
//            width: 400
//        });
        
        amountTextBox = $("#self-text-donation-amount").textbox({
            label: "金额：",
            labelWidth: 100,
            width: 400
        });
        
        dialogBtn = $("#self-btn-donation-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

        dialogBtn.bind("click", () => {
            
            /** 获取参数*/
            const name = nameTextBox.textbox("getValue");
//            const no = noTextBox.textbox("getValue");
            const amount = amountTextBox.textbox("getValue");
            
            let result = addDonationVerification(name, amount);
            if (result !== "false") {
                insertDonation(name, amount);
            }
        });

    });

})(this, $, layer, SELF);