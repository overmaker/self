((window, $, layer, SELF) => {
    SELF.registeredPopup("friendship-link-update", "module/advertisement/friendship-link-add.html");

    let[dialog,
        tooltipTextBox, imageTextBox, linkUrlTextBox,
        imageBtn, 
        okBtn
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, 
        undefined];
    
    let [imagePath] = [undefined]; 

    const initUI = () => {
        const html = SELF.getPopupHtml("friendship-link-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑合作媒体 ",
            width: 600,
            height: 400,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
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
        linkUrlTextBox.textbox("textbox").attr("maxlength", 500);    
        
        imageBtn = $("#self-text-friendship-link-fileimage").linkbutton({
            text: "上传",
            width: 45,
            height: 24
        });
        
        okBtn = $("#self-btn-friendship-link-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        tooltipTextBox.textbox("destroy");
        linkUrlTextBox.textbox("destroy");
        imageTextBox.filebox("destroy");
        imageBtn.unbind("click");
        okBtn.unbind("click");
        dialog.dialog("destroy");

    [dialog,
        tooltipTextBox, imageTextBox, linkUrlTextBox,
        imageBtn, 
        okBtn
    ] = [undefined,
        undefined, undefined, undefined,
        undefined, 
        undefined];
        
        [imagePath] = [undefined];
    }, requestFriendshipLink = id => {
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
            xhr.open("GET", `/admin/friendship-link/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadFriendshipLink = id => {
        requestFriendshipLink(id).then(friendshipLink => {
            tooltipTextBox.textbox("setValue", friendshipLink.tooltip);
            linkUrlTextBox.textbox("setValue", friendshipLink["link-url"]);

            if (friendshipLink.image.length > 0) {
                imagePath = friendshipLink.image;
                document.getElementById("friendship-link-image-image").src = imagePath;
                imageTextBox.filebox("setText", friendshipLink.image);
            }
            
            okBtn.bind("click", () => {
                submitFriendshipLink(id);
            });
            
            imageBtn.bind("click", () => {
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
                    SELF.errorHandler(error);
                });
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateFriendshipLink = (tooltip, image, linkUrl, id) => {
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
            xhr.open("PUT", `/admin/friendship-link/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`tooltip=${tooltip}&image=${image}&linkUrl=${linkUrl}`);
        });
    }, submitFriendshipLink = (id) => {
        
        if (imagePath === undefined) {
            layer.msg("没有上传图片");
            return;
        }

        /** 获取参数*/
        const tooltip = tooltipTextBox.textbox("getValue");
        const linkUrl = linkUrlTextBox.textbox("getValue");
        if (imagePath === undefined) {
            imagePath = "";
        }
        
        updateFriendshipLink(tooltip, imagePath, linkUrl, id);
    };

    SELF.subscribe("friendship-link-update", id => {
        initUI();
        loadFriendshipLink(id);
    });
})(this, $, layer, SELF);