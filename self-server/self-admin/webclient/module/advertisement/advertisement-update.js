((window, $, layer, SELF) => {
    SELF.registeredPopup("advertisement-update", "module/advertisement/advertisement-upload.html");
    var titleType;

    let [dialog,
        titleTextbox,
        thumbnail, thumbnailFilebox, thumbnailUploadBtn,
        typeComboBox, targetCombogrid,
        publishSwitch,
        okBtn] =
            [undefined,
                undefined,
                undefined, undefined, undefined,
                undefined, undefined,
                undefined,
                undefined];

    let thumbnailPath = undefined;
    let searchBox = undefined;
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

    const initUI = () => {
        let html = SELF.getPopupHtml("advertisement-upload");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑轮播",
            width: 850,
            height: 550,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });

        titleTextbox = $("#self-adver-title").textbox({
            label: "标题",
            prompt: "请填写标题，不要超过50字，必填",
            width: "95%",
            labelWidth: 100
        });
        titleTextbox.textbox("textbox").attr("maxlength", 50);

        thumbnail = $("#self-adver-thumbnail");
        thumbnailFilebox = $("#self-adver-thumbnail-filebox").filebox({
            prompt: "先选择图片文件，再点击上传按钮完成上传操作",
            width: "100%",
            buttonText: "&nbsp;选择图片文件&nbsp;",
            accept: "image/*"
        });
        thumbnailUploadBtn = $("#self-adver-thumbnail-btn").linkbutton({
            text: "上传",
            width: "100%"
        });

        targetCombogrid = $("#self-adver-target").combogrid({
            label: "轮播目标",
            labelWidth: 100,
            panelWidth: 600,
            panelHeight: 350,
            width: "100%",
            editable: false,
            pagination: true,
            fitColumns: true,
            singleSelect: true,
            rownumbers: true
        });

        publishSwitch = $("#self-adver-publish").switchbutton({
            checked: true,
            handleText: "是否发布",
            handleWidth: 120,
            onText: "发布",
            offText: "暂不发布",
            width: "100%"
        });

        typeComboBox = $("#self-adver-type").combobox({
            label: "轮播类型",
            labelWidth: 100,
            width: "100%",
            editable: false,
            valueField: "id",
            textField: "name",
            data: [{id: "activity",
                    name: "活动",
                    selected: true}, {
                    id: "video",
                    name: "视频"
                }, {
                    id: "product",
                    name: "周边商品"
                }],
            onChange: (newValue, oldValue) => loadTarget(newValue)
        });

        thumbnailUploadBtn.bind("click", () => {
            const files = thumbnailFilebox.filebox("files");
            if (files.length === 0) {
                layer.msg("请选择缩略图！");
                return;
            }
            if (files[0].size > 5242880) {
                layer.msg("图片尺寸应小于5M！");
                return;
            }
            if (files[0].name.length >= 20) {
                layer.msg("图片文件名应小于20字符！");
                return;
            }
            SELF.fileUpload("adver-upload-image", files[0]).then(filePath => {
                thumbnailPath = filePath;
                thumbnailFilebox.filebox("setText", thumbnailPath);
                thumbnail.attr("src", thumbnailPath);
            }, error => {
                SELF.errorHandler(error);
            });
        });
        
     //定义标题搜索点击事件   
        $(".l-btn-text").click(function () {
let searchTitle=$("#txtadvertisement-type").val();
if (titleType === "activity") {
    targetCombogrid.combogrid({
        idField: "id",
        textField: "title",
        columns: [[
                {field: "title", title: "活动标题", width: "33%", align: "center"},
                {field: "start-time", title: "开始时间", width: "33%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                {field: "end-time", title: "结束时间", width: "33%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()}
            ]],
        toolbar:'#myToolbar'
    });
    [currentPageNumber, currentPageSize] = [1, 10];
    table = targetCombogrid.combogrid("grid");
    pager = table.datagrid("getPager");
    pager.pagination({
        onSelectPage: (pageNumber, pageSize) => {
            if (pageNumber > 0) {
                [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                loadActivityList((currentPageNumber - 1) * currentPageSize, currentPageSize,searchTitle);
            }
        }
    });
    loadActivityList(currentPageNumber, currentPageSize,searchTitle);            
} else if (titleType === "video") {
    targetCombogrid.combogrid({
        idField: "id",
        textField: "title",
        columns: [[
                {field: "title", title: "视频标题", width: "60%", align: "center"},
                {field: "type", title: "视频类型", width: "20%", align: "center", formatter: (type, row, index) => type.name},
                {field: "vip", title: "是否是VIP", width: "20%", align: "center", formatter: (value, row, index) => value === true ? "是" : "否"}
            ]],
            toolbar:'#myToolbar'
    });
    [currentPageNumber, currentPageSize] = [1, 10];
    table = targetCombogrid.combogrid("grid");
    pager = table.datagrid("getPager");
    pager.pagination({
        onSelectPage: (pageNumber, pageSize) => {
            if (pageNumber > 0) {
                [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                loadVideoList((currentPageNumber - 1) * currentPageSize, currentPageSize,searchTitle);
            }
        }
    });
    loadVideoList(currentPageNumber, currentPageSize, searchTitle);
} else if (titleType === "product") {
    targetCombogrid.combogrid({
        idField: "id",
        textField: "name",
        columns: [[
                {field: "name", title: "商品名称", width: "33%", align: "center"},
                {field: "sn", title: "商品编号", width: "33%", align: "center"},
                {field: "type", title: "所属类别", width: "33%", align: "center", formatter: (value, row, index) => value.name}
            ]],
            toolbar:'#myToolbar'
    });
    [currentPageNumber, currentPageSize] = [1, 10];
    table = targetCombogrid.combogrid("grid");
    pager = table.datagrid("getPager");
    pager.pagination({
        onSelectPage: (pageNumber, pageSize) => {
            if (pageNumber > 0) {
                [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                loadProductList((currentPageNumber - 1) * currentPageSize, currentPageSize, searchTitle);
            }
        }
    });
    loadProductList(currentPageNumber, currentPageSize, searchTitle);
}

        });

        okBtn = $("#self-adver-ok-btn").linkbutton({
            text: "确定",
            width: "100%"
        });

    }, destoryUI = () => {

        [table, pager] = [undefined, undefined];
        [currentPageNumber, currentPageSize] = [1, 10];

        titleTextbox.textbox("destroy");

        thumbnail.attr("src", "");
        thumbnailPath = undefined;
        typeComboBox.combobox("destroy");
        targetCombogrid.combogrid("destroy");
        thumbnailFilebox.filebox("destroy");
        thumbnailUploadBtn.unbind("click");
        okBtn.unbind("click");

        dialog.dialog("destroy");

        [dialog,
            titleTextbox,
            thumbnail, thumbnailFilebox, thumbnailUploadBtn,
            typeComboBox, targetCombogrid,
            publishSwitch,
            okBtn] =
                [undefined,
                    undefined,
                    undefined, undefined, undefined,
                    undefined, undefined,
                    undefined,
                    undefined];

    }, loadTarget = (type) => {
    	titleType=type;
    	$("#txtadvertisement-type").val("");
        if (type === "activity") {
            targetCombogrid.combogrid({
                idField: "id",
                textField: "title",
                columns: [[
                        {field: "title", title: "活动标题", width: "33%", align: "center"},
                        {field: "start-time", title: "开始时间", width: "33%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()},
                        {field: "end-time", title: "结束时间", width: "33%", align: "center", formatter: (value, row, index) => new Date(value).toLocaleString()}
                    ]],
                toolbar:'#myToolbar'
            });
            [currentPageNumber, currentPageSize] = [1, 10];
            table = targetCombogrid.combogrid("grid");
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadActivityList((currentPageNumber - 1) * currentPageSize, currentPageSize,"");
                    }
                }
            });
            loadActivityList(currentPageNumber, currentPageSize,"");            
        } else if (type === "video") {
            targetCombogrid.combogrid({
                idField: "id",
                textField: "title",
                columns: [[
                        {field: "title", title: "视频标题", width: "60%", align: "center"},
                        {field: "type", title: "视频类型", width: "20%", align: "center", formatter: (type, row, index) => type.name},
                        {field: "vip", title: "是否是VIP", width: "20%", align: "center", formatter: (value, row, index) => value === true ? "是" : "否"}
                    ]],
                    toolbar:'#myToolbar'
            });
            [currentPageNumber, currentPageSize] = [1, 10];
            table = targetCombogrid.combogrid("grid");
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadVideoList((currentPageNumber - 1) * currentPageSize, currentPageSize, "");
                    }
                }
            });
            loadVideoList(currentPageNumber, currentPageSize, "");
        } else if (type === "product") {
            targetCombogrid.combogrid({
                idField: "id",
                textField: "name",
                columns: [[
                        {field: "name", title: "商品名称", width: "33%", align: "center"},
                        {field: "sn", title: "商品编号", width: "33%", align: "center"},
                        {field: "type", title: "所属类别", width: "33%", align: "center", formatter: (value, row, index) => value.name}
                    ]],
                    toolbar:'#myToolbar'
            });
            [currentPageNumber, currentPageSize] = [1, 10];
            table = targetCombogrid.combogrid("grid");
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadProductList((currentPageNumber - 1) * currentPageSize, currentPageSize, "");
                    }
                }
            });
            loadProductList(currentPageNumber, currentPageSize, "");
        }
    }, requestActivityList = (offset, count,title) => {
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
            let query = `/admin/activity?offset=${offset}&count=${count}`;
            if (title.length > 0) {
                query += `&title=${title}`;
            }
            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadActivityList = (offset, count,title) => {
        pager.pagination("loading");
        requestActivityList(offset, count,title).then(data => {
            table.datagrid("loadData", data["v1"]);
            pager.pagination({
                total: data["v2"],
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });
            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, requestVideoList = (offset, count, title) => {
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
            let query = `/admin/video?offset=${offset}&count=${count}`;
            if (title.length > 0) {
                query += `&title=${title}`;
            }
            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadVideoList = (offset, count, title) => {
        pager.pagination("loading");
        requestVideoList(offset, count, title).then(data => {
            table.datagrid("loadData", data["v1"]);
            pager.pagination({
                total: data["v2"],
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });
            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, requestProductList = (offset, count, name) => {
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
            let query = `/admin/product?offset=${offset}&count=${count}`;
            if (name.length > 0) {
                query += `&name=${name}`;
            }
            xhr.open("GET", query);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadProductList = (offset, count, name) => {
        pager.pagination("loading");
        requestProductList(offset, count, name).then(data => {
            table.datagrid("loadData", data["v1"]);
            pager.pagination({
                total: data["v2"],
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });
            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, requestAdvertisement = id => {
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
            xhr.open("GET", `/admin/advertisement/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadAdvertisement = id => {
        requestAdvertisement(id).then(advertisement => {
            titleTextbox.textbox("setValue", advertisement.title);

            if (advertisement.image.length > 0) {
                thumbnailPath = advertisement.image;
                thumbnail.attr("src", thumbnailPath);
                thumbnailFilebox.filebox("setText", advertisement.image);
            }

            typeComboBox.combobox("setValue", advertisement.type);
            targetCombogrid.combogrid("setValue", {id: advertisement["target-id"], title: advertisement["target-text"]});

            publishSwitch.switchbutton({
                checked: advertisement["is-publish"]
            });

            okBtn.bind("click", () => {
                let title = titleTextbox.textbox("getValue").trim(),
                        type = typeComboBox.combobox("getValue"),
                        targetId = targetCombogrid.combogrid("getValue"),
                        targetText = targetCombogrid.combogrid("getText");

                if (title === "") {
                    layer.msg("请填写标题");
                    return;
                }
                if (thumbnailPath === undefined) {
                    layer.msg("请选择海报");
                    return;
                }
                if (targetId === undefined || targetId === "") {
                    layer.msg("请选择轮播目标");
                    return;
                }

                const obj = {
                    "id": id,
                    "title": title,
                    "image": thumbnailPath,
                    "type": type,
                    "target-id": Number.parseFloat(targetId),
                    "target-text": targetText,
                    "is-publish": publishSwitch.switchbutton("options").checked
                };

                updateAdver(obj).then(() => {
                    SELF.publish("adver-list-refresh");
                    dialog.dialog("close");
                }, error => {
                    SELF.errorHandler(error);
                    SELF.publish("adver-list-refresh");
                    dialog.dialog("close");
                });
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateAdver = obj => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/advertisement`);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    };

    SELF.subscribe("advertisement-update", id => {
        initUI();
        loadAdvertisement(id);
    });
})(this, $, layer, SELF);