(function (window, $, layer, SELF) {
    var redirect_url = null;
    
    var code,
            checkCode = false;
    createCode = function () {
        //首先默认code为空字符串
        code = '';
        //设置长度，这里看需求，我这里设置了4
        var codeLength = 4;
        var codeV = document.getElementById('code');
        //设置随机字符
        var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        //循环codeLength 我设置的4就是循环4次
        for (var i = 0; i < codeLength; i++) {
            //设置随机数范围,这设置为0 ~ 36
            var index = Math.floor(Math.random() * 36);
            //字符串拼接 将每次随机的字符 进行拼接
            code += random[index];
        }
    };

    var loginRequest = function (userName, password, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            callback(xhr.status);
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/auth/self");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("user-name=" + userName + "&password=" + password);
    }, login = function (userName, password) {
        loginRequest(userName, password, function (status) {
            if (status === 204) {
                if (redirect_url === null) {
                    window.location = "/";
                } else {
                    window.parent.location = redirect_url; // iframe嵌入式引入登录对话框
                }
            } else if (status === 401) {
                SELF.errorHandler(status);
            } else {
                SELF.errorHandler(status);
            }
        });
    };

    $(document).ready(function () {
        redirect_url = SELF.getQueryString("redirect_url");
        $("#self-login").click(function () {
            var userName = $("#loginUserName").val(),
                    password = $("#loginPassword").val();
            login(userName, password);
        });
    });
})(window, $, layer, SELF);