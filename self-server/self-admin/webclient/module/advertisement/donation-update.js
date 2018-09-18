((window, $, layer, SELF) => {
    SELF.registeredPopup("donation-update", "module/advertisement/donation-add.html");

    let[dialog,
        nameTextBox, noTextBox, amountTextBox,
        okBtn
    ] = [undefined,
        undefined, undefined, undefined, 
        undefined];

    const initUI = () => {
        const html = SELF.getPopupHtml("donation-update");
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
        
        okBtn = $("#self-btn-donation-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        nameTextBox.textbox("destroy");
        noTextBox.textbox("destroy");
        amountTextBox.textbox("destroy");
        okBtn.unbind("click");
        dialog.dialog("destroy");

    [dialog,
        nameTextBox, noTextBox, amountTextBox,
        okBtn
    ] = [undefined,
        undefined, undefined, undefined, 
        undefined];
    }, requestDonation = id => {
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
            xhr.open("GET", `/admin/donation/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadDonation = id => {
        requestDonation(id).then(donation => {
            nameTextBox.textbox("setValue", donation.name);
//            noTextBox.textbox("setValue", donation.no);
            amountTextBox.textbox("setValue", donation.amount);
            
            okBtn.bind("click", () => {
                submitDonation(id);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateDonation = (name, no, amount, id) => {
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
            xhr.open("PUT", `/admin/donation/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}&amount=${amount}`);
        });
    }, submitDonation = (id) => {

        /** 获取参数*/
        const name = nameTextBox.textbox("getValue");
//        const no = noTextBox.textbox("getValue");
        const amount = amountTextBox.textbox("getValue");
        
        updateDonation(name, no, amount, id);
    };

    SELF.subscribe("donation-update", id => {
        initUI();
        loadDonation(id);
    });
})(this, $, layer, SELF);