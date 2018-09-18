((window, $, layer, SELF) => {
    SELF.registeredPopup("product-update", "module/shop/product-add.html");

    let[dialog,
        comboxType, nameTextBox,
        introductionTextBox, priceTextBox, 
        weightTextBox, scoreTextBox, stockTextBox, 
        thumbnailTextBox, thumbnailBtn,
        imageTextBox, imageBtn,
        recommendCheckBox, enableCheckBox,
        okBtn
    ] = [undefined,
        undefined, undefined,
        undefined, undefined, 
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined];
    
    let [thumbnailPath, imagePath] = [undefined, undefined]; 

    const initUI = () => {
        const html = SELF.getPopupHtml("product-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑商品 ",
            width: 800,
            height: 760,
            closed: false,
            maximizable: true,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
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
            height: 24
        });
        
        imageBtn = $("#self-text-product-fileimage").linkbutton({
            text: "上传",
            width: 45,
            height: 24
        });

        recommendCheckBox = $("#self-btn-product-check-isremmend");
        enableCheckBox = $("#self-btn-product-check-isenable");

        okBtn = $("#self-btn-product-submit").linkbutton({
            text: "确定",
            width: 115,
            height: 30
        });

    }, destoryUI = () => {
        nameTextBox.textbox("destroy");
        introductionTextBox.txt.clear();
        thumbnailTextBox.filebox("destroy");
        thumbnailBtn.unbind("click");
        scoreTextBox.textbox("destroy");
        stockTextBox.textbox("destroy");
        comboxType.combobox("destroy");
        priceTextBox.textbox("destroy");
        weightTextBox.textbox("destroy");
        imageTextBox.filebox("destroy");
        imageBtn.unbind("click");
        okBtn.unbind("click");
        dialog.dialog("destroy");

    [dialog,
        comboxType, nameTextBox,
        introductionTextBox, priceTextBox, 
        weightTextBox, scoreTextBox, stockTextBox, 
        thumbnailTextBox, thumbnailBtn,
        imageTextBox, imageBtn,
        recommendCheckBox, enableCheckBox,
        okBtn
    ] = [undefined,
        undefined, undefined,
        undefined, undefined, 
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined];
        
        [thumbnailPath, imagePath] = [undefined, undefined];
    }, requestProductTypeAll = () => {
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
    }, requestProduct = id => {
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
            xhr.open("GET", `/admin/product/find/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadProduct = id => {
        requestProduct(id).then(product => {
            introductionTextBox.txt.html(product.introduction);
            nameTextBox.textbox("setValue", product.name);
            priceTextBox.textbox("setValue", product.price);
            weightTextBox.textbox("setValue", product.weight);
            scoreTextBox.textbox("setValue", product.score);
            stockTextBox.textbox("setValue", product.pinfo.stock);
            if (product.thumbnail.length > 0) {
                thumbnailPath = product.thumbnail;
                document.getElementById("product-thumbnail-image").src = thumbnailPath;
                thumbnailTextBox.filebox("setText", product.thumbnail);
            }

            if (product.image.length > 0) {
                imagePath = product.image;
                document.getElementById("product-image-image").src = imagePath;
                imageTextBox.filebox("setText", product.image);
            }

            if (product.is_recommend === 1) {
                recommendCheckBox.attr("checked", "checked");
            }
            if (product.is_enable === 1) {
                enableCheckBox.attr("checked", "checked");
            }
            
            okBtn.bind("click", () => {
                submitProduct(id);
            });
            
            thumbnailBtn.bind("click", () => {
                const files = thumbnailTextBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择商品缩略图！");
                    return;
                }
                SELF.fileUpload("product-add-thumbnail", files[0]).then(filePath => {
                    thumbnailPath = filePath;
                    thumbnailTextBox.filebox("setText", thumbnailPath);
                    document.getElementById("product-thumbnail-image").src = thumbnailPath;
                }, error => {
                    SELF.errorHandler(error);
                });
            });
            
            imageBtn.bind("click", () => {
                const files = imageTextBox.filebox("files");
                if (files.length === 0) {
                    layer.msg("请选择商品大图！");
                    return;
                }
                SELF.fileUpload("product-add-image", files[0]).then(filePath => {
                    imagePath = filePath;
                    imageTextBox.filebox("setText", imagePath);
                    document.getElementById("product-image-image").src = imagePath;
                }, error => {
                    SELF.errorHandler(error);
                });
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateProduct = (name, introduction, thumbnail, image, price, weight, score, is_recommend, is_enable, type, stock, id) => {
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
            xhr.open("PUT", `/admin/product/update/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`name=${name}&introduction=${introduction}&thumbnail=${thumbnail}&image=${image}&price=${price}&weight=${weight}&score=${score}&is_recommend=${is_recommend}&is_enable=${is_enable}&type=${type}&stock=${stock}`);
        });
    }, submitProduct = (id) => {
        /*** 验证特殊字符*/
        if (/[~#^$@%&!*<>{}=；？?/、_【】—（）]/gi.test(nameTextBox.textbox('getValue'))) {
            layer.msg("不能输入特殊字符！");
            return;
        }
        
        if (thumbnailPath === undefined) {
            layer.msg("没有上传商品缩略图");
            return;
        }
        
        if (imagePath === undefined) {
            layer.msg("没有上传商品大图");
            return;
        }

        /** 获取参数*/
        const name = nameTextBox.textbox("getValue");
        const introduction = introductionTextBox.txt.html();
        const price = priceTextBox.textbox("getValue");
        const weight = weightTextBox.textbox("getValue");
        const score = scoreTextBox.textbox("getValue");
        const stock = stockTextBox.textbox("getValue");
        const type = comboxType.combobox("getValue");
        const is_recommend = recommendCheckBox.is(":checked");
        const is_enable = enableCheckBox.is(":checked");
        
        updateProduct(name, introduction, thumbnailPath, imagePath, price, weight, score, is_recommend, is_enable, type, stock, id);
    };

    SELF.subscribe("product-update", id => {
        initUI();

        window.Promise.all([requestProductTypeAll()]).then(list => {
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

            loadProduct(id);
        }, error => {
            SELF.errorHandler(error);
        });
    });
})(this, $, layer, SELF);