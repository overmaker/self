(function (window, $, layer, SELF) {
    $("#top").load("/top.html", function () {
        var head = document.getElementsByTagName("head").item(0);
        var script = document.createElement("script");
        script.src = "/top.js";
        script.type = "text/javascript";
        head.appendChild(script);
        UserInfo();
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
})(window, $, layer, SELF);