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
                        str = "<tr style='background-color: #F5F5F5;'><td style='font-size: 16px;font-weight: bold;'>排名</td><td style='font-size: 16px;font-weight: bold;'>名称</td><td style='font-size: 16px;font-weight: bold;'>资助总金额</td></tr>";
                if (json.length === 0) {
                    $("#table").html(str);
                } else {
                    for (; i < json.length; i++) {
                        str += "<tr><td style='color: red;font-size: 16px;font-weight: bold;'>" + (i + 1) + "</td ><td style='color: blackfon;font-size: 16px;'>" + json[i].name + "</td><td style='color: red;font-size: 16px;font-weight: bold;'>¥" + json[i].amount + "</td></tr>";
                    }
                    $("#table").html(str);
                }
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/donation/statistics");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
})(window, $, layer, SELF);
