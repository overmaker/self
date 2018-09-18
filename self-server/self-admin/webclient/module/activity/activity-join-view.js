((window, $, layer, SELF) => {
    SELF.registeredPopup("activity-join-view", "module/activity/activity-join-view.html");

    let [dialog,
        mobileTextBox, emailTextBox, 
        jtimeTextBox, ischeckTextBox, ctimeTextBox, 
        issignTextBox, stimeTextBox, confirmTextBox, 
        commentTextBox, btimeTextBox, jnumTextBox, 
        okBtn
    ] = [undefined,
        undefined, undefined,
        undefined, undefined, undefined, 
        undefined, undefined, undefined, 
        undefined, undefined, undefined, 
        undefined];
    
    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    const initUI = () => {
        const html = SELF.getPopupHtml("activity-join-view");
        dialog = $(html).appendTo("body").dialog({
            title: "查看详情",
            width: 660,
            height: 660,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });
        
        mobileTextBox = $("#self-text-activity-join-mobile").textbox({
            label: "手机号：",
            labelWidth: 150,
            width: 450,
            readonly: true
        });
        
        emailTextBox = $("#self-text-activity-join-email").textbox({
            label: "邮箱：",
            width: 450,
            labelWidth: 150,
            readonly: true
        });
        
        jtimeTextBox = $("#self-text-activity-join-jtime").textbox({
            label: "报名时间：",
            width: 450,
            labelWidth: 150,
            readonly: true
        });
        
        ischeckTextBox = $("#self-text-activity-join-ischeck").textbox({
            label: "是否通过报名申请：",
            width: 450,
            labelWidth: 150,
            readonly: true
        });
        
        ctimeTextBox = $("#self-text-activity-join-ctime").textbox({
            label: "批准时间：",
            width: 450,
            labelWidth: 150,
            readonly: true
        });
        
        issignTextBox = $("#self-text-activity-join-issign").textbox({
            label: "是否签到：",
            width: 450,
            labelWidth: 150,
            readonly: true
        });
        
        stimeTextBox = $("#self-text-activity-join-stime").textbox({
            label: "签到时间：",
            width: 450,
            labelWidth: 150,
            readonly: true
        });
        
        confirmTextBox = $("#self-text-activity-join-confirm").textbox({
            label: "邮箱确认报名：",
            width: 450,
            labelWidth: 150,
            readonly: true
        });
        
        commentTextBox = $("#self-text-activity-join-comment").textbox({
            label: "评论：",
            width: 450,
            labelWidth: 150,
            multiline: true,
            height: 80,
            readonly: true
        });
        
        btimeTextBox = $("#self-text-activity-join-btime").textbox({
            label: "预约活动用的预约时间：",
            width: 450,
            labelWidth: 150,
            readonly: true
        });
        
        jnumTextBox = $("#self-text-activity-join-jnum").textbox({
            label: "报名人数：",
            width: 450,
            labelWidth: 150,
            readonly: true
        });

    }, destoryUI = () => {
        mobileTextBox.textbox("destroy");
        emailTextBox.textbox("destroy");
        jtimeTextBox.textbox("destroy");
        ischeckTextBox.textbox("destroy");
        ctimeTextBox.textbox("destroy");
        issignTextBox.textbox("destroy");
        stimeTextBox.textbox("destroy");
        confirmTextBox.textbox("destroy");
        commentTextBox.textbox("destroy");
        btimeTextBox.textbox("destroy");
        jnumTextBox.textbox("destroy");
        dialog.dialog("destroy");

    [dialog,
        mobileTextBox, emailTextBox, 
        jtimeTextBox, ischeckTextBox, ctimeTextBox, 
        issignTextBox, stimeTextBox, confirmTextBox, 
        commentTextBox, btimeTextBox, jnumTextBox, 
        okBtn
    ] = [undefined,
        undefined, undefined,
        undefined, undefined, undefined, 
        undefined, undefined, undefined, 
        undefined, undefined, undefined, 
        undefined];
    },requestActivityJoin = id => {
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
            xhr.open("GET", `/admin/activity-join/find/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadActivityJoin = id => {
        requestActivityJoin(id).then(activityJoin => {
            mobileTextBox.textbox("setValue", activityJoin.mobile);
            emailTextBox.textbox("setValue", activityJoin.email);
            if (activityJoin.jtime !== null || activityJoin.jtime !== "") {
                jtimeTextBox.textbox("setValue", new Date(activityJoin.jtime).toLocaleString());
            }
            
            if (activityJoin.check === "W") {
                ischeckTextBox.textbox("setValue", "待审核");
            } else if (activityJoin.check === "N") {
                ischeckTextBox.textbox("setValue", "已拒绝");
            } else if (activityJoin.check === "Y") {
                ischeckTextBox.textbox("setValue", "已通过");
            }
            
            if (activityJoin.ctime !== null && activityJoin.ctime !== "") {
                ctimeTextBox.textbox("setValue", new Date(activityJoin.ctime).toLocaleString());
            } 
            
            if (activityJoin.sign === "N") {
                issignTextBox.textbox("setValue", "未签到");
            } else if (activityJoin.sign === "Y") {
                issignTextBox.textbox("setValue", "已签到");
            }
            
            if (activityJoin.stime !== null && activityJoin.stime !== "") {
                stimeTextBox.textbox("setValue", new Date(activityJoin.stime).toLocaleString());
            }
            
            if (activityJoin.confirm === "N") {
                confirmTextBox.textbox("setValue", "未确认");
            } else if (activityJoin.confirm === "Y") {
                confirmTextBox.textbox("setValue", "已确认");
            }
            
            commentTextBox.textbox("setValue", activityJoin.comment);
            if (activityJoin.btime !== null && activityJoin.btime !== "") {
                btimeTextBox.textbox("setValue", new Date(activityJoin.btime).toLocaleString());
            }
            jnumTextBox.textbox("setValue", activityJoin.jnum);

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素
            
        }, error => {
            SELF.errorHandler(error);
        });
    };

    SELF.subscribe("activity-join-view", id => {
        initUI();
        
        loadActivityJoin(id);
    });
    
})(this, $, layer, SELF);