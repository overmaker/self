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

    loadVideoComment = function (userId) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                var append = "";
                var identity = 0;
                for (var a = 0; a < json.v1.length; a++) {
                    identity++;
                    append += "<tr><td style='width:100px;'>" + identity + "</td><td>" + json.v1[a].video.title + "</td><td>" + json.v1[a].comment + "</td><td style='width:200px;'>" + formatDate(json.v1[a]["create-time"]) + "</td><td  style='width:200px;'  id='del" + a + "'  ></td> </tr>";
                }

                $("#comment-table-tr").html(append);
                delVideoClick(json);

            } else if (xhr.status === 404) {
                layer.alert("没有找到评论", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/video-comment?offset=0&count=10&user-id=" + userId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadActivityComment = function (userId) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                var append = "";
                var identity = 0;
                for (var b = 0; b < json.v1.length; b++) {
                    identity++;
                    append += "<tr><td style='width:100px;'>" + identity + "</td><td>" + json.v1[b].activity.title + "</td><td>" + json.v1[b].comment + "</td><td style='width:200px;'>" + formatDate(json.v1[b]["create-time"]) + "</td><td  style='width:200px;'  id='del1" + b + "'  ></td> </tr>";
                }

                $("#comment-table-tr1").html(append);
                delActivityClick(json);

            } else if (xhr.status === 404) {
                layer.alert("没有找到评论", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/activity-comment?offset=0&count=10&user-id=" + userId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, deleteVideoComment = function (id) {
        var xhr2 = new window.XMLHttpRequest();
        xhr2.onloadstart = () => SELF.startLoadAnimation();
        xhr2.onloadend = () => SELF.stopLoadAnimation();
        xhr2.onload = () => {
            if (xhr2.status === 204) {
                loadVideoComment(id);
            } else {
                reject(xhr2.status);
            }
        };
        xhr2.onerror = (evt) => {
            reject("error");
        };
        xhr2.open("DELETE", "/site/video-comment/" + id);
        xhr2.send();
    }, delVideoClick = function (json) {
        for (var c = 0; c < json.v1.length; c++) {
            var append = "<a data-id=" + json.v1[c].id + " href='javascript:;' >删除</a>";
            $("#del" + c).html(append);
            $("#del" + c + " a").each(function () {
                $(this).click(function () {
                    var dataId = $(this).attr("data-id");
                    layer.confirm('确认删除？', function (index) {
                        deleteVideoComment(dataId);
                        openHtml('../../module/user-info/comment.html');//当前页面   
                        layer.close(index);
                    });
                });
            });
        }
    }, deleteActivityComment = function (id) {
        var xhr2 = new window.XMLHttpRequest();
        xhr2.onloadstart = () => SELF.startLoadAnimation();
        xhr2.onloadend = () => SELF.stopLoadAnimation();
        xhr2.onload = () => {
            if (xhr2.status === 204) {
                loadActivityComment(id);
            } else {
                reject(xhr2.status);
            }
        };
        xhr2.onerror = (evt) => {
            reject("error");
        };
        xhr2.open("DELETE", "/site/activity-comment/" + id);
        xhr2.send();
    }, delActivityClick = function (json) {
        for (var d = 0; d < json.v1.length; d++) {
            var append = "<a data-id=" + json.v1[d].id + " href='javascript:;' >删除</a>";
            $("#del1" + d).html(append);
            $("#del1" + d + " a").each(function () {
                $(this).click(function () {
                    var dataId = $(this).attr("data-id");
                    layer.confirm('确认删除？', function (index) {
                        deleteActivityComment(dataId);
                        openHtml('../../module/user-info/comment.html');//当前页面   
                        layer.close(index);
                    });
                });
            });
        }
    };

    $(document).ready(function () {
        SELF.getUser(function (user) {
            var userId = undefined;
            if (typeof user === "object") {
                userId = user["id"];
                loadVideoComment(userId);
            }
            $("#selected").on("change", function () {
                if ($("option:selected", this).val() === '1001') {
                    userId = user["id"];
                    $("#table1").css({"display": ""});
                    $("#table2").css({"display": "none"});
                    loadVideoComment(userId);
                } else if ($("option:selected", this).val() === '1002') {
                    userId = user["id"];
                    $("#table1").css({"display": "none"});
                    $("#table2").css({"display": ""});
                    loadActivityComment(userId);
                }
            });
        });

    });
})(window, $, layer, SELF);

