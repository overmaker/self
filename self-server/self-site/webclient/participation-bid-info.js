(function (window, $, layer, SELF) {
    $(document).ready(function () {
        $("#top").load("/top.html", function () {

            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            head.appendChild(script);
            $("#a").click(function () {
                $(this).css("color", "#FF920B");
            });
            $("#b").click(function () {
                $(this).css("color", "#FF920B");
            });
            $("#c").click(function () {
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
        var xhr = new XMLHttpRequest(),
                id = SELF.getQueryString("id");
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        content = "";
                        content = "<div class='title1'><h1 style='text-align: center;line-height: 5rem;'>"+json["activity-name"]+"</h1></div><div class='wen'>"+json.content+"</div>";
                $("#self").html(content);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/publicity/find/"+id);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
})(window, $, layer, SELF);
