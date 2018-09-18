((window, $, layer, SELF) => {
    SELF.registeredPopup("activity-ticket", "module/activity/activity-ticket.html");
    let [dialog, nameTextbox, stockNumberbox, introductionTextbox, startDatetimebox, endDatetimebox,
        isfreeBox, feeNumberbox, personNumCombobox, purchaseMinCombobox, purchaseMaxCombobox,
        okBtn] = [];
    
    /* 是以【添加】的形式打开还是【修改】的形式打开，可选值add、update */
    let openType = "add";
    /* 是否在线的方式打开。可选值true、false */
    /* 在活动发布页面做的票种添加、修改是离线方式，更改后的结果不立即更新到数据库 */
    /* 在活动修改页面做的票种添加、修改是离线方式，更改后的结果立即更新到数据库 */
    let online = false;
    let activityId = undefined; // 编辑活动时添加票种时的活动ID
    let ticketId = undefined; // 编辑活动时修改票种时的票种ID
    let updateIndex = -1;

    const initUI = () => {
        let html = SELF.getPopupHtml("activity-ticket");
        dialog = $(html).appendTo("body").dialog({
            title: openType === "add" ? "添加票种" : "修改票种",
            closed: false,
            maximizable: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });
        nameTextbox = $("#self-activity-ticket-dialog-name").textbox({
            label: "票种名称<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "请填写票种名称，必填",
            width: "100%",
            labelWidth: 80
        });
        nameTextbox.textbox("textbox").attr("maxlength", 20);

        stockNumberbox = $("#self-activity-ticket-dialog-stock").numberbox({
            label: "限额<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "限额，设置0表示不限数量",
            width: "100%",
            labelWidth: 80,
            min: 0,
            max: 9999,
            precision: 0
        });
        stockNumberbox.numberbox("textbox").attr("maxlength", 4);

        introductionTextbox = $("#self-activity-ticket-dialog-introduction").textbox({
            label: "票种说明",
            prompt: "请填写票种说明",
            width: "100%",
            labelWidth: 80
        });
        introductionTextbox.numberbox("textbox").attr("maxlength", 50);

        let buttonsStart = $.extend([], $.fn.datetimebox.defaults.buttons);
        buttonsStart.splice(2, 1, {
            text: "清空",
            handler: target => $("#self-activity-starttime").datetimebox("setValue", "")
        });
        let buttonsEnd = $.extend([], $.fn.datetimebox.defaults.buttons);
        buttonsEnd.splice(2, 1, {
            text: "清空",
            handler: target => $("#self-activity-endtime").datetimebox("setValue", "")
        });
        startDatetimebox = $("#self-activity-ticket-dialog-start").datetimebox({
            label: "开售时间<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "必填",
            labelWidth: 80,
            width: "100%",
            editable: false,
            showSeconds: true,
            buttons: buttonsStart
        });
        endDatetimebox = $("#self-activity-ticket-dialog-end").datetimebox({
            label: "截至时间<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "必填",
            labelWidth: 80,
            width: "100%",
            editable: false,
            showSeconds: true,
            buttons: buttonsEnd
        });
        isfreeBox = $("#self-activity-ticket-dialog-isfree").switchbutton({
            width: 120,
            checked: true,
            onText: "免费",
            offText: "收费",
            onChange: function (checked) {
                if (checked) {
                    $("[data-type=self-activity-ticket-dialog-isfree-option]").hide();
                    dialog.dialog("resize", {
                        width: 600,
                        height: 440
                    });
                } else {
                    $("[data-type=self-activity-ticket-dialog-isfree-option]").show();
                    dialog.dialog("resize", {
                        width: 600,
                        height: 500
                    });
                }
                dialog.dialog("center");
            }
        });
        feeNumberbox = $("#self-activity-ticket-dialog-fee").numberbox({
            label: "价格(元)<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            value: 1,
            width: 200,
            labelWidth: 100,
            min: 1,
            max: 99999,
            precision: 0
        });
        feeNumberbox.numberbox("textbox").attr("maxlength", 5);

        personNumCombobox = $("#self-activity-ticket-dialog-personnum").combobox({
            label: "套票设置",
            width: 200,
            labelWidth: 100,
            valueField: "id",
            textField: "text",
            editable: false,
            data: [{
                    "id": 1,
                    "text": "单人票",
                    "selected": true
                }, {
                    "id": 2,
                    "text": "双人票"
                }, {
                    "id": 3,
                    "text": "3 人票"
                }, {
                    "id": 4,
                    "text": "4 人票"
                }, {
                    "id": 5,
                    "text": "5 人票"
                }, {
                    "id": 6,
                    "text": "6 人票"
                }, {
                    "id": 7,
                    "text": "7 人票"
                }, {
                    "id": 8,
                    "text": "8 人票"
                }, {
                    "id": 9,
                    "text": "9 人票"
                }, {
                    "id": 10,
                    "text": "10 人票"
                }]
        });

        purchaseMinCombobox = $("#self-activity-ticket-dialog-purchasemin").combobox({
            label: "单次订购至少",
            width: "100%",
            labelWidth: 100,
            valueField: "id",
            textField: "text",
            editable: false,
            data: [{
                    "id": 1,
                    "text": "1 张",
                    "selected": true
                }, {
                    "id": 2,
                    "text": "2 张"
                }, {
                    "id": 3,
                    "text": "3 张"
                }, {
                    "id": 4,
                    "text": "4 张"
                }, {
                    "id": 5,
                    "text": "5 张"
                }, {
                    "id": 6,
                    "text": "6 张"
                }, {
                    "id": 7,
                    "text": "7 张"
                }, {
                    "id": 8,
                    "text": "8 张"
                }, {
                    "id": 9,
                    "text": "9 张"
                }, {
                    "id": 10,
                    "text": "10 张"
                }]
        });
        purchaseMaxCombobox = $("#self-activity-ticket-dialog-purchasemax").combobox({
            label: "最多",
            width: "100%",
            labelWidth: 50,
            valueField: "id",
            textField: "text",
            editable: false,
            data: [{
                    "id": 1,
                    "text": "1 张"
                }, {
                    "id": 2,
                    "text": "2 张",
                    "selected": true
                }, {
                    "id": 3,
                    "text": "3 张"
                }, {
                    "id": 4,
                    "text": "4 张"
                }, {
                    "id": 5,
                    "text": "5 张"
                }, {
                    "id": 6,
                    "text": "6 张"
                }, {
                    "id": 7,
                    "text": "7 张"
                }, {
                    "id": 8,
                    "text": "8 张"
                }, {
                    "id": 9,
                    "text": "9 张"
                }, {
                    "id": 10,
                    "text": "10 张"
                }]
        });
        
        okBtn = $("#self-activity-ticket-dialog-ok").linkbutton({
            width: "100%",
            text: "确定",
            iconCls: "icon-ok"
        });
        okBtn.bind("click", () => {
            const obj = prepare();
            if (typeof obj === "object") {
                if (openType === "add" && online === false) {
                    SELF.publish("activity-ticket-pre-added", obj);
                } else if (openType === "update" && online === false) {
                    SELF.publish("activity-ticket-pre-updated", {
                        data: obj,
                        index: updateIndex
                    });
                } else if (openType === "add" && online === true) {
                    obj["activity"] = {
                        id: activityId
                    };
                    addTicket(obj);
                } else if (openType === "update" && online === true) {
                    obj["id"] = ticketId;
                    updateTicket(obj);
                }
                dialog.dialog("destroy");
            }
        });
        
        $("[data-type=self-activity-ticket-dialog-isfree-option]").hide();
        dialog.dialog("resize", {
            width: 600,
            height: 440
        });
        dialog.dialog("center");

    }, destoryUI = () => {
        updateIndex = -1;
        activityId = undefined;
        ticketId = undefined;
        
        nameTextbox.textbox("destroy");
        stockNumberbox.numberbox("destroy");
        introductionTextbox.textbox("destroy");
        startDatetimebox.datetimebox("destroy");
        endDatetimebox.datetimebox("destroy");
        feeNumberbox.numberbox("destroy");
        personNumCombobox.combobox("destroy");
        purchaseMinCombobox.combobox("destroy");
        purchaseMaxCombobox.combobox("destroy");
        okBtn.unbind("click");
        dialog.dialog("destroy");
    }, prepare = () => {
        const name = nameTextbox.textbox("getValue").trim(),
           stock = stockNumberbox.numberbox("getValue"),
           intro = introductionTextbox.textbox("getValue").trim(),
           start = startDatetimebox.datetimebox("getValue"),
           end = endDatetimebox.datetimebox("getValue"),
           isFree = isfreeBox.switchbutton("options").checked;
        if (name === "") {
            layer.msg("请输入票种名称");
            return false;
        }
        if (stock === "") {
            layer.msg("请输入限额");
            return false;
        }
        if (start === "") {
            layer.msg("请选择开售时间");
            return false;
        }
        if (end === "") {
            layer.msg("请选择截至时间");
            return false;
        }
        if (Date.parse(start) >= Date.parse(end)) {
            layer.msg("截至时间不能早于或等于开售时间");
            return false;
        }
        const obj = {
            name: name,
            stock: stock,
            intro: intro,
            start: Date.parse(start),
            end: Date.parse(end),
            free: isFree
        };
        if (isFree === false) {
            if (feeNumberbox.numberbox("getValue") === "") {
                layer.msg("请输入价格");
                return false;
            }
            obj["fee"] = Number.parseFloat(feeNumberbox.numberbox("getValue"));
            obj["person-num"] = Number.parseInt(personNumCombobox.combobox("getValue"));
            if (Number.parseInt(purchaseMinCombobox.combobox("getValue")) > Number.parseInt(purchaseMaxCombobox.combobox("getValue"))) {
                layer.msg("请输入正确的购票数量限制");
                return false;
            }
            obj["purchase-min"] = Number.parseInt(purchaseMinCombobox.combobox("getValue"));
            obj["purchase-max"] = Number.parseInt(purchaseMaxCombobox.combobox("getValue"));
        } else {
            obj["fee"] = 0;
        }
        return obj;
    }, fillTicketData = unsavedTicketData => {
        nameTextbox.textbox("setValue", unsavedTicketData["name"]);
        stockNumberbox.numberbox("setValue", unsavedTicketData["stock"]);
        introductionTextbox.textbox("setValue", unsavedTicketData["intro"]);
        startDatetimebox.datetimebox("setValue", SELF.datatimeFormatter(unsavedTicketData["start"]));
        endDatetimebox.datetimebox("setValue", SELF.datatimeFormatter(unsavedTicketData["end"]));
        if (unsavedTicketData["free"]) {
            isfreeBox.switchbutton("check");
        } else {
            isfreeBox.switchbutton("uncheck");
            feeNumberbox.numberbox("setValue", unsavedTicketData["fee"]);
            personNumCombobox.combobox("setValue", unsavedTicketData["person-num"]);
            purchaseMinCombobox.combobox("setValue", unsavedTicketData["purchase-min"]);
            purchaseMaxCombobox.combobox("setValue", unsavedTicketData["purchase-max"]);
        }
    }, requestAddTicket = ticketData => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
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
            xhr.open("POST", "/admin/activity-ticket");
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(ticketData));
        });
    }, addTicket = ticketData => {
        requestAddTicket(ticketData).then(() => {
            SELF.publish("activity-ticket-online-refresh");
        }, error => {
            SELF.errorHandler(error);
        });
    }, requestUpdateTicket = ticketData => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
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
            xhr.open("PUT", "/admin/activity-ticket");
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(ticketData));
        });
    }, updateTicket = ticketData => {
        requestUpdateTicket(ticketData).then(() => {
            SELF.publish("activity-ticket-online-refresh");
        }, error => {
            SELF.errorHandler(error);
        });
    };

    SELF.subscribe("activity-ticket-offline-add", () => { // 这种情况是新建活动(活动尚未保存到数据库)时添加票种
        openType = "add";
        online = false;
        initUI();
    })("activity-ticket-offline-update", obj => { // 这种情况是新建活动(活动尚未保存到数据库)时修改票种，此时票种也未保存到数据库
        openType = "update";
        online = false;
        initUI();
        updateIndex = obj["index"];
        fillTicketData(obj["data"]);
    })("activity-ticket-online-add", aid => {
        openType = "add";
        online = true;
        activityId = aid;
        initUI();
    })("activity-ticket-online-update", obj => {
        openType = "update";
        online = true;
        ticketId = obj["id"];
        initUI();
        fillTicketData(obj);
    });
})(this, $, layer, SELF);
