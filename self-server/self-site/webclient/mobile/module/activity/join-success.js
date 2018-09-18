(function (window, $, SELF) {
    var initUI = function (html) {
        $("body").empty();
        $("body").append(html);
        $("#join-success").popup();
    };
    SELF.subscribe("show-join-success", function () {
        SELF.loadHtml("module/activity/join-success.html", function (html) {
            initUI(html);
        });
    });
})(window, $, SELF);
