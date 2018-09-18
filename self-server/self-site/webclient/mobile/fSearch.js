(function (window, $, SELF) {
    var searchContent = "郭爱克";
    var requestFSearch = function (searchContent, readCache, writeCache, success, fail) {
        var uri = "/site/fSearch?offset=0&count=10000&searchContent=" + searchContent,
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
                    console.log(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        }
    };
    SELF.subscribe("show-search", function () {
        SELF.loadHtml("fSearch.html", function (html) {
            $("body").append(html);
//            alert(1);
            requestFSearch(searchContent);

        });
    });
})(window, $, SELF);
