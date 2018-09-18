(function (window, $, SELF) {
    var initUI = function (html) {
        $("body").empty();
        $("body").append(html);
        $("#join-failure").popup();
    };
    SELF.subscribe("show-join-failure", function () {
        SELF.loadHtml("module/activity/join-failure.html", function (html) {
            initUI(html);
        });
    });
})(window, $, SELF);
