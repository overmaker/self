function  loadEmail(email, interval) {
    var xhr = new XMLHttpRequest();
    xhr.onloadstart = SELF.startLoadAnimation();
    xhr.onloadend = SELF.stopLoadAnimation();
    xhr.onload = function () {
    };
    xhr.onerror = function () {
        SELF.errorHandler("error");
    };
    xhr.open("POST", "/site/subscribe");
    let objPrams = {
        "email": email,
        "interval": ""
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(objPrams));
    $("#email-submit").click(function () {
        var email = $("input[type=email]").val();
        if (email === "" || email.replace(/(^\s*)|(\s*$)/g, "") === "" || email === undefined) {
            alert("请填写邮箱号！");
        } else {
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; //匹配邮箱
            isok = reg.test(email);
            if (!isok) {
                alert("邮箱格式不正确，请重新输入！");
                document.getElementById("email-text").value = "";
                return false;
            } else {
                loadEmail(email, "");
                alert("提交成功");
                $("#email-text").blur();
                document.getElementById("email-text").value = "";
            }
        }
        ;
    });
    //回车提交邮箱
    $("#email-text").keyup(function (e) {
        if (e.keyCode === 13) {
            $("#email-submit").click();
        }
    });
}
