(function (window, $, layer, SELF) {
    $(document).ready(function () {
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            head.appendChild(script);
            Product();
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
                var json = window.JSON.parse(xhr.response);
                var str = "<div class='layui-row'><div class='layui-col-xs7 tu'><img src='" + json.thumbnail + "' style='width: 260px;height: 200px;'></div><div class='layui-col-xs5 comment'><h2>" + json.name + "</h2><p>重量：" + json.weight + "克 价格：" + json.price + "</p><p>数量：" + 1 + " 库存：" + json.pinfo.stock + "</p><button class='button'>立即购买</button><button class='button'>加入购物车</button></div></div>";
                $("#product-info").html(str);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/product/find/" + id);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
})(window, $, layer, SELF);
