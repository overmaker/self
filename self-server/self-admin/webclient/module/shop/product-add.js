((window, $, layer, SELF) => {
    SELF.registeredPopup("product-add", "module/shop/product-add.html");
    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, nameTextBox, introductionTextBox, dialogBtn, thumbnailTextBox, thumbnailBtn, imageBtn] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    let [comboxType, imageTextBox, priceTextBox, weightTextBox, scoreTextBox, stockTextBox] = [undefined, undefined, undefined, undefined, undefined, undefined];
    
    let [thumbnailPath, imagePath, currentId] = [undefined, undefined, undefined];
    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除专辑

    let requestProductTypeAll = () => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve({
                        "type": "type",
                        "data": xhr.response
                    });
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("GET", `/admin/product-type?name=&offset=0&count=1000`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, insertProduct = (name, introduction, thumbnail, image, price, weight, score, is_recommend, is_enable, type, stock) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-product-add");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("POST", `/admin/product`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}&introduction=${introduction}&thumbnail=${thumbnail}&image=${image}&price=${price}&weight=${weight}&score=${score}&is_recommend=${is_recommend}&is_enable=${is_enable}&type=${type}&stock=${stock}`);
        });
    }, addProductVerification = (name, introduction, thumbnailPath, imagePath, price, weight, score, type, stock) => {
        const [productName, productIntroduction, thumbnail, image, productPrice, productWeight, productScore, productType, productStock] =
                [name, introduction, thumbnailPath, imagePath, price, weight, score, type, stock];
        if (productName === "" || productName === null) {
            layer.msg("请输入商品名称！");
            nameTextBox.textbox({
                required: true
            });
            return "false";
        }

        if (productIntroduction === "" || productIntroduction === null) {
            layer.msg("请输入商品介绍！");
            return "false";
        }

        if (thumbnail === "" || thumbnail === null) {
            layer.msg("请添加商品缩略图！");
            return "false";
        }

        if (image === "" || image === null) {
            layer.msg("请添加商品大图！");
            return "false";
        }
        
        if (productPrice <= 0 || productPrice === null) {
            layer.msg("请输入商品价格！");
            return "false";
        }
        
        if (productWeight <= 0 || productWeight === null) {
            layer.msg("请输入商品重量！");
            return "false";
        }
        
        if (productScore < 0 || productScore === null) {
            layer.msg("请输入商品积分！");
            return "false";
        }
        
        if (productType <= 0 || productType === null) {
            layer.msg("请选择商品分类！");
            return "false";
        }
        
        if (productStock <= 0 || productStock === null) {
            layer.msg("请输入商品库存！");
            return "false";
        }
    };


    SELF.subscribe("product-add", () => {
        let html = SELF.getPopupHtml("product-add");
        dialog = $(html).appendTo("body");
        dialog.dialog({
            title: "新建商品",
            width: 800,
            height: 780,
            closed: false,
            maximizable: true,
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
        
        comboxType = $("#self-text-product-type").combobox({
            label: "商品分类：",
            labelWidth: 100,
            width: "95%",
            editable: false
        });
        
        nameTextBox = $("#self-text-product-name").textbox({
            label: "商品名称：",
            width: "95%",
            labelWidth: 100
        });
        
        let wangEditor = window.wangEditor;
        introductionTextBox = new wangEditor("#self-text-product-introduction");
        introductionTextBox.customConfig.menus = [
            "head", // 标题
            "bold", // 粗体
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
        introductionTextBox.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        introductionTextBox.customConfig.uploadFileName = "file";
        introductionTextBox.create();
            
        thumbnailTextBox = $("#self-text-product-thumbnail").filebox({
            width: "75%",
            buttonText: "&nbsp;选择图片&nbsp;",
            accept: "image/*"
        });
            
        imageTextBox = $("#self-text-product-image").filebox({
            width: "75%",
            buttonText: "&nbsp;选择图片&nbsp;",
            accept: "image/*"
        });

        priceTextBox = $("#self-text-product-price").textbox({
            label: "商品价格：",
            labelWidth: 100,
            width: "95%"
        });
        
        weightTextBox = $("#self-text-product-weight").textbox({
            label: "商品重量：",
            labelWidth: 100,
            width: "95%"
        });
        
        scoreTextBox = $("#self-text-product-score").textbox({
            label: "商品积分：",
            labelWidth: 100,
            width: "95%"
        });
        
        stockTextBox = $("#self-text-product-stock").textbox({
            label: "商品库存：",
            labelWidth: 100,
            width: "95%"
        });

        thumbnailBtn = $("#self-text-product-filethumbnail").linkbutton({
            text: "上传",
            width: 45,
            height: 24,
            onClick: function () {
                const files = thumbnailTextBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择缩略图！");
                    return;
                }
                SELF.fileUpload("product-add-thumbnail", files[0]).then(filePath => {
                    thumbnailPath = filePath;
                    thumbnailTextBox.filebox("setText", thumbnailPath);
                    document.getElementById("product-thumbnail-image").src = thumbnailPath;
                }, error => {
                    console.log(error);
                });
            }
        });
        
        imageBtn = $("#self-text-product-fileimage").linkbutton({
            text: "上传",
            width: 45,
            height: 24,
            onClick: function () {
                const files = imageTextBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择大图！");
                    return;
                }
                SELF.fileUpload("product-add-image", files[0]).then(filePath => {
                    imagePath = filePath;
                    imageTextBox.filebox("setText", imagePath);
                    document.getElementById("product-image-image").src = imagePath;
                }, error => {
                    console.log(error);
                });
            }
        });
        
        dialogBtn = $("#self-btn-product-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });
        

        dialogBtn.bind("click", () => {
            
            /** 获取参数*/
            const name = nameTextBox.textbox("getValue");
            const introduction = introductionTextBox.txt.html();
            const price = priceTextBox.textbox("getValue");
            const weight = weightTextBox.textbox("getValue");
            const score = scoreTextBox.textbox("getValue");
            const stock = stockTextBox.textbox("getValue");
            const type = comboxType.combobox("getValue");
            const is_recommend = document.getElementById("self-btn-product-check-isremmend").checked;
            const is_enable = document.getElementById("self-btn-product-check-isenable").checked;
            if (thumbnailPath === undefined) {
                thumbnailPath = "";
            }
            if (imagePath === undefined) {
                imagePath = "";
            }
            
            let result = addProductVerification(name, introduction, thumbnailPath, imagePath, price, weight, score, type, stock);
            if (result !== "false") {
                insertProduct(name, introduction, thumbnailPath, imagePath, price, weight, score, is_recommend, is_enable, type, stock);
            }
        });

        window.Promise.all([requestProductTypeAll()]).then((list) => {
            for (let i = 0; i < list.length; i++) {
                if (list[i].type === "type") {
                    let typeList = [];
                    for (let j = 0; j < list[i].data.v1.length; j++) {
                        let name = list[i].data.v1[j]["name"];
                        let id = list[i].data.v1[j]["id"];
                        if (j === 0) {
                            typeList.push({
                                id: id,
                                text: name,
                                "selected": true
                            });
                        } else {
                            typeList.push({
                                id: id,
                                text: name
                            });
                        }
                    }
                    comboxType = $("#self-text-product-type").combobox({
                        label: "分类：",
                        labelWidth: 100,
                        width: 450,
                        valueField: "id",
                        textField: "text",
                        editable: false,
                        data: typeList
                    });

                }
            }
        });

    });

})(this, $, layer, SELF);