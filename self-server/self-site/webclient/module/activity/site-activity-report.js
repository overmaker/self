(function (window, $, layer, SELF) {

    var flow = undefined;

    function fullNum(obj) {
        if (Number(obj) < 10) {
            return '0' + obj;
        } else {
            return obj;
        }
    }

    var loadActivityReport = function (offset, count, pageNum) {
        var xhr = new XMLHttpRequest();
//                id = SELF.getQueryString("id");
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                var len = json["v1"].length,
                        div = "",
                        i = 0;
                for (; i < len; i++) {
                    var mystime = new Date(json["v1"][i]["report-time"]),
                            startTime = mystime.getFullYear() + '-' + fullNum(Number(mystime.getMonth()) + 1) + '-' + fullNum(mystime.getDate()) + ' ' + fullNum(mystime.getHours()) + ":" + fullNum(mystime.getMinutes()) + ":" + fullNum(mystime.getSeconds());
                    div += "<a href='site-activity-report-detail.html?id=" + json["v1"][i].id + "'><div class='layui-col-md12' style='margin-top: 3%;margin-left: 5%;'><div class='layui-col-xs4 layui-col-sm4 layui-col-md3'> <img src='" + json["v1"][i].thumbnail + "' style='width: 100%; height:178px;' /> </div><div class='layui-col-xs8 layui-col-sm8 layui-col-md6' style='margin-left: 3%;margin-top: 1%;'><div class='grid-demo grid-demo-bg1'><p><h2>" + json["v1"][i].title + "</h2></p></div><div style='margin-top: 3%;color: gray;'><div class='layui-col-md12'><div class='layui-col-xs6 layui-col-sm6 layui-col-md6'><p><span>" + startTime + "</span></p></div><div class='layui-col-xs6 layui-col-sm6 layui-col-md6'><p><span>" + json["v1"][i].media + "</span></p></div></div><br /><div style='margin-top: 4%;'> <p>" + json["v1"][i].introduction + "</p></div></p></div></div></div></a>";
                }
                $("#report").html(div);
                
                laypage.render({
                    elem: "report-pager",
                    limit: 5,
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

        xhr.open("GET", "/site/activity-report?offset="+offset+"&count="+count);
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
            loadActivityReport(0, 5, 1);
        });
    });
})(window, $, layer, SELF);
