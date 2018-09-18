(function (window, $, layer, SELF) {

    loadSpeaker = function (offset, count, pageNum) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                var i = 0,
                        tr = "<div style='margin-top: 3%;'><h1 style='line-height: 4rem;float: left;'>演讲者&nbsp;&nbsp;</h1><a href='../../module/user-info/lecturer-reconmmend.html'> <button class='layui-btn layui-btn-sm  layui-btn-radius layui-btn-primary' style='margin-top: 1.5%;'>我要推荐演讲者</button></a></div>",
                        introduction = "";
                for (; i < json["v1"].length; i++) {
                    if (json["v1"][i].introduction.length > 100) {
                        introduction = json["v1"][i].context.substring(0, 500) + "...";
                    } else {
                        introduction = json["v1"][i].context;
                    }
                    //   tr += "<a href='speaker-info.html?id="+json["v1"][i].id+"'><div class='layui-row layui-col-space30'><div class='layui-col-md2'><img src='"+json["v1"][i].photo+"' style='width: 100%;'></div><div class='layui-col-md9'><div class='layui-col-md12'><h2 style='line-height: 3rem;'><span style='line-height: 2rem;'>"+json["v1"][i].name+"</span><span>|</span><span style='line-height: 2rem;color: gray;'>"+json["v1"][i].unit+"</span><span>|</span><span style='line-height: 2rem;color: gray;'>"+json["v1"][i].post+"</span></h2></div><div><h3>"+introduction+"</h3></div></div></div></a>";

                    tr += "<div class='layui-row' style='margin-top: 2%;'>";
                    tr += "<a href='speaker-info.html?id=" + json["v1"][i].id + "'>";
                    tr += "<div class='layui-col-md2'>";
                    tr += "<img src='" + json["v1"][i].photo + "' style='width: 100%;'>";
                    tr += "</div><div class='layui-col-md9' style='margin-left: 3%;'><div><h2 style='line-height: 3rem;'>";
                    tr += "<span style='line-height: 2rem;'>" + json["v1"][i].name + "</span><span>|</span>";
                    tr += "<span style='line-height: 2rem;color: gray;font-size: 1rem;'>" + json["v1"][i].unit + "</span><span>|</span>";
                    tr += "<span style='line-height: 2rem;color: gray;font-size: 1rem;'>" + json["v1"][i].post + "</span>";
                    tr += "</h2></div><div><h3>" + introduction + "</h3></div></div></a></div>";

                }

                $("#spaker").html(tr);

                laypage.render({
                    elem: "spaker-pager",
                    limit: 10,
                    count: json["v2"],
                    curr: pageNum,
                    jump: function (obj, first) {
                        if (!first) {
                            loadSpeaker((obj.curr - 1) * obj.limit, obj.limit, obj.curr);
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
        xhr.open("GET", "/site/speaker/admin?offset=" + offset + "&count=" + count);
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
                Speaker();
            };
            head.appendChild(script);
            $("#a").click(function () {
                $("#b").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
            $("#b").click(function () {
                $("#a").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
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
            loadSpeaker(0, 10, 1);
        });
    });
})(window, $, layer, SELF);
