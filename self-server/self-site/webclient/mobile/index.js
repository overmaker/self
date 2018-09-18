(function (window, $, SELF) {

    var tabIndex = window.sessionStorage.getItem("tab.index"),
            tab = undefined,
            unloadModule = function (tabIndex) {
                switch (tabIndex) {
                    case 1: // 首页
                        SELF.publish("unload-home");
                        break;
                    case 2: // 视频
                        SELF.publish("unload-video");
                        break;
                    case 3: // 活动
                        SELF.publish("unload-activity");
                        break;
                    case 4: // 周边
                        SELF.publish("unload-product");
                        break;
                    case 5: // 我
                        SELF.publish("unload-me");
                        break;
                    default:
                        break;
                }
            },
            loadModule = function (tabIndex, param) {
                switch (tabIndex) {
                    case 1: // 首页
                        SELF.publish("load-home");
                        break;
                    case 2: // 视频
                        SELF.publish("load-video", param);
                        break;
                    case 3: // 活动
                        SELF.publish("load-activity");
                        break;
                    case 4: // 周边
                        SELF.publish("load-product");
                        break;
                    case 5: // 我
                        SELF.publish("load-me");
                        break;
                    default:
                        break;
                }
            },
            initUI = function () {
                tab = new auiTab({
                    element: window.document.getElementById("footer"),
                    index: tabIndex,
                    repeatClick: false
                }, function (ret) {
                    unloadModule(tabIndex);

                    tabIndex = ret["index"];
                    window.sessionStorage.setItem("tab.index", tabIndex);

                    loadModule(tabIndex);
                });

                $("body > article").css("bottom", window.document.getElementById("footer").offsetHeight);

                loadModule(tabIndex);
            };

    if (tabIndex && tabIndex !== null) {
        tabIndex = window.parseInt(tabIndex);
    } else {
        tabIndex = 1;
    }
    if (tabIndex < 1) {
        tabIndex = 1;
    }

    $(window.document).ready(function () {

        SELF.loadHtml("module-tab.html", function (html) {
            $("#footer").empty().html(html);
            initUI();
        });

        SELF.subscribe("switch-video", function (param) {
            unloadModule(tabIndex);
            tabIndex = 2;
            tab.setActive(tabIndex);
            window.sessionStorage.setItem("tab.index", tabIndex);
            loadModule(tabIndex, param);
        })("switch-activity", function () {
            unloadModule(tabIndex);
            tabIndex = 3;
            tab.setActive(tabIndex);
            window.sessionStorage.setItem("tab.index", tabIndex);
            loadModule(tabIndex);
        })("switch-product", function () {
            unloadModule(tabIndex);
            tabIndex = 4;
            tab.setActive(tabIndex);
            window.sessionStorage.setItem("tab.index", tabIndex);
            loadModule(tabIndex);
        });

    });

})(window, $, SELF);
