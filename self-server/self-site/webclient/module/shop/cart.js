(function (window, $, layer, SELF) {

    loadCartItem = function () {
        var xhr = new XMLHttpRequest(),
                id = SELF.getQueryString("id");
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        i = 0,
                        str = "",
                        amount = 0;
                for (; i < json.length; i++) {
                    amount = json[i].product_price * json[i].quantity;
                    str += "<tr><td><input type='checkbox' /></td><td><img src='" + json[i].product_thumbnail + "' class='img'></td><td>" + json[i].product_name + "</td><td>" + json[i].product_price + "</td><td>" + json[i].quantity + "</td><td>" + amount + "</td><td><a href='' data-id='" + json[i].id + "'>删除</a></td></tr>";
                }

                $("#cartItem").html(str);
                $("#cartItem tr td a").each(function () {

                    $(this).click(function () {
                        deleteCartItem($(this).attr("data-id"));
                    });
                });
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/cart-item/select-all/" + id);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, deleteCartItem = function (id) {
        return new window.Promise((resolve, reject) => {
            var xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadCartItem();
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("DELETE", `/site/cart-item/${id}`);
            xhr.send();
        });
    };

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
        loadCartItem();
    });
})(window, $, layer, SELF);
