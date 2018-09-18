((window, $, layer, SELF) => {
    SELF.registeredPopup("user-info-particulars", "module/commons/user-info-particulars.html");
    let [dialog] = [undefined];
    let [appendInfo, appendEduction, appendAdvance, appendOccpation] = [undefined, undefined, undefined, undefined];

    /**
     * 格式化时间
     * @param {type} date 时间参数
     * @param {type} format 转换格式
     * @returns {String} 转换结果
     */
    function formatDate(date, format) {
        if (date === undefined || date === null) {
            return "";
        }
        if (!format) {
            format = "yyyy-MM-dd";
        }
        date = new Date(parseInt(date));
        var dict = {
            "yyyy": date.getFullYear(),
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "S": date.getMilliseconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(y+|M+|d+)/g, function (a) {
            return dict[a];
        });
    }

    let requestUserInfo = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve({
                        "type": "info",
                        "data": xhr.response
                    });
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("GET", `/admin/user-info/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, updateUserInfoIsVip = (id, vip) => {
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
            xhr.open("PUT", `/admin/user-info/isvip/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`vip=${vip}`);
        });
    }, updateUserInfoIsVolunteer = (id, volunteer) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {

                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/user-info/volunteer/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`volunteer=${volunteer}`);
        });
    }, requestUserAdvance = (id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve({
                        "type": "advance",
                        "data": xhr.response
                    });
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("GET", `/admin/user-advance/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    };

    SELF.subscribe("user-info-particulars", (id) => {
        let html = SELF.getPopupHtml("user-info-particulars");
        dialog = $(html).appendTo("body");

        window.Promise.all([requestUserInfo(id), requestUserAdvance(id)]).then((list) => {
            for (let i = 0; i < list.length; i++) {
                if (list[i].type === "advance") {
                    appendAdvance = "<div id=\"user-info-advace\">";
                    appendAdvance += "   <label>身份证号：</label><span>" + (list[i].data.identification === null ? "" : list[i].data.identification) + "</span><br /><br />";
                    if (list[i].data["identification-pic"] !== null) {
                        appendAdvance += "<a href=\"" + list[i].data["identification-pic"] + "\" target='_blank'><img src=\"" + list[i].data["identification-pic"] + "\" id=\"user-info-advace-identification\" alt='身份证扫描件' /></a>";
                    }
                    if (list[i].data["qualification-pic"] !== null) {
                        appendAdvance += "<a href=\"" + list[i].data["qualification-pic"] + "\" target='_blank'><img src=\"" + list[i].data["qualification-pic"] + "\" id=\"user-info-advace-qualification\" alt='资质证书扫描件' /></a>";
                    }
                    appendAdvance += "</div>";
                    $("#user-info-advance").append(appendAdvance);
                }
                if (list[i].type === "info") {
                    let [volunteer, vip, gender] = ["", "", ""];
                    if (list[i].data.gender === null || list[i].data.gender === undefined) {
                        gender = "";
                    } else {
                        gender = list[i].data.gender === true ? "男" : "女";
                    }
                    appendInfo = "<div class=\"user-info-left\" > ";
                    appendInfo += "     <img src=\"" + list[i].data.photo + "\" id=\"user-info-photo\" />";
                    appendInfo += "</div>";
                    appendInfo += "<div class=\"user-info-right\">";
                    appendInfo += "      <p><label>昵称：</label> <span>" + (list[i].data["nick-name"] === null ? "" : list[i].data["nick-name"]) + "</span></p>";
                    appendInfo += "      <p><label>真实姓名：</label><span id=\"user-info-name\">" + (list[i].data.name === null ? "" : list[i].data.name) + "</span></p>";
                    appendInfo += "      <p><label>性别：</label><span>" + gender + "</span></p>";
                    appendInfo += "      <p><label>出生日期：</label><span>" + formatDate(list[i].data["birth-date"]) + "</span></p>";
                    appendInfo += "  <p>";
//                    appendInfo += "     <label>VIP：</label> <span id='is_vip'></span> &nbsp;&nbsp;&nbsp;&nbsp;";
//                    appendInfo += "     <label>志愿者：</label> <span id='is_volunteer'></span>&nbsp;&nbsp;&nbsp;&nbsp;";
                    appendInfo += "     <label>积分：</label> <span>" + list[i].data.score + "</span>";
                    appendInfo += "  </p>";
                    appendInfo += "</div>";
                    appendInfo += "<hr />";
                    appendInfo += "<div class=\"user-info-left\"> ";
                    appendInfo += "     <p> <label>电话：</label><span>" + (list[i].data.mobile === null ? "" : list[i].data.mobile) + "</span></p>";
                    appendInfo += "</div>";
                    appendInfo += "<div class=\"user-info-right\">";
                    appendInfo += "     <p> <label>邮箱：</label><span>" + (list[i].data.email === null ? "" : list[i].data.email) + "</span></p><br />";
                    appendInfo += "</div>";
                    appendInfo += "<span class=\"user-info-address\">";
                    appendInfo += "      <label>籍贯：</label>";
                    appendInfo += "      <span>" + (list[i].data["native-place"] === null ? "" : list[i].data["native-place"]) + "</span><br /><br />";
                    appendInfo += "</span>";
                    appendInfo += "<span class=\"user-info-address\">";
                    appendInfo += "<label>地址：</label>";
                    appendInfo += "<span class=\"user-info-address\">" + (list[i].data.address === null ? "" : list[i].data.address) + "</span>";
                    appendInfo += "</span>";
                    $("#user-info-basic").append(appendInfo);

                    /* 动态显示是否是vip */
                    
//                   if (list[i].data.vip === true) {
//                        $("#is_vip").switchbutton({
//                            checked: true
//                        });
//                    } else {
//                        $("#is_vip").switchbutton({
//                            checked: false
//                        });
//                    }
//                    $("#is_vip").switchbutton({
//                        onText: "是VIP",
//                        offText: "不是VIP",
//                        width: 100,
//                        onChange: function (checked) {
//                            updateUserInfoIsVip(list[i].data.id, checked);
//                            SELF.publish("load-user-info");
//                        }
//                    });

                    /* 动态显示是否是志愿者 */
//                    if (list[i].data.volunteer === true) {
//                        $("#is_volunteer").switchbutton({
//                            checked: true
//                        });
//                    } else {
//                        $("#is_volunteer").switchbutton({
//                            checked: false
//                        });
//                    }
//                    $("#is_volunteer").switchbutton({
//                        onText: "是志愿者",
//                        offText: "不是志愿者",
//                        width: 100,
//                        onChange: function (checked) {
//                            updateUserInfoIsVolunteer(list[i].data.id, checked);
//                            SELF.publish("load-user-info");
//                        }
//                    });
                }
            }
        });
        dialog.dialog({
            title: "用户详情 ",
            width: 920,
            height: 600,
            closed: false,
            cache: false,
            modal: true,
            onClose: function () {
                /* 卸载对话框 */
                if (dialog) {
                    dialog.dialog("destroy");
                }
                dialog = undefined;

                appendInfo = undefined;
                appendEduction = undefined;
                appendAdvance = undefined;
                appendOccpation = undefined;
            }
        });
        const userInfoTabs = $("#selft-user-info-particulars-tabs").tabs({
            border: false
        });
    });

})(this, $, layer, SELF);