((window, $, layer, upload, SELF) => {
    SELF.registeredModule("activity-view", "module/activity/activity-view.html");
    let [panel, titleTextbox, sponsorComboGrid,
        sponsorTable, sponsorPager,
        startCalendar, endCalendar,
        telTextbox,
        provinceComboBox, cityComboBox, areaComboBox, placeTextbox,
        introTextbox,
        thumbnail, image,
        content,
        liveAddrTextbox, isLiveCheckbox,
        maxnumSpinner,
        ticketTable, ticketAddbtn] = [];
    let [thumbnailPath, imagePath] = [undefined, undefined];
    let [currentCooperationPageNumber, currentCooperationPageSize] = [1, 10]; // 初始化第1页，每页10行

    let [typeList, themeList] = [];

    let selectedType = undefined;
    let selectedThemeList = [];
    
    let id = undefined; // 更新的活动ID

    const initUI = () => {
        panel = $("#self-module-activity-publish").panel();
        titleTextbox = $("#self-activity-title").textbox({
            label: "活动标题<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "请填写活动名称，不要超过25字，必填",
            width: "100%",
            height: 38,
            readonly: true,
            labelWidth: 100
        });
        titleTextbox.textbox("textbox").attr("maxlength", 25);
        sponsorComboGrid = $("#self-activity-sponsor").textbox({
            label: "主办单位<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "请填写主办单位，不要超过100字，必填",
            width: "100%",
            height: 38,
            labelWidth: 100,
            panelWidth: 600,
            panelHeight: 350,
            idField: "title",
            textField: "title",
            editable: true,
            pagination: true,
            readonly: true,
            fitColumns: true,
            singleSelect: true,
            rownumbers: true
        });
        startCalendar = $("#self-activity-starttime").textbox({
            label: "开始时间<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "必填",
            labelWidth: 100,
            width: "100%",
            height: 38,
            editable: false,
            readonly: true,
            showSeconds: true
        });
        endCalendar = $("#self-activity-endtime").textbox({
            label: "结束时间<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "必填",
            labelWidth: 100,
            width: "100%",
            height: 38,
            editable: false,
            readonly: true,
            showSeconds: true
        });
        provinceComboBox = $("#self-activity-province").textbox({
            label: "活动地点<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            labelWidth: 100,
            width: "100%",
            height: 38,
            readonly: true,
            editable: false,
            valueField: "name",
            textField: "name",
            data: SELF.provinceList
        });
        cityComboBox = $("#self-activity-city").textbox({
            width: "100%",
            height: 38,
            editable: false,
            readonly: true,
            valueField: "name",
            textField: "name"
        });
        areaComboBox = $("#self-activity-area").textbox({
            width: "100%",
            height: 38,
            editable: false,
            readonly: true,
            valueField: "name",
            textField: "name"
        });
        placeTextbox = $("#self-activity-place").textbox({
            prompt: "输入详细地址信息，必填",
            width: "100%",
            height: 38,
            readonly: true,
            icons: [{
                    iconCls: "icon-baidu-map",
                    handler: e => {
                        let city = cityComboBox.combobox("getValue"),
                                area = areaComboBox.combobox("getValue"),
                                place = $(e.data.target).textbox("getValue").trim();
                        if (place.length === 0) {
                            layer.msg("请输入具体地点");
                            return;
                        }
                        let fullPlace = "";
                        if (city !== "其他") {
                            fullPlace += city;
                        }
                        if (area !== "其他") {
                            fullPlace += area;
                        }
                        fullPlace += place;
                        const pointer = {
                            callback: () => {
                                if (pointer.x && pointer.y) {
                                } else {
                                    layer.msg("无法获取地图坐标");
                                }
                            }
                        };
                        SELF.publish("self-baidumap", {
                            place: fullPlace,
                            city: provinceComboBox.combobox("getValue")
                        }, pointer);
                    }
                }]
        });
        placeTextbox.textbox("textbox").attr("maxlength", 90);

        for (let item of typeList) {
            let btn = `<button class="layui-btn layui-btn-sm layui-btn-primary" data-id="${item["id"]}" data-type="activity-type">${item["name"]}</button>`;
            $("#self-activity-type-container").append(btn);
        }
        $(`#self-activity-type-container button[data-type="activity-type"]`).click(event => {
            selectedType = $(event.target).attr("data-id");
            $(`#self-activity-type-container button[data-type="activity-type"]`).addClass("layui-btn-primary");
            $(event.target).removeClass("layui-btn-primary");
        });

        let tooltipContent = `<div class="layui-btn-container" id="self-activity-theme-list-container">`;
        for (let item of themeList) {
            let btn = `<button class="layui-btn layui-btn-sm layui-btn-primary" data-id="${item["id"]}" data-type="activity-theme">${item["name"]}</button>`;
            tooltipContent += btn;
        }
        tooltipContent += "</div>";
        let themeTooltip = $("#self-activity-theme-addbtn").tooltip({
            content: $(tooltipContent),
            showEvent: "click",
            onUpdate: (content) => {
                content.panel({
                    width: 500,
                    border: false
                });
                $("#self-activity-theme-list-container > button").click(event => {
                    let themeId = $(event.target).attr("data-id"),
                            themeName = $(event.target).text().trim(),
                            button = `<button class="layui-btn layui-btn-sm layui-btn-primary" data-id="${themeId}" data-type="activity-theme">${themeName}&nbsp;&nbsp;<i class="layui-icon layui-icon-close" style="font-weight:bold;"></i></button>`;

                    if (selectedThemeList.find(n => n === Number.parseInt(themeId)) === undefined) {
                        selectedThemeList.push(Number.parseInt(themeId));
                        $("#self-activity-theme-selected-container").append(button);
                    }
                });
            },
            onShow: () => {
                themeTooltip.tooltip("tip").unbind().bind("mouseenter", () => {
                    themeTooltip.tooltip("show");
                }).bind("mouseleave", () => {
                    themeTooltip.tooltip("hide");
                });
            }
        });

        $(`#self-activity-theme-selected-container`).click(event => {
            let target = $(event.target);
            if (target.is("i") && target.parent().attr("data-type") === "activity-theme") {
                let themeId = target.parent().attr("data-id");
                selectedThemeList.splice(selectedThemeList.findIndex(n => n === Number.parseInt(themeId)), 1);
                target.parent().remove();
            }
        });

        thumbnail = $("#self-activity-thumbnail");

        let thumbnailUploadInst = upload.render({
            elem: "#self-activity-thumbnail-btn",
            url: "/admin/files/layui/activity-upload-thumbnail",
            method: "POST",
            accept: "images",
            acceptMime: "image/*",
            size: 2048,
            auto: false,
            choose: (obj) => {
                obj.preview((index, file, result) => {
                    if (file.name.length >= 20) {
                        layer.msg("图片文件名应小于20字符！");
                        thumbnailUploadInst.config.elem.next()[0].value = "";
                        return;
                    }
                    obj.upload(index, file);
                });
            },
            done: (res, index, upload) => {
                thumbnailPath = res["data"]["src"];
                thumbnail.attr("src", res["data"]["src"]);
            },
            error: (index, upload) => {
                layer.msg("上传封面图失败");
                thumbnailUploadInst.config.elem.next()[0].value = "";
            }
        });

        image = $("#self-activity-image");

        let imageUploadInst = upload.render({
            elem: "#self-activity-image-btn",
            url: "/admin/files/layui/activity-upload-image",
            method: "POST",
            accept: "images",
            acceptMime: "image/*",
            size: 5120,
            auto: false,
            choose: (obj) => {
                obj.preview((index, file, result) => {
                    if (file.name.length >= 20) {
                        layer.msg("图片文件名应小于20字符！");
                        imageUploadInst.config.elem.next()[0].value = "";
                        return;
                    }
                    obj.upload(index, file);
                });
            },
            done: (res, index, upload) => {
                imagePath = res["data"]["src"];
                image.attr("src", res["data"]["src"]);
            },
            error: (index, upload) => {
                layer.msg("上传海报失败");
                imageUploadInst.config.elem.next()[0].value = "";
            }
        });

        telTextbox = $("#self-activity-tel").textbox({
            label: "联系电话<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "请输入联系电话，必填",
            width: "100%",
            height: 38,
            readonly: true,
            labelWidth: 100
        });
        
        introTextbox = $("#self-activity-intro").textbox({
            label: "活动摘要<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "请输入活动摘要，300字以内，必填",
            width: "100%",
            height: 100,
            labelWidth: 100,
            readonly: true,
            multiline: true
        });

        let wangEditor = window.wangEditor;
        content = new wangEditor("#self-activity-content");
        content.customConfig.menus = [
            "head", // 标题
            "bold", // 粗体
            "fontSize", // 字号
            "fontName", // 字体
            "italic", // 斜体
            "underline", // 下划线
            "strikeThrough", // 删除线
            "foreColor", // 文字颜色
            "backColor", // 背景颜色
            "link", // 插入链接
            "list", // 列表
            "justify", // 对齐方式
            "quote", // 引用
            "image", // 插入图片
            "table", // 表格
            "undo", // 撤销
            "redo"  // 重复
        ];
        content.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        content.customConfig.uploadFileName = "file";
        content.create();
        $(".w-e-text-container").css("height", "800px"); // 设置编辑区的高度

        liveAddrTextbox = $("#self-activity-live-addr").textbox({
            label: "直播地址",
            prompt: "请填写直播地址",
            width: "100%",
            height: 38,
            labelWidth: 100,
            readonly: true,
            disabled: true
        });
        liveAddrTextbox.textbox("textbox").attr("maxlength", 120);

        isLiveCheckbox = $("#self-activity-is-live").switchbutton({
            width: "100%",
            height: 38,
            checked: true,
            disabled: true,
            onText: "非直播",
            offText: "直播"
        });

        maxnumSpinner = $("#self-activity-maxnum").textbox({
            label: "参加人数上限<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "输入0则不限制",
            width: "100%",
            height: 38,
            labelWidth: 100,
            readonly: true,
            min: 0,
            max: 9999
        });
        
        ticketTable = $("#self-activity-ticket-table").datagrid({
            columns: [[
                    {field: "name", title: "票种名称", width: "30%", align: "center"},
                    {field: "stock", title: "发行数量", width: "10%", align: "center"},
                    {field: "fee", title: "价格", width: "15%", align: "center", formatter: (value, row, index) => {
                            if (row["free"] === true) {
                                return "免费";
                            }
                            return `¥ ${value} RMB`;
                        }, styler: (value, row, index) => {
                            if (row["free"] === true) {
                                return "color:red;";
                            }
                            return "color:blue;";
                        }},
                    {field: "status", title: "状态", width: "15%", align: "center", formatter: (value, row, index) => {
                            if (value === "not_open") {
                                return "未开售";
                            } else if (value === "joinning") {
                                return "售票中";
                            } else {
                                return "已结束";
                            }
                    }, styler: (value, row, index) => {
                            if (value === "not_open") {
                                return "color:#C0C0C0;";
                            } else if (value === "joinning") {
                                return "color:green";
                            } else {
                                return "color:red;";
                            }
                    }},
                    {field: "id", title: "操作", width: "20%", align: "center", formatter: (value, row, index) => {
                            let str = ``;
                            str += `<div>` +
                                    `<span style="margin:5px 10px 5px 0px;" data-type="op-edit" data-id=${value}></span>` +
                                    `<span style="margin:5px 10px 5px 0px;" data-type="op-del" data-id=${value}></span>` +
                                    `</div>`;
                            return str;
                    }}
                ]],
            toolbar: "#self-activity-ticket-table-toolbar",
            rownumbers: true,
            pagination: false,
            fitColumns: true,
            singleSelect: true,
            height: 300,
            detailFormatter: function (index, row) {
                let html = `<div>`;
                html += `<span style="line-height: 2rem;margin-left: 2%;font-size: 14px;">票种说明：${row["intro"]}</span><br>`;
                html += `<span style="line-height: 2rem;margin-left: 2%;font-size: 14px;">售票时间：${SELF.datatimeFormatter(row["start"])} - ${SELF.datatimeFormatter(row["end"])}</span><br>`;
                if (row["free"] === false) {
                    let personNum = row["person-num"];
                    let text = "";
                    if (personNum === 1) {
                        text = "单人票";
                    } else if (personNum === 2) {
                        text = "双人票";
                    } else {
                        text = `${personNum} 人票`;
                    }
                    html += `<span style="line-height: 2rem;margin-left: 2%;font-size: 14px;">套票设置：${text}</span><br>`;
                    html += `<span style="line-height: 2rem;margin-left: 2%;font-size: 14px;">购买限制：最少买 ${row["purchase-min"]} 张，最多买 ${row["purchase-max"]} 张</span><br>`;
                }
                html += `</div>`;
                return html;
            }
        });
        ticketAddbtn = $("#self-activity-ticket-addbtn").linkbutton({
            text: "添加票种",
            iconCls: "icon-add"
        });

    }, destoryUI = () => {
        id = undefined;
        
        thumbnailPath = undefined;
        imagePath = undefined;

        [currentCooperationPageNumber, currentCooperationPageSize] = [1, 10]; // 初始化第1页，每页10行

        typeList.length = 0;
        themeList.length = 0;

        selectedType = undefined;
        selectedThemeList.length = 0;
        
        $("#self-activity-publish-btn").unbind("click");
        $("#self-activity-draft-btn").unbind("click");

        titleTextbox.textbox("destroy");
        thumbnail.attr("src", "");
        image.attr("src", "");
        sponsorComboGrid.textbox("destroy");
        sponsorTable = undefined;
        sponsorPager = undefined;
        startCalendar.textbox("destroy");
        endCalendar.textbox("destroy");
        telTextbox.textbox("destroy");
        provinceComboBox.textbox("destroy");
        cityComboBox.textbox("destroy");
        areaComboBox.textbox("destroy");
        placeTextbox.textbox("destroy");
        introTextbox.textbox("destroy");
        content.txt.clear();
        liveAddrTextbox.textbox("destroy");
        maxnumSpinner.textbox("destroy");
        panel.panel("destroy");

    }, requestActivity = activityId => {
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
            xhr.open("GET", `/admin/activity/find/${activityId}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, requestAllActivityType = () => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
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
            xhr.open("GET", `/admin/activity-type?offset=0&count=1000`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, requestThemes = () => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
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
            xhr.open("GET", "/admin/activity-theme?offset=0&count=1000");
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, requestCooperation = (offset, count, title) => {
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
            xhr.open("GET", `/admin/cooperation?offset=${offset}&count=${count}&title=${title}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, requestTicketByActivity = activityId => {
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
            xhr.open("GET", `/admin/activity-ticket?activity-id=${activityId}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadTicketByActivity = activityId => {
        requestTicketByActivity(activityId).then(tickets => {
            ticketTable.datagrid("loadData", tickets);
            tickets.forEach((data, index) => {
                genTicketOPButton(data, index);
            });
        }, error => {
            SELF.errorHandler(error);
        });
    }, requestDeleteTicket = ticketId => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    resolve(true);
                } else if (xhr.status === 409) {
                    resolve(false);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/admin/activity-ticket/${ticketId}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, genTicketOPButton = (ticketData, index) => {
        const edit = $(`#self-activity-ticket-table-container span[data-type=op-edit][data-id=${ticketData["id"]}]`).linkbutton({
            iconCls: "icon-edit",
            width: 80,
            text: "编辑"
        });
        
        const del = $(`#self-activity-ticket-table-container span[data-type=op-del][data-id=${ticketData["id"]}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 80,
            text: "删除"
        });
        
        ticketTable.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", (moduleName, activityId) => {
        if (moduleName === "activity-view") {
            id = activityId;
            window.Promise.all([requestAllActivityType(), requestThemes(), requestCooperation(0, 10, ""), requestActivity(activityId), requestTicketByActivity(activityId)]).then(list => {
                typeList = list[0]["v1"].map(item => {
                    return {
                        id: item["id"],
                        name: item["name"]
                    };
                });
                themeList = list[1]["v1"].map(item => {
                    return {
                        id: item["id"],
                        name: item["name"]
                    };
                });

                initUI();
                
                let activity = list[3];
                titleTextbox.textbox("setValue", activity["title"]);
                sponsorComboGrid.textbox("setValue", activity["sponsor"]);
                telTextbox.textbox("setValue", activity["tel"]);
                startCalendar.textbox("setValue", SELF.datatimeFormatter(activity["start-time"]));
                endCalendar.textbox("setValue", SELF.datatimeFormatter(activity["end-time"]));
                provinceComboBox.textbox("setValue", activity["province"]);
                cityComboBox.textbox("setValue", activity["city"]);
                if (activity["area"] && activity["area"] !== "") {
                    areaComboBox.textbox("setValue", activity["area"]);
                }
                placeTextbox.textbox("setValue", activity["place"]);
                thumbnailPath = activity["thumbnail"];
                imagePath = activity["image"];
                thumbnail.attr("src", activity["thumbnail"]);
                image.attr("src", activity["image"]);
                
                selectedType = activity["type"]["id"];
                $(`#self-activity-type-container > button[data-id=${selectedType}]`).removeClass("layui-btn-primary");
                
                let themes = activity["themes"];
                if (themes && themes !== null && themes.length > 0) {
                    for (let i = 0; i < themes.length; i++) {
                        let button = `<button class="layui-btn layui-btn-sm layui-btn-primary" data-id="${themes[i]["id"]}" data-type="activity-theme">${themes[i]["name"]}&nbsp;&nbsp;<i class="layui-icon layui-icon-close" style="font-weight:bold;"></i></button>`;
                        selectedThemeList.push(themes[i]["id"]);
                        $("#self-activity-theme-selected-container").append(button);
                    }
                }
                
                introTextbox.textbox("setValue", activity["introduction"]);
                content.txt.html(activity["full-text"]);
                
                liveAddrTextbox.textbox("setValue", activity["live-url"]);
                if (activity["live"] === true) {
                    isLiveCheckbox.switchbutton("uncheck");
                    liveAddrTextbox.textbox("enable");
                } else {
                    isLiveCheckbox.switchbutton("check");
                    liveAddrTextbox.textbox("disable");
                }
                
                maxnumSpinner.textbox("setValue", activity["max-num"]);
                
                let tickets = list[4];
                ticketTable.datagrid("loadData", tickets);
                tickets.forEach((data, index) => {
                    genTicketOPButton(data, index);
                });

            }, error => {
                SELF.errorHandler(error);
            });
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "activity-view") {
            destoryUI();
        }
    })("activity-ticket-online-refresh", () => {
        loadTicketByActivity(id);
    });
})(this, $, layer, layui.upload, SELF);
