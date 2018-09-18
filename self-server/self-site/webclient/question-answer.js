(function (window, $, layer, SELF) {

    $(document).ready(function () {
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                About();
            };
            head.appendChild(script);
        });
        $("#flooter").load("/bottom.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            var email = $("input[type=email]").val();
            script.src = "/bottom.js";
            script.type = "text/javascript";
            script.onload = function () {
                loadEmail(email, "");
            };
            head.appendChild(script);
        });

        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        i = 0,
                        question = "",
                        answer = "";
                for (; i < json["v1"].length; i++) {
                    if (i === 0) {
                        question = "<li class='layui-this' style='font-size: 18px;border-bottom:1px dashed #ddd;text-decoration:none;color: black;line-height:40px;'>" + json["v1"][i].question + "</li>";
                        answer = "<div class='layui-tab-item layui-show' style='text-indent:25px;'><div class='bid-title'>" + json["v1"][i].answer + "</div></div>";
                    } else {
                        question += "<li style='font-size: 18px;border-bottom:1px dashed #ddd;text-decoration:none;color: black;line-height:40px;'>" + json["v1"][i].question + "</li>";
                        answer += "<div class='layui-tab-item'  style='text-indent:25px;'><div>" + json["v1"][i].answer + "</div></div>";
                    }
                }
                $("#question").html(question);
                $("#answer").html(answer);
                $("#questiona li").each(function () {
                    $(this).click(function () {
                        $("#questiona li").css("color", "gray");
                        $(this).css("color", "#FF920B");
                    });
                })
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/questionAnswer?offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
})(window, $, layer, SELF);

