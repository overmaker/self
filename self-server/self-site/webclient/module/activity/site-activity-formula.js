(function (window, $, layer, SELF) {

    var loadActivityReport = function (offset, count, pageNum) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                var util = layui.util;
                var len = json["v1"].length,
                div = "",
                i = 0;
                for (; i < len; i++) {
                    var obj = json["v1"][i];
                    div += "<div class='times' style='margin-top: 1.5%;font-size: 15px;'><a href='site-activity-formula-detail.html?id=" + obj.id + "' style='color: black;'><i class='am-icon-play' style='margin-right: 1%;'></i><span>"+obj["activity-name"]+"</span><span style='margin: 5%;'>"+obj["cooperation-name"]+"</span><span style='float: right; margin-right: 10%;'>"+util.timeAgo(obj["publish-date"], false)+"</span></a></div>";
                }
                $("#report").html(div);
                
                laypage.render({
                    elem: "report-pager",
                    limit: 10,
                    count: json["v2"],
                    curr: pageNum,
                    jump: function (obj, first) {
                        if (!first) {
                            loadActivityReport((obj.curr - 1) * obj.limit, obj.limit, obj.curr);
                        }
                    }
                });
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/publicity?offset="+offset+"&count="+count);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    };

    laypage = undefined;
    $(document).ready(function () {
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                Activity();
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
        
        layui.use(["laypage", "util"], function () {
            laypage = layui.laypage;
            loadActivityReport(0, 10, 1);
        });
    });
})(window, $, layer, SELF);
