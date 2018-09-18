(function (window, $, layer, SELF) {

    /**
     * 格式化时间
     * @param {type} date 时间参数
     * @param {type} format 转换格式
     * @returns {String} 转换结果
     */
    function formatDate(date, format) {
        if (!format)
            format = "yyyy-MM-dd";
        date = new Date(parseInt(date));
        var dict = {
            "yyyy": date.getFullYear(),
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "S": date.getMilliseconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(y+|M+|d+)/g, function (a) {
            return dict[a];
        });
    }
    loadUserInfo = function (uid) {
        var xhr = new XMLHttpRequest(),
                id = SELF.getQueryString("id");
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                var nickname = " <span >用户昵称</span> <input type=\"text\"  value=" + json[0]["nick-name"] + " />";
                $("#nickname").html(nickname);
                if (json[0].gender === true) {
                    document.getElementById("man").selected = "selected";
                } else {
                    document.getElementById("wum").selected = "selected";
                }
                var birdate = "<span >生&nbsp;&nbsp;&nbsp;&nbsp;日</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"text\" value=" + formatDate(json[0]["birth-date"]) + " />";
                $("#birdate").html(birdate);
                $("#birdaddress option[value="+json[0]["native-place"]+"").attr("selected","selected");
                $("#address option[value="+json[0].address+"").attr("selected","selected");

            } else if (xhr.status === 404) {
                layer.alert("没有找到指任务", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/user-info/select-uid?uid=" + uid);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    };

    $(document).ready(function () {
        loadUserInfo(1);
    });
})(window, $, layer, SELF);

