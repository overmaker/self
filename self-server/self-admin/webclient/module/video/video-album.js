((window, $, layer, SELF) => {
    SELF.registeredModule("video-album", "module/video/video-album.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, addBtn, dialogBtn, searchBox] = [undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    let requestVideoAlbumList = (name, offset, count) => {
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
            xhr.open("GET", `/admin/video-album?name=${name}&offset=${offset}&count=${count}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, insertVideoAlbumList = (name) => {
        const xhr = new window.XMLHttpRequest();
        xhr.onloadstart = () => SELF.startLoadAnimation();
        xhr.onloadend = () => SELF.stopLoadAnimation();
        xhr.onload = () => {
            if (xhr.status === 204) {
                dialog.dialog("close");
                loadVideoAlbumList("", 0, 10);
            } else if (xhr.status === 409) {
                layer.msg('视频专辑已存在！');
            } else if (xhr.status === 400) {
                layer.msg('请输入专辑名称！');
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = (evt) => {
            SELF.errorHandler("error");
        };
        xhr.open("POST", `/admin/video-album`);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`name=${name}`);
    }, deleteVideoAlbumList = (id) => {
        const xhr = new window.XMLHttpRequest();
        xhr.onloadstart = () => SELF.startLoadAnimation();
        xhr.onloadend = () => SELF.stopLoadAnimation();
        xhr.onload = () => {
            if (xhr.status === 204) {
                loadVideoAlbumList("", 0, 10);
            } else if (xhr.status === 409) {
                layer.alert("该视频专辑已被其他视频使用，无法删除", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = (evt) => {
            SELF.errorHandler("error");
        };
        xhr.open("DELETE", `/admin/video-album/${id}`);
        xhr.send();
    }, updateVideoAlbum = (name, id) => {
        const xhr = new window.XMLHttpRequest();
        xhr.onloadstart = () => SELF.startLoadAnimation();
        xhr.onloadend = () => SELF.stopLoadAnimation();
        xhr.onload = () => {
            if (xhr.status === 204) {
                dialog.dialog("close");
                loadVideoAlbumList("", 0, 10);
            } else if (xhr.status === 409) {
                layer.msg('视频专辑已存在！');
            } else if (xhr.status === 400) {
                layer.msg('请输入专辑名称！');
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = (evt) => {
            SELF.errorHandler("error");
        };
        xhr.open("PUT", `/admin/video-album/${id}`);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`name=${name}`);
    }, loadVideoAlbumList = (name, offset, count) => {
        pager.pagination("loading");
        requestVideoAlbumList(name, offset, count).then(result => {
            let dataList = result["v1"],
                    total = result["v2"];
            table.datagrid("loadData", dataList);
            pager.pagination({
                total: total,
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            currentId = undefined;

            dataList.forEach((data, index) => {
                genOPButton(data["id"], data["name"], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, createDialog = () => {
        dialog = $("<div class='add-album'><span id='self-text-video-album'></span><span id='self-btn-video-album' class='add-album-submit'></span></div>").appendTo("body");
        dialog.dialog({
            title: " ",
            width: 400,
            height: 135,
            closed: false,
            cache: false,
            modal: true
        });
        const textbox = $("#self-text-video-album").textbox({
            label: "专辑名称",
            width: 220,
            labelWidth: 100
        });
        textbox.textbox("textbox").attr("maxlength", 20);

        dialogBtn = $("#self-btn-video-album").linkbutton({
            text: "确定",
            iconCls: "icon-ok"
        });

        dialogBtn.bind("click", () => {
            /*** 验证特殊字符*/
            if (/[~#^$@%&!*,.，。'“”<>《》{}=；？?/、_【】—（）-]/gi.test($("#self-text-video-album").textbox('getValue'))) {
                layer.msg("不能输入特殊字符！");
                return;
            }
            if ($("#self-text-video-album").textbox('getValue').length > 20) {
                layer.msg("专辑名称输入超长！");
                return;
            }
            if (openType === "add") {
                insertVideoAlbumList($("#self-text-video-album").textbox('getValue'));
            } else if (openType === "edit") {
                updateVideoAlbum($("#self-text-video-album").textbox('getValue'), currentId);
            }
            $("#self-text-video-album").textbox('clear');
        });
    }, genOPButton = (id, name, index) => {
        const edit = $(`#self-admin-module span[data-type=op-edit][data-id=${id}]`).linkbutton({
            iconCls: "icon-edit",
            width: 100,
            text: "编辑"
        });
        edit.bind("click", () => {
            if (!dialog) {
                createDialog();
            }
            dialog.dialog("setTitle", "编辑专辑名称");
            dialog.dialog("open");
            currentId = id;
            openType = "edit";
            $("#self-text-video-album").textbox('setValue', name);
        });

        const del = $(`#self-admin-module span[data-type=op-del][data-id=${id}]`).linkbutton({
            iconCls: "icon-cancel",
            width: 100,
            text: "删除"
        });
        del.bind("click", () => {
            deleteVideoAlbumList(id);
        });

        dynamicButtons.push(edit);
        dynamicButtons.push(del);

        table.datagrid("fixRowHeight", index);
    };

    SELF.subscribe("load-module", moduleName => {
        if (moduleName === "video-album") {
            /* 页面被加载的处理 */
            table = $("#self-module-video-album").datagrid({
                columns: [[
                        {field: "name", title: "专辑名称", width: "40%", align: "center"},
                        {field: "xxx", title: "操作", width: "60%", align: "center", formatter: (value, row, index) => {
                                return `<span style='margin:5px 10px 5px 0px;' data-type="op-edit" data-id=${row["id"]}></span><span style='margin:5px 10px 5px 0px;' data-type="op-del" data-id=${row["id"]}></span>`;
                            }}
                    ]],
                toolbar: "#self-module-video-album-toolbar",
                rownumbers: true,
                pagination: true,
                fitColumns: true,
                singleSelect: true,
                height: "100%"
            });
            pager = table.datagrid("getPager");
            pager.pagination({
                onSelectPage: (pageNumber, pageSize) => {
                    if (pageNumber > 0) {
                        [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                        loadVideoAlbumList(searchBox.searchbox("getValue").trim(), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                    }
                }
            });

            searchBox = $("#self-module-video-album-toolbar-name").searchbox({
                label: "视频专辑",
                width: 400,
                height: 38,
                labelWidth: 100,
                labelAlign: "center",
                prompt: "输入视频专辑名称",
                searcher: (value, name) => {
                    loadVideoAlbumList(value.trim(), 0, 10);
                }
            });
            searchBox.searchbox("textbox").attr("maxlength", 20);

            addBtn = $("#self-module-video-album-toolbar-add").linkbutton({
                text: "添加专辑",
                height: 38,
                iconCls: "icon-add"
            });

            addBtn.bind("click", () => {
                if (!dialog) {
                    createDialog();
                }
                dialog.dialog("setTitle", "新建专辑");
                dialog.dialog("open");
                openType = "add";
                $("#self-text-video-album").textbox('clear');
            });
            loadVideoAlbumList("", 0, 10);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "video-album") {
            /* 卸载动作 */
            [table, pager] = [undefined, undefined];
            [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行

            /* 卸载对话框 */
            if (dialog) {
                dialog.dialog("destroy");
            }
            dialog = undefined;

            if (addBtn) {
                addBtn.unbind("click");
            }
            addBtn = undefined;

            if (dialogBtn) {
                dialogBtn.unbind("click");
            }
            dialogBtn = undefined;

            /* 卸载动态按钮 */
            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            searchBox.searchbox("destroy");
            searchBox = undefined;

            currentId = undefined;
            openType = undefined;
        }
    });
})(this, $, layer, SELF);
