((window, $, layer, SELF) => {
    SELF.registeredPopup("QuestionAndAnswer-update", "module/advertisement/QuestionAndAnswer-update.html");

    let[dialog,
        questionTextBox, answerTextBox,
        okBtn
    ] = [undefined,
        undefined, undefined, 
        undefined];

    const initUI = () => {
        const html = SELF.getPopupHtml("QuestionAndAnswer-update");
        dialog = $(html).appendTo("body").dialog({
            title: "编辑 ",
            width: 700,
            height: 500,
            closed: false,
            cache: false,
            modal: true,
            onClose: () => {
                destoryUI();
            }
        });
        
        questionTextBox = $("#self-text-QuestionAndAnswer-question").textbox({
            label: "问题：",
            labelWidth: 100,
            width: 500,
            readonly: true
        });
        
        let wangEditor = window.wangEditor;
        answerTextBox = new wangEditor("#self-text-QuestionAndAnswer-answer");
        answerTextBox.customConfig.menus = [
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
        answerTextBox.customConfig.uploadImgServer = "/admin/wang-editor/wang-editor-upload";
        answerTextBox.customConfig.uploadFileName = "file";
        answerTextBox.create();    
        
        okBtn = $("#self-btn-QuestionAndAnswer-submit").linkbutton({
            text: "确定",
            width: 100,
            height: 30
        });

    }, destoryUI = () => {
        questionTextBox.textbox("destroy");
        answerTextBox.txt.clear();
        okBtn.unbind("click");
        dialog.dialog("destroy");

    [dialog,
        questionTextBox, answerTextBox, 
        okBtn
    ] = [undefined,
        undefined, undefined, 
        undefined];
    }, requestQuestionAndAnswer = id => {
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
            xhr.open("GET", `/admin/questionAnswer/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadQuestionAndAnswer = id => {
        requestQuestionAndAnswer(id).then(QuestionAndAnswer => {
            questionTextBox.textbox("setValue", QuestionAndAnswer.question);
            answerTextBox.txt.html(QuestionAndAnswer["answer"]);
            
            okBtn.bind("click", () => {
                submitQuestionAndAnswer(id);
            });

        }, error => {
            SELF.errorHandler(error);
        });
    }, updateQuestionAndAnswer = (question, answer, id) => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    dialog.dialog("close");
                    SELF.publish("load-QuestionAndAnswer-update");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/questionAnswer/${id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`question=${question}&answer=${answer}`);
        });
    }, submitQuestionAndAnswer = (id) => {

        /** 获取参数*/
        const question = questionTextBox.textbox("getValue");
        const answer = answerTextBox.txt.html();
        
        updateQuestionAndAnswer(question, answer, id);
    };

    SELF.subscribe("QuestionAndAnswer-update", id => {
        initUI();
        loadQuestionAndAnswer(id);
    });
})(this, $, layer, SELF);