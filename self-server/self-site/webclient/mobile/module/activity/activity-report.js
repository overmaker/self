(function (window, $, SELF) {
    var initUI = function (html) {
alert(2);
  $("body").empty().append(html);
    };
    SELF.subscribe("show-activity-report", function () {
        SELF.loadHtml("module/activity/activity-report.html", function (html) {
            initUI(html);
//          loadActivity();
        });

    });
})(window, $, SELF);
