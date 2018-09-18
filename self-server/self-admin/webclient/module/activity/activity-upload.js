((window, $, layer, upload, SELF) => {
    SELF.registeredModule("activity-publish", "module/activity/activity-upload.html");
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
    
    let ticketArr = [];

    const initUI = () => {
        panel = $("#self-module-activity-publish").panel();
        titleTextbox = $("#self-activity-title").textbox({
            label: "活动标题<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "请填写活动名称，不要超过25字，必填",
            width: "100%",
            height: 38,
            labelWidth: 100
        });
        titleTextbox.textbox("textbox").attr("maxlength", 25);
        sponsorComboGrid = $("#self-activity-sponsor").combogrid({
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
            fitColumns: true,
            singleSelect: true,
            rownumbers: true,
            columns: [[
                    {field: "image", title: "", width: "25%", align: "center", formatter: (value, row, index) => `<img src="${value}" width="50px" height="50px" style="margin-top: 5px; margin-bottom: 5px;" />`},
                    {field: "title", title: "合作机构名称", width: "75%"}
                ]]
        });
        sponsorTable = sponsorComboGrid.combogrid("grid");
        sponsorPager = sponsorTable.datagrid("getPager");
        sponsorPager.pagination({
            onSelectPage: (pageNumber, pageSize) => {
                if (pageNumber > 0) {
                    [currentCooperationPageNumber, currentCooperationPageSize] = [pageNumber, pageSize];
                    loadCooperation((currentCooperationPageNumber - 1) * currentCooperationPageSize, currentCooperationPageSize, sponsorComboGrid.combogrid("getText").trim());
                }
            }
        });

        sponsorComboGrid.combogrid("textbox").attr("maxlength", 100);
        sponsorComboGrid.combogrid("textbox").bind("keydown", event => {
            if (event.keyCode === 13) { // 按下回车
                [currentCooperationPageNumber, currentCooperationPageSize] = [0, 10];
                loadCooperation((currentCooperationPageNumber - 1) * currentCooperationPageSize, currentCooperationPageSize, sponsorComboGrid.combogrid("getText").trim());
            }
        });

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
        startCalendar = $("#self-activity-starttime").datetimebox({
            label: "开始时间<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "必填",
            labelWidth: 100,
            width: "100%",
            height: 38,
            editable: false,
            showSeconds: true,
            buttons: buttonsStart
        });
        endCalendar = $("#self-activity-endtime").datetimebox({
            label: "结束时间<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "必填",
            labelWidth: 100,
            width: "100%",
            height: 38,
            editable: false,
            showSeconds: true,
            buttons: buttonsEnd
        });
        provinceComboBox = $("#self-activity-province").combobox({
            label: "活动地点<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            labelWidth: 100,
            width: "100%",
            height: 38,
            editable: false,
            valueField: "name",
            textField: "name",
            data: SELF.provinceList,
            onChange: (newValue, oldValue) => {
                provinceChanged();
            }
        });
        cityComboBox = $("#self-activity-city").combobox({
            width: "100%",
            height: 38,
            editable: false,
            valueField: "name",
            textField: "name",
            onChange: (newValue, oldValue) => {
                cityChanged();
            }
        });
        areaComboBox = $("#self-activity-area").combobox({
            width: "100%",
            height: 38,
            editable: false,
            valueField: "name",
            textField: "name"
        });
        provinceComboBox.combobox("select", SELF.provinceList[0]["name"]);
        placeTextbox = $("#self-activity-place").textbox({
            prompt: "输入详细地址信息，必填",
            width: "100%",
            height: 38,
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
            labelWidth: 100
        });
        telTextbox.textbox("textbox")
                .attr("maxlength", 20)
                .css("ime-mode", "disabled")
                .keydown(event => event.keyCode === 8 // 退格
                            || event.keyCode === 37 // 左
                            || event.keyCode === 39 // 右
                            || (event.shiftKey && event.keyCode === 187) // 大键盘+
                            || (!event.shiftKey && event.keyCode === 189) // 大键盘-
                            || event.keyCode === 107 // 小键盘+
                            || event.keyCode === 109 // 小键盘-
                            || (!event.shiftKey && event.keyCode >= 48 && event.keyCode <= 57) // 大键盘数字0~9
                            || (event.keyCode >= 96 && event.keyCode <= 105)) // 小键盘数字0~9
                .bind("cut copy paste", event => event.preventDefault()); // 禁用剪切、复制、粘贴

        introTextbox = $("#self-activity-intro").textbox({
            label: "活动摘要<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "请输入活动摘要，300字以内，必填",
            width: "100%",
            height: 100,
            labelWidth: 100,
            multiline: true
        });
        introTextbox.textbox("textbox").attr("maxlength", 300);

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
            disabled: true
        });
        liveAddrTextbox.textbox("textbox").attr("maxlength", 120);

        isLiveCheckbox = $("#self-activity-is-live").switchbutton({
            width: "100%",
            height: 38,
            checked: true,
            onText: "非直播",
            offText: "直播",
            onChange: function (checked) {
                if (checked) {
                    liveAddrTextbox.textbox("disable");
                } else {
                    liveAddrTextbox.textbox("enable");
                }
            }
        });

        maxnumSpinner = $("#self-activity-maxnum").numberspinner({
            label: "参加人数上限<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "输入0则不限制",
            width: "100%",
            height: 38,
            labelWidth: 100,
            min: 0,
            max: 9999
        });
        maxnumSpinner.numberspinner("textbox")
                .attr("maxlength", 4)
                .css("ime-mode", "disabled")
                .keydown(event => event.keyCode === 8 // 退格
                            || event.keyCode === 37 // 左
                            || event.keyCode === 39 // 右
                            || (event.keyCode >= 48 && event.keyCode <= 57) // 大键盘数字0~9
                            || (event.keyCode >= 96 && event.keyCode <= 105)) // 小键盘数字0~9
                .bind("cut copy paste", event => event.preventDefault()); // 禁用剪切、复制、粘贴
        
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
                    {field: "xxx", title: "状态", width: "15%", align: "center", formatter: (value, row, index) => {
                            return "未生效";
                    }, styler: (value, row, index) => {
                        return "color:#C0C0C0;";
                    }},
                    {field: "yyy", title: "操作", width: "20%", align: "center", formatter: (value, row, index) => {
                            let str = ``;
                            str += `<div>` +
                                    `<span style="margin:5px 10px 5px 0px;" data-type="op-edit" data-index=${index}></span>` +
                                    `<span style="margin:5px 10px 5px 0px;" data-type="op-del" data-index=${index}></span>` +
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
            view: detailview,
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
        ticketAddbtn.bind("click", () => {
            SELF.publish("activity-ticket-offline-add");
        });

    }, destoryUI = () => {
        thumbnailPath = undefined;
        imagePath = undefined;

        [currentCooperationPageNumber, currentCooperationPageSize] = [1, 10]; // 初始化第1页，每页10行

        typeList.length = 0;
        themeList.length = 0;

        selectedType = undefined;
        selectedThemeList.length = 0;
        
        ticketArr.length = 0;
        
        $("#self-activity-publish-btn").unbind("click");
        $("#self-activity-draft-btn").unbind("click");

        titleTextbox.textbox("destroy");
        thumbnail.attr("src", "");
        image.attr("src", "");
        sponsorComboGrid.combogrid("destroy");
        sponsorTable = undefined;
        sponsorPager = undefined;
        startCalendar.datetimebox("destroy");
        endCalendar.datetimebox("destroy");
        telTextbox.textbox("destroy");
        provinceComboBox.combobox("destroy");
        cityComboBox.combobox("destroy");
        areaComboBox.combobox("destroy");
        placeTextbox.textbox("destroy");
        introTextbox.textbox("destroy");
        content.txt.clear();
        liveAddrTextbox.textbox("destroy");
        maxnumSpinner.numberspinner("destroy");
        panel.panel("destroy");

    }, preUpload = (isPublish) => {
        if (titleTextbox.textbox("getValue").trim() === "") {
            layer.msg("请填写活动标题");
            return false;
        }
        if (sponsorComboGrid.combogrid("getText").trim() === "") {
            layer.msg("请填写主办单位");
            return false;
        }
        if (telTextbox.textbox("getValue").trim() === "") {
            layer.msg("请输入联系电话");
            return false;
        }
        if (startCalendar.datetimebox("getValue") === "") {
            layer.msg("请选择活动开始时间");
            return false;
        }
        if (endCalendar.datetimebox("getValue") === "") {
            layer.msg("请选择活动结束时间");
            return false;
        }
        if (Date.parse(startCalendar.datetimebox("getValue")) >= Date.parse(endCalendar.datetimebox("getValue"))) {
            layer.msg("活动结束时间不能早于或等于开始时间");
            return false;
        }
        if (placeTextbox.textbox("getValue").trim() === "") {
            layer.msg("请输入详细地址信息");
            return false;
        }
        if (thumbnailPath === undefined) {
            layer.msg("请上传活动封面图");
            return false;
        }
        if (imagePath === undefined) {
            layer.msg("请上传活动海报图");
            return false;
        }
        if (selectedType === undefined) {
            layer.msg("请选择活动类型");
            return false;
        }
        if (introTextbox.textbox("getValue").trim() === "") {
            layer.msg("请输入活动摘要");
            return false;
        }
        if (content.txt.html().length < 20) {
            layer.msg("活动详情内容过少！");
            return false;
        }
        if (isLiveCheckbox.switchbutton("options").checked === false) {
            if (liveAddrTextbox.textbox("getValue").trim() === "") {
                layer.msg("请输入直播地址");
                return false;
            }
        }

        if (maxnumSpinner.numberspinner("getValue") === "") {
            layer.msg("请填写参加人数上限");
            return false;
        }
        
        if (ticketArr.length === 0) {
            layer.msg("请添加票种");
            return false;
        }

        const obj = {
            "title": titleTextbox.textbox("getValue").trim(),
            "thumbnail": thumbnailPath,
            "image": imagePath,
            "type": {
                "id": selectedType
            },
            "start-time": Date.parse(startCalendar.datetimebox("getValue")),
            "end-time": Date.parse(endCalendar.datetimebox("getValue")),
            "province": provinceComboBox.combobox("getValue"),
            "city": cityComboBox.combobox("getValue"),
            "place": placeTextbox.textbox("getValue").trim(),
            "sponsor": sponsorComboGrid.combogrid("getText").trim(),
            "tel": telTextbox.textbox("getValue").trim(),
            "introduction": introTextbox.textbox("getValue").trim(),
            "full-text": content.txt.html(),
            "live": isLiveCheckbox.switchbutton("options").checked === false,
            "max-num": Number.parseInt(maxnumSpinner.numberspinner("getValue")),
            "publish": isPublish === true ? true : false,
            "tickets": ticketArr
        };
        if (areaComboBox.combobox("getValue") !== "其他") {
            obj["area"] = areaComboBox.combobox("getValue");
        }
        if (isLiveCheckbox.switchbutton("options").checked === false) {
            obj["live-url"] = liveAddrTextbox.textbox("getValue").trim();
        }
        if (selectedThemeList.length > 0) {
            obj["themes"] = selectedThemeList.map(themeId => {
                return {
                    id: themeId
                };
            });
        }

        return obj;
    }, requestUpload = obj => {
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
            xhr.open("POST", `/admin/activity`);
            xhr.responseType = "text";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    }, activityUpload = (activityObj) => {
        requestUpload(activityObj).then(activityId => {
            layer.msg("活动保存成功");
            SELF.nav("activity");
        }, error => {
            layer.alert("活动保存失败", {icon: 2, title: false});
            SELF.nav("activity");
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
    }, loadCooperation = (offset, count, title) => {
        sponsorPager.pagination("loading");
        requestCooperation(offset, count, title).then(data => {
            sponsorTable.datagrid("loadData", data["v1"]);
            sponsorPager.pagination({
                total: data["v2"],
                pageNumber: currentCooperationPageNumber,
                pageSize: currentCooperationPageSize
            });
            sponsorPager.pagination("loaded");
        }, error => {
            sponsorPager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, provinceChanged = () => {
        let province = provinceComboBox.combobox("getValue"),
                cityList = SELF.getCityList(province);
        cityComboBox.combobox("clear");
        areaComboBox.combobox("clear");
        cityComboBox.combobox("loadData", cityList);
        if (cityList.length > 0) {
            cityComboBox.combobox("select", cityList[0]["name"]);
        }
    }, cityChanged = () => {
        let province = provinceComboBox.combobox("getValue"),
                city = cityComboBox.combobox("getValue"),
                areaList = [];
        areaComboBox.combobox("clear");
        if (city !== "") {
            areaList = SELF.getAreaList(province, city);
        }

        areaComboBox.combobox("loadData", areaList);
        if (areaList.length > 0) {
            areaComboBox.combobox("select", areaList[0]["name"]);
        }
    }, genTicketOPButton = (ticketData, index) => {
        const edit = $(`#self-activity-ticket-table-container span[data-type=op-edit][data-index=${index}]`).linkbutton({
            iconCls: "icon-edit",
            width: 80,
            text: "编辑"
        });
        
        edit.bind("click", () => {
            SELF.publish("activity-ticket-offline-update", {
                data: ticketData,
                index: index
            });
        });
        
        const del = $(`#self-activity-ticket-table-container span[data-type=op-del][data-index=${index}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 80,
            text: "删除"
        });
        
        del.bind("click", () => {
            let layerIndex = layer.load(1);
            setTimeout(() => {
                ticketArr.splice(index, 1);
                SELF.publish("activity-ticket-offline-refresh");
                layer.close(layerIndex);
            }, 1000);
        });
        
        ticketTable.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", (moduleName) => {
        if (moduleName === "activity-publish") {
            window.Promise.all([requestAllActivityType(), requestThemes(), requestCooperation(0, 10, "")]).then(list => {
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

                sponsorPager.pagination("loading");
                sponsorTable.datagrid("loadData", list[2]["v1"]);
                sponsorPager.pagination({
                    total: list[2]["v2"],
                    pageNumber: currentCooperationPageNumber,
                    pageSize: currentCooperationPageSize
                });
                sponsorPager.pagination("loaded");

                $("#self-activity-publish-btn").bind("click", () => {
                    layer.confirm("是否发布？", {icon: 3, title: null}, function (index) {
                        layer.close(index);
                        let activityObj = preUpload(true);
                        if (typeof activityObj === "object") {
                            activityUpload(activityObj);
                        }
                    });
                });
                
                $("#self-activity-draft-btn").bind("click", () => {
                    let activityObj = preUpload(false);
                    if (typeof activityObj === "object") {
                        activityUpload(activityObj);
                    }
                });

            }, error => {
                SELF.errorHandler(error);
            });
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "activity-publish") {
            destoryUI();
        }
    })("activity-ticket-pre-added", ticket => {
        ticketArr.push(ticket);
        SELF.publish("activity-ticket-offline-refresh");
    })("activity-ticket-pre-updated", obj => {
        ticketArr[obj["index"]] = obj["data"];
        SELF.publish("activity-ticket-offline-refresh");
    })("activity-ticket-offline-refresh", () => {
        ticketTable.datagrid("loadData", ticketArr);
        ticketArr.forEach((data, index) => {
            genTicketOPButton(data, index);
        });
    });
})(this, $, layer, layui.upload, SELF);
