((window, $, layer, SELF) => {
    SELF.registeredPopup("friendship-link-add", "module/advertisement/friendship-link-add.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, tooltipTextBox, linkUrlTextBox, dialogBtn, imageTextBox, imageBtn] = [undefined, undefined, undefined, undefined, undefined, undefined];
    
    let [imagePath, currentId] = [undefined, undefined];
    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    let insertFriendshipLink = (tooltip, image, linkUrl) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-friendship-link-add");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/friendship-link`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`tooltip=${tooltip}&image=${image}&linkUrl=${linkUrl}`);
        });
    }, addFriendshipLinkVerification = (tooltip, imagePath, linkUrl) => {
        const [friendshipLinkTooltip, image, friendshipLinkLinkUrl] =
                [tooltip, imagePath, linkUrl];
        if (friendshipLinkTooltip === "" || friendshipLinkTooltip === null) {
            layer.msg("请输入媒体提示！");
            tooltipTextBox.textbox({
                required: true
            });
            return "false";
        }

        if (friendshipLinkLinkUrl === "" || friendshipLinkLinkUrl === null) {
            layer.msg("请输入媒体地址！");
            linkUrlTextBox.textbox({
                required: true
            });
            return "false";
        }

        if (image === "" || image === null) {
            layer.msg("请添加图片！");
            return "false";
        }
    };


    SELF.subscribe("friendship-link-add", () => {
        let html = SELF.getPopupHtml("friendship-link-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建合作媒体",
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
        
        tooltipTextBox = $("#self-text-friendship-link-tooltip").textbox({
            label: "媒体提示：",
            labelWidth: 100,
            width: 450
        });
        tooltipTextBox.textbox("textbox").attr("maxlength", 45);  
        
        imageTextBox = $("#self-text-friendship-link-image").filebox({
            width: 300,
            buttonText: "&nbsp;选择图片&nbsp;",
            accept: "image/*"
        });
        
        linkUrlTextBox = $("#self-text-friendship-link-linkUrl").textbox({
            label: "媒体地址：",
            width: 450,
            labelWidth: 100
        });
        linkUrlTextBox.textbox("textbox").attr("maxlength", 100);    
        
        imageBtn = $("#self-text-friendship-link-fileimage").linkbutton({
            text: "上传",
            width: 45,
            height: 24,
            onClick: function () {
                const files = imageTextBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择图片！");
                    return;
                }
                SELF.fileUpload("friendship-link-add-image", files[0]).then(filePath => {
                    imagePath = filePath;
                    imageTextBox.filebox("setText", imagePath);
                    document.getElementById("friendship-link-image-image").src = imagePath;
                }, error => {
                    console.log(error);
                });
            }
        });
        
        dialogBtn = $("#self-btn-friendship-link-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

        dialogBtn.bind("click", () => {
            
            /** 获取参数*/
            const tooltip = tooltipTextBox.textbox("getValue");
            const linkUrl = linkUrlTextBox.textbox("getValue");
            if (imagePath === undefined) {
                imagePath = "";
            }
            
            let result = addFriendshipLinkVerification(tooltip, imagePath, linkUrl);
            if (result !== "false") {
                insertFriendshipLink(tooltip, imagePath, linkUrl);
            }
        });

    });

})(this, $, layer, SELF);