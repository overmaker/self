(function (window, $, layer, SELF) {
    loadProductList = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                processProductList(json);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/product?name=&offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, processProductList = function (json) {
        var i = 0,
                str = "",
                str1 = "";
         
        for (; i < json["v1"].length; i++) {
            if (json["v1"][i].is_enable === 1) {
                str += "<dd style='margin: 6% 0%;line-height: 15px;'><a data-id=" + json["v1"][i].id + " href='javascript:;' style='margin-left:20px;'>" + json["v1"][i].name + "</a></dd>";
                str1 = "<div class='layui-row'><div class='layui-col-xs7 tu'><img src='" + json["v1"][0].thumbnail + "' style='width: 260px;height: 200px ; margin-left:25%;'></div><div class='layui-col-xs5 comment'><h2 style='margin-top:20px'>" + json["v1"][0].name + "</h2><p style='margin-top:30px'>重量：" + json["v1"][0].weight + "克 价格：" + json["v1"][0].price + "</p><p>数量：<input type='text' id='num' value='1' style='width:50px;'/> 库存：" + json["v1"][0].pinfo.stock + "</p><button class='button' id='btn' data-id=" + json["v1"][0].id + " style='font-weight: bold;font-size: 16px;margin-right: 20px;width:100px; height:40px; margin-top:20px;border: 1px solid #FF0036;color: #FF0036;background-color: #FFEDED;'>立即购买</button></div></div><hr style='border-bottom: 1px solid gainsboro;; width:99%;'>" + json["v1"][0].introduction;
            }
        }
        $("#productList").html(str);
        $("#product-info").html(str1);

        $("#productList a").each(function () {

            $(this).click(function () {
                loadProduct($(this).attr("data-id"));
            });
            
        });
            $("#btn").click(function () {
                var num = document.getElementById("num").value;
                SELF.getUser(function (user) {
                    if (user === 401) {
                        layer.msg("请先登录");
                    } else {
                        alert($("#btn").attr("data-id"));
                        loadOrder($("#btn").attr("data-id"), num, user.id);
                    }
                });
                
            });
        
    }, loadOrder = function (productId, num, user) {
        console.log(productId);
        console.log(num);
        console.log(user);
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                processProduct(json);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        
        var obj = {
                "user": {
                    "id": user
                },
                "quantity": num,
                "product": {
                    "id": productId
                }
        };

        xhr.open("POST", `/admin/order`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(obj));
    }, loadProduct = function (id) {
        var xhr2 = new XMLHttpRequest();
        xhr2.onloadstart = SELF.startLoadAnimation();
        xhr2.onloadend = SELF.stopLoadAnimation();
        xhr2.onload = function () {
            if (xhr2.status === 200) {
                var json2 = window.JSON.parse(xhr2.response);
                processProduct(json2);
            } else {
                SELF.errorHandler(xhr2.status);
            }
        };
        xhr2.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr2.open("GET", "/site/product/find/" + id);
        xhr2.setRequestHeader("Content-Type", "application/json");
        xhr2.send();
    }, processProduct = function (json2) {
        var str2 = "<div class='layui-row'><div class='layui-col-xs7 tu'><img src='" + json2.thumbnail + "' style='width: 260px;height: 200px ; margin-left:25%;'></div><div class='layui-col-xs5 comment'><h2 style='margin-top:20px'>" + json2.name + "</h2><p style='margin-top:30px'>重量：" + json2.weight + "克 价格：" + json2.price + "</p><p>数量：<input type='text' id='num' value='1' style='width:50px;'/> 库存：" + json2.pinfo.stock + "</p><button class='button' id='btn' style='font-weight: bold;font-size: 16px;margin-right: 20px;width:100px; height:40px; margin-top:20px;border: 1px solid #FF0036;color: #FF0036;background-color: #FFEDED;'>立即购买</button></div></div><hr style='border: 1px solid gray; width:99%;'>" + json2.introduction;
        $("#product-info").html(str2);
        
        $("#btn").click(function () {
            var num = document.getElementById("num").value;
            alert(num);
        });
    };


    $(document).ready(function () {
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                Product();
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
        loadProductList();
    });
})(window, $, layer, SELF);
