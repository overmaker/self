(function (window, $, SELF) {
    var initUI = function () {
        $("#product-type-list").bind("click", function (event) {
            var target = $(event.target),
                    type = target.attr("data-id");
            if (target.is("a")) {
                type = parseInt(type);
                if (currentType !== type) {
                    currentType = type;
                    currentOffset = 0;
                    $("#product-list > ul").empty();
                    $("#self-product-more").show();
                    $("#self-product-none").hide();
                    loadProduct(0, pageCount, currentType, false, true);
                }
            }
        });
        $("#product-list").pullToRefresh(function () {
            currentOffset = 0;
            loadStatus = "ready";
            $("#product-list > ul").empty();
            $("#self-product-more").show();
            $("#self-product-none").hide();
            loadProduct(0, pageCount, currentType, false, true);
        });

        var listHeight = $("#product-list").height();
        $("#product-list").bind("scroll", function () {
            var top = $("#product-list").scrollTop();
            var height = $("#product-list").scrollHeight();
            if (Math.abs(height - top) <= (listHeight + 20)) {
                if (loadStatus === "ready") {
                    loadProduct(currentOffset, pageCount, currentType, false, false);
                }
            }
        });

        loadType(true, true);
        loadProduct(0, pageCount, -1, true, true);
    }, destroyUI = function () {
        currentOffset = 0;
        currentType = -1;
        loadStatus = "ready";
        $("#product-list ul").unbind("click");
        $("#product-type-list").unbind("click");
        $("#product-list").unbind("scroll");
        $("#product-list").pullToRefreshDone();
    }, requestProduct = function (offset, count, type, readCache, writeCache, success, fail) {
        var uri = "/site/product/findProduct?offset=" + offset + "&count=" + count + "&type=" + type,
//        var uri = "/site/product",
                response = null;
        if (readCache) {
            response = window.sessionStorage.getItem(uri);
        }
        if (response && response !== null) {
            success(response);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function () {
                fail("error");
            };
            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (writeCache) {
                        window.sessionStorage.setItem(uri, xhr.response);
                    }
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        }
    }, loadProduct = function (offset, count, type, readCache, writeCache) {
        loadStatus = "loading";
        requestProduct(offset, count, type, readCache, writeCache, function (response) {
            var json = window.JSON.parse(response),
                    list = json["v1"],
                    total = json["v2"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
            for (; i < length; i++) {
                obj = list[i];
                if (obj["is_enable"] === 1) {
                    html += "<a href='module/product/product-info.html?id=";
                    html += obj["id"];
                    html += "' class='weui-media-box weui-media-box_appmsg'><div class='weui-media-box__hd'><img class='weui-media-box__thumb' src='";
                    html += obj["thumbnail"];
                    html += "'></div><div class='weui-media-box__bd'><h4 class='product-title'>";
                    html += obj["name"];
                    html += "</h4><p class='weui-media-box__desc'>";
                    html += obj["introduction"];
                    html += "</p></div></a>";
                }
            }
            $("#product-list > ul").append(html);

            if (length < count || (offset + length) >= total) {
                loadStatus = "end";
                $("#product-list").pullToRefreshDone();
                $("#self-product-more").hide();
                $("#self-product-none").show();
            } else {
                loadStatus = "ready";
                $("#product-list").pullToRefreshDone();
            }

            currentOffset += length;

        }, function (status) {
            loadStatus = "ready";
            $("#product-list").pullToRefreshDone();
            SELF.errorHandler(status);
        });
    }, requestType = function (readCache, writeCache, success, fail) {
        var uri = "/site/product-type",
                response = null;
        if (readCache) {
            response = window.sessionStorage.getItem(uri);
        }
        if (response && response !== null) {
            success(response);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function () {
                fail("error");
            };
            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (writeCache) {
                        window.sessionStorage.setItem(uri, xhr.response);
                    }
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        }
    }, loadType = function (readCache, writeCache) {
        requestType(readCache, writeCache, function (response) {
            var json = window.JSON.parse(response),
                    list = json["v1"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "<a href='javascript:;' data-id='-1' >首页</a>";
            for (; i < length; i++) {
                obj = list[i];
                html += "<a href='javascript:;' data-id='" + obj["id"] + "' >" + obj["name"] + "</a>";
            }
            $("#product-type-list").empty().append(html);
        }, function (status) {
            SELF.errorHandler(status);
        });
    }, pageCount = 10,
            currentOffset = 0,
            currentType = -1,
            loadStatus = "ready";
    SELF.subscribe("unload-product", function () {
        destroyUI();
        $("body > article").empty();
    })("load-product", function () {
        SELF.loadHtml("module/product/product.html", function (html) {
            $("body > article").empty().html(html);
            initUI();
        });
    });

})(window, $, SELF);
