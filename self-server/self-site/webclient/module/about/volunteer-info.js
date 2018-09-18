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
                str = "<div style='text-align: center;padding-left: 380px;padding-right: 400px;'><img src='" + json.photo + "' style='height: 300px;width: 300px;'><br><br><h2>" + json.name + "</h2></div><hr><div style='padding-left: 200px;padding-right: 260px;'>" + json["user-advance"].introduction + "</div>";

                $("#volunteer").html(str);
            } else if (xhr.status === 404) {
                layer.alert("没有找到指定合作机构", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/user-info/find?uid=" + id);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
})(window, $, layer, SELF);
