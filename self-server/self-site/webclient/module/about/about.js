(function (window, $, layer, SELF) {
    $(document).ready(function () {
        $("#top").load("/top.html", function () {

            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            head.appendChild(script);
             $("#a ").css("color", "#FF920B");
            $("#a").click(function () {
                $("#c").css("color", "gray");
                $("#b").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
            $("#b").click(function () {
                $("#c").css("color", "gray");
                $("#a").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
            $("#c").click(function () {
                $("#a").css("color", "gray");
                $("#b").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
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
                        introduction = "";
                        introduction = "<div class='title1'>"+json["v1"][0].type+"</div><div class='wen'>"+json["v1"][0].introduction+"</div>";
                $("#self").html(introduction);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/knowhow?offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
})(window, $, layer, SELF);
