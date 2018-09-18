(function (window, $, layer, SELF) {

    $(document).ready(function () {
        $("#top").load("/top.html", function () {          
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            head.appendChild(script);
              About();
            loader();
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

        var xhr = new XMLHttpRequest(),
                id = SELF.getQueryString("id");
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        str = "";
                str = "<img src='" + json["image"] + "' style='padding-left: 400px;padding-right: 400px;'><br><h1 style='text-align: center;'>" +
                        json["title"] + "</h1><hr><div style='padding-left: 60px;'>" +
                        json["introduction"] + "</div>";

                $("#cooperation-info").html(str);
            } else if (xhr.status === 404) {
                layer.alert("没有找到指定合作机构", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/cooperation/" + id);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
})(window, $, layer, SELF);
