((window, $, layer, upload, SELF) => {
    SELF.registeredModule("video-publish", "module/video/video-publish.html");

    let [panel, titleTextbox,
        subtitleEn, subtitleEnBtn,
        subtitleZh, subtitleZhBtn,
        subtitleEs, subtitleEsBtn,
        typeCombobox, themeCombobox, albumCombobox, speakerCombogrid, activityCombogrid, ageCombobox,
        speakerTable, speakerPager,
        activityTable, activityPager,
        themeBtn, speakerBtn,
        introduction,
        thumbnail,
        vipSwitchbutton, recommendSwitchbutton,
        draftBtn, publishBtn] = [];
    
    let [videoPath, subtitleEnPath, subtitleZhPath, subtitleEsPath, thumbnailPath] = [];
    
    let themeArray = [];
    let speakerArray = [];
    
    let [currentSpeakerPageNumber, currentSpeakerPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [currentActivityPageNumber, currentActivityPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [searchSpeakerName, searchActivityTitle] = ["", ""];

    const initUI = () => {
        panel = $("#self-module-video-publish").panel();

        titleTextbox = $("#self-video-title").textbox({
            label: "视频标题<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "请填写视频标题，不要超过80字，必填",
            width: "100%",
            labelWidth: 125,
            height: 38
        });
        titleTextbox.textbox("textbox").attr("maxlength", 80);

        subtitleEn = $("#self-video-subtitle-en").filebox({
            label: "英文字幕文件",
            labelWidth: 125,
            height: 38,
            width: "100%",
            buttonText: "&nbsp;选择字幕文件&nbsp;",
            accept: "text/vtt"
        });
        
        subtitleEnBtn = $("#self-video-subtitle-en-btn");
        subtitleEnBtn.bind("click", () => {
            const files = subtitleEn.filebox("files");
            if (files.length === 0) {
                layer.msg("未选择英文视频字幕文件！");
                return;
            }
            if (!files[0].name.endsWith(".vtt")) {
                layer.msg("字幕文件必须是vtt格式！");
                return;
            }
            SELF.fileUpload("video-upload-subtitle", files[0]).then(filePath => {
                subtitleEnPath = filePath;
                subtitleEn.filebox("setText", subtitleEnPath);
            }, error => {
                SELF.errorHandler(error);
            });
        });

        subtitleZh = $("#self-video-subtitle-zh").filebox({
            label: "中文字幕文件",
            labelWidth: 125,
            height: 38,
            width: "100%",
            buttonText: "&nbsp;选择字幕文件&nbsp;",
            accept: "text/vtt"
        });
        
        subtitleZhBtn = $("#self-video-subtitle-zh-btn");
        subtitleZhBtn.bind("click", () => {
            const files = subtitleZh.filebox("files");
            if (files.length === 0) {
                layer.msg("未选择中文视频字幕文件！");
                return;
            }
            if (!files[0].name.endsWith(".vtt")) {
                layer.msg("字幕文件必须是vtt格式！");
                return;
            }
            SELF.fileUpload("video-upload-subtitle", files[0]).then(filePath => {
                subtitleZhPath = filePath;
                subtitleZh.filebox("setText", subtitleZhPath);
            }, error => {
                SELF.errorHandler(error);
            });
        });

        subtitleEs = $("#self-video-subtitle-es").filebox({
            label: "西班牙文字幕文件",
            labelWidth: 125,
            height: 38,
            width: "100%",
            buttonText: "&nbsp;选择字幕文件&nbsp;",
            accept: "text/vtt"
        });
        
        subtitleEsBtn = $("#self-video-subtitle-es-btn");
        subtitleEsBtn.bind("click", () => {
            const files = subtitleEs.filebox("files");
            if (files.length === 0) {
                layer.msg("未选择西班牙文视频字幕文件！");
                return;
            }
            if (!files[0].name.endsWith(".vtt")) {
                layer.msg("字幕文件必须是vtt格式！");
                return;
            }
            SELF.fileUpload("video-upload-subtitle", files[0]).then(filePath => {
                subtitleEsPath = filePath;
                subtitleEs.filebox("setText", subtitleEsPath);
            }, error => {
                SELF.errorHandler(error);
            });
        });

        typeCombobox = $("#self-video-type").combobox({
            label: "分类<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            prompt: "请选择视频分类",
            labelWidth: 125,
            width: "100%",
            height: 38,
            editable: false,
            panelHeight: 180,
            valueField: "id",
            textField: "name"
        });

        themeCombobox = $("#self-video-theme").combobox({
            label: "主题<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            labelWidth: 125,
            width: "100%",
            height: 38,
            editable: false,
            panelHeight: 180,
            valueField: "id",
            textField: "name"
        });
        
        themeBtn = $("#self-video-theme-btn");
        themeBtn.bind("click", () => {
            let themeId = themeCombobox.combobox("getValue");
            let themeName = themeCombobox.combobox("getText");
            if (themeId !== "" && themeArray.find(n => n === Number.parseInt(themeId)) === undefined) {
                themeArray.push(Number.parseInt(themeId));
                $("#self-video-theme-container").append(`<button data-id="${themeId}" class="layui-btn layui-btn-primary layui-btn-sm">${themeName}&nbsp;&nbsp;<i class="layui-icon layui-icon-close" style="font-weight:bold;"></i></button>`);
            }
        });
        
        $("#self-video-theme-container").bind("click", event => {
            let target = $(event.target);
            if (target.is("i")) {
                let themeId = target.parent().attr("data-id");
                themeArray.splice(themeArray.findIndex(n => n === Number.parseInt(themeId)), 1);
                target.parent().remove();
            }
        });

//        albumCombobox = $("#self-video-album").combobox({
//            label: "专辑<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
//            prompt: "请选择视频专辑",
//            labelWidth: 125,
//            width: "100%",
//            height: 38,
//            editable: false,
//            panelHeight: 180,
//            valueField: "id",
//            textField: "name"
//        });

        speakerCombogrid = $("#self-video-sperker").combogrid({
            label: "演讲者<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            labelWidth: 125,
            width: "100%",
            height: 38,
            editable: false,
            idField: "id",
            textField: "name",
            pagination: true,
            fitColumns: true,
            singleSelect: true,
            rownumbers: true,
            columns: [[
                    {field: "photo", title: "", width: "25%", align: "center", formatter: (value, row, index) => `<img src="${value}" width="50px" height="50px" style="margin-top: 5px; margin-bottom: 5px;" />`},
                    {field: "name", title: "姓名", width: "75%"}
                ]],
            toolbar: "#self-video-sperker-toolbar"
        });
        
        $("#self-video-sperker-name").searchbox({
            label: "演讲者姓名",
            labelWidth: 100,
            width: 300,
            height: 38,
            searcher: function (value, name) {
                [currentSpeakerPageNumber, currentSpeakerPageSize] = [1, 10]; // 初始化第1页，每页10行
                searchSpeakerName = value.trim();
                loadSpeaker((currentSpeakerPageNumber - 1) * currentSpeakerPageSize, currentSpeakerPageSize, searchSpeakerName);
            },
            prompt: "输入演讲者姓名"
        });
        
        speakerTable = speakerCombogrid.combogrid("grid");
        speakerPager = speakerTable.datagrid("getPager");
        speakerPager.pagination({
            onSelectPage: (pageNumber, pageSize) => {
                if (pageNumber > 0) {
                    [currentSpeakerPageNumber, currentSpeakerPageSize] = [pageNumber, pageSize];
                    loadSpeaker((currentSpeakerPageNumber - 1) * currentSpeakerPageSize, currentSpeakerPageSize, searchSpeakerName);
                }
            }
        });
        
        speakerBtn = $("#self-video-sperker-btn");
        speakerBtn.bind("click", () => {
            let speakerId = speakerCombogrid.combogrid("getValue");
            let speakerName = speakerCombogrid.combogrid("getText");
            if (speakerId !== "" && speakerArray.find(n => n === Number.parseInt(speakerId)) === undefined) {
                if (speakerArray.length > 0) {
                    layer.msg("暂时只支持上传一名演讲者");
                    return;
                }
                speakerArray.push(Number.parseInt(speakerId));
                $("#self-video-speaker-container").append(`<button data-id="${speakerId}" class="layui-btn layui-btn-primary layui-btn-sm">${speakerName}&nbsp;&nbsp;<i class="layui-icon layui-icon-close" style="font-weight:bold;"></i></button>`);
            }
        });
        
        $("#self-video-speaker-container").click(event => {
            let target = $(event.target);
            if (target.is("i")) {
                let speakerId = target.parent().attr("data-id");
                speakerArray.splice(speakerArray.findIndex(n => n === Number.parseInt(speakerId)), 1);
                target.parent().remove();
            }
        });

        ageCombobox = $("#self-video-age").combobox({
            label: "年龄段<i style='color:red;font-size:1.2em;font-weight:bold;'>&nbsp;*</i>",
            labelWidth: 125,
            width: "100%",
            height: 38,
            editable: false,
            panelHeight: 160,
            valueField: "id",
            textField: "name",
            data: [{id: "0",
                    name: "儿童"
                }, {
                    id: "1",
                    name: "少年"
                }, {
                    id: "2",
                    name: "青少年",
                    selected: true
                }, {
                    id: "3",
                    name: "青年"
                }, {
                    id: "4",
                    name: "中老年"
                }]
        });

        activityCombogrid = $("#self-video-activity").combogrid({
            label: "所属活动",
            prompt: "请选择视频所属活动",
            labelWidth: 125,
            width: "100%",
            height: 38,
            editable: false,
            idField: "id",
            textField: "title",
            pagination: true,
            fitColumns: true,
            singleSelect: true,
            rownumbers: true,
            columns: [[
                    {field: "thumbnail", title: "", width: "25%", align: "center", formatter: (value, row, index) => `<img src="${value}" width="50px" height="50px" style="margin-top: 5px; margin-bottom: 5px;" />`},
                    {field: "title", title: "标题", width: "75%"}
                ]],
            toolbar: "#self-video-activity-toolbar"
        });
        
        $("#self-video-activity-title").searchbox({
            label: "活动标题",
            labelWidth: 100,
            width: 300,
            height: 38,
            searcher: function (value, name) {
                [currentActivityPageNumber, currentActivityPageSize] = [1, 10]; // 初始化第1页，每页10行
                searchActivityTitle = value.trim();
                loadActivityList((currentActivityPageNumber - 1) * currentActivityPageSize, currentActivityPageSize, searchActivityTitle);
            },
            prompt: "输入活动标题"
        });
        
        activityTable = activityCombogrid.combogrid("grid");
        activityPager = activityTable.datagrid("getPager");
        activityPager.pagination({
            onSelectPage: (pageNumber, pageSize) => {
                if (pageNumber > 0) {
                    [currentActivityPageNumber, currentActivityPageSize] = [pageNumber, pageSize];
                    loadActivityList((currentActivityPageNumber - 1) * currentActivityPageSize, currentActivityPageSize, searchActivityTitle);
                }
            }
        });

        let wangEditor = window.wangEditor;
        introduction = new wangEditor("#self-video-introduction");
        introduction.customConfig.menus = [
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
        introduction.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        introduction.customConfig.uploadFileName = "file";
        introduction.create();
        
        thumbnail = $("#self-video-thumbnail");
        
        let thumbnailUploadInst = upload.render({
            elem: thumbnail,
            url: "/admin/files/layui/video-upload-thumbnail",
            method: "POST",
            accept: "images",
            acceptMime: "image/*",
            size: 2048,
            auto: false,
            choose: (obj) => {
                obj.preview((index, file, result) => {
                    if (file.name.length >= 20) {
                        layer.msg("图片文件名应小于20字符！");
                        thumbnailUploadInst.config.elem.next()[0].value="";
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
                thumbnailUploadInst.config.elem.next()[0].value="";
            }
        });
        
//        vipSwitchbutton = $("#self-video-check-vip").switchbutton({
//            handleText: "VIP视频",
//            handleWidth: 120,
//            onText: "是",
//            offText: "否",
//            width: "100%",
//            height: 38
//        });
        
        recommendSwitchbutton = $("#self-video-check-recommend").switchbutton({
            handleText: "首页显示",
            handleWidth: 120,
            onText: "是",
            offText: "否",
            width: "100%",
            height: 38
        });
        
        draftBtn = $("#self-video-draft-btn");
        publishBtn = $("#self-video-publish-btn");
        
    }, destoryUI = () => {
        themeArray.length = 0;
        speakerArray.length = 0;
        [searchSpeakerName, searchActivityTitle] = ["", ""];
        
        [currentSpeakerPageNumber, currentSpeakerPageSize] = [1, 10]; // 初始化第1页，每页10行
        [currentActivityPageNumber, currentActivityPageSize] = [1, 10]; // 初始化第1页，每页10行
        
        [videoPath, subtitleEnPath, subtitleZhPath, subtitleEsPath, thumbnailPath] = [];
        
        subtitleEnBtn.unbind("click");
        subtitleZhBtn.unbind("click");
        subtitleEsBtn.unbind("click");
        draftBtn.unbind("click");
        publishBtn.unbind("click");
        
        thumbnail.attr("src", "");
        titleTextbox.textbox("destroy");
        subtitleEn.filebox("destroy");
        subtitleZh.filebox("destroy");
        subtitleEs.filebox("destroy");
        typeCombobox.combobox("destroy");
        themeCombobox.combobox("destroy");
//        albumCombobox.combobox("destroy");
        speakerCombogrid.combogrid("destroy");
        introduction.txt.clear();
        activityCombogrid.combogrid("destroy");
        ageCombobox.combobox("destroy");
        introduction.txt.clear();
        panel.panel("destroy");
    }, requestAllVideoType = () => {
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
            xhr.open("GET", `/admin/video-type?name=&offset=0&count=1000`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, requestAllVideoTheme = () => {
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
            xhr.open("GET", `/admin/video-theme?name=&offset=0&count=1000`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, requestAllVideoAlbum = () => {
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
            xhr.open("GET", `/admin/video-album?name=&offset=0&count=1000`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, requestSpeaker = (offset, count, name) => {
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
            xhr.open("GET", `/admin/speaker/admin?offset=${offset}&count=${count}&name=${name}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadSpeaker = (offset, count, name) => {
        speakerPager.pagination("loading");
        requestSpeaker(offset, count, name).then(result => {
            speakerTable.datagrid("loadData", result["v1"]);
            speakerPager.pagination({
                total: result["v2"],
                pageNumber: currentSpeakerPageNumber,
                pageSize: currentSpeakerPageSize
            });
            speakerPager.pagination("loaded");
        }, error => {
            speakerPager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, requestActivityList = (offset, count, title) => {
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
            xhr.open("PUT", `/admin/activity/list?offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            let obj = {
                publish: true
            };
            if (title) {
                obj["title"] = title;
            }
            xhr.send(JSON.stringify(obj));
        });
    }, loadActivityList = (offset, count, title) => {
        activityPager.pagination("loading");
        requestActivityList(offset, count, title).then(result => {
            activityTable.datagrid("loadData", result["v1"]);
            activityPager.pagination({
                total: result["v2"],
                pageNumber: currentActivityPageNumber,
                pageSize: currentActivityPageSize
            });
            activityPager.pagination("loaded");
        }, error => {
            activityPager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, preUpload = (isPublish) => {
        let title = titleTextbox.textbox("getValue").trim(),
                type = typeCombobox.combobox("getValue"),
//                album = albumCombobox.combobox("getValue"),
                activityId = activityCombogrid.combogrid("getValue"),
                intro = introduction.txt.html();
        if (title === "") {
            layer.msg("请填写视频标题");
            return false;
        }
        if (type === "") {
            layer.msg("请选择视频分类");
            return false;
        }
        if (themeArray.length === 0) {
            layer.msg("没有添加视频主题");
            return false;
        }
//        if (album === "") {
//            layer.msg("没有选择视频专辑");
//            return false;
//        }
        if (speakerArray.length === 0) {
            layer.msg("没有添加演讲者");
            return false;
        }
        if (thumbnailPath === undefined) {
            layer.msg("没有上传封面图");
            return false;
        }
        if (intro.length < 20) {
            layer.msg("视频简介内容过少");
            return false;
        }
        
        let video = {
            "title": title,
            "introduction": intro,
            "thumbnail": thumbnailPath,
            "vip": false,
            "recommend": recommendSwitchbutton.switchbutton("options").checked,
            "enable": isPublish === true ? true: false,
            "path": videoPath,
            "type": {
                "id": type
            },
            "album": {
                "id": album
            },
            "themes": themeArray.map(item => {
                return {id: item};
            }),
            "age": ageCombobox.combobox("getValue"),
            "speakers": speakerArray.map(item => {
                return {id: item};
            })
        };
        if (subtitleEnPath !== undefined) {
            video["en-subtitle"] = subtitleEnPath;
        }
        if (subtitleZhPath !== undefined) {
            video["zh-subtitle"] = subtitleZhPath;
        }
        if (subtitleEsPath !== undefined) {
            video["es-subtitle"] = subtitleEsPath;
        }
        if (activityId && activityId !== "") {
            video["activity-id"] = activityId;
        }
        
        return video;
    }, requestUpload = (video) => {
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
            xhr.open("POST", `/admin/video/`);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(video));
        });
    }, videoUpload = (video) => {
        requestUpload(video).then(() => {
            layer.msg("视频信息保存成功");
            SELF.nav("video");
        }, error => {
            layer.alert("视频信息保存失败", {icon: 2, title: false});
            SELF.nav("video");
        });
    };

    SELF.subscribe("load-module", (moduleName, videoServerPath) => {
        if (moduleName === "video-publish") {
            videoPath = videoServerPath;
            initUI();
            window.Promise.all([requestAllVideoType(), requestAllVideoTheme(), requestAllVideoAlbum(), requestSpeaker(0, 10, ""), requestActivityList(0, 10, undefined)]).then(list => {
                typeCombobox.combobox("loadData", list[0]["v1"]);
                themeCombobox.combobox("loadData", list[1]["v1"]);
//                albumCombobox.combobox("loadData", list[2]["v1"]);
                speakerTable.datagrid("loadData", list[3]["v1"]);
                speakerPager.pagination({
                    total: list[3]["v2"],
                    pageNumber: currentSpeakerPageNumber,
                    pageSize: currentSpeakerPageSize
                });
                activityTable.datagrid("loadData", list[4]["v1"]);
                activityPager.pagination({
                    total: list[4]["v2"],
                    pageNumber: currentActivityPageNumber,
                    pageSize: currentActivityPageSize
                });
                
                draftBtn.bind("click", () => {
                    let videoObj = preUpload(false);
                    if (typeof videoObj === "object") {
                        videoUpload(videoObj);
                    }
                });

                publishBtn.bind("click", () => {
                    let videoObj = preUpload(true);
                    if (typeof videoObj === "object") {
                        videoUpload(videoObj);
                    }
                });
            }, error => {
                SELF.errorHandler(error);
            });
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "video-publish") {
            destoryUI();
        }
    });
})(this, $, layer, layui.upload, SELF);
