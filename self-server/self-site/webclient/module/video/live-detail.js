(function (window, $, layer, SELF) {
    var liveId = SELF.getQueryString("id"),
//    var liveId = 118,
            player = true;
    checkDanmu = function (content, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                callback(json);
            } else if (xhr.status === 404) {
                processDisable();
            } else {
                SELF.errorHandler(xhr.status);
            }
        };

        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/danmu/check");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`content=${content}`);
    }, loadLive = function (liveId, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
//                callback(json);
                $("#title1").html(json.title);
                $("#title2").html(json.title);
                $("#place").html(json.place);
                $("#image").attr("src", json.image);
                var date = new Date(json["live-starttime"]), //日期对象
                        now = "";
                now = date.getFullYear(json["live-starttime"]) + "年"; //读英文就行了
                now = now + (date.getMonth(json["live-starttime"]) + 1) + "月"; //取月的时候取的是当前月-1如果想取当前月+1就可以了
                now = now + date.getDate(json["live-starttime"]) + "日";
                now = now + date.getHours(json["live-starttime"]) + "时";
                now = now + date.getMinutes(json["live-starttime"]) + "分";
                now = now + date.getSeconds(json["live-starttime"]) + "秒";
                $("#time1").html(now);
                $("#time2").html(now);
                callback(json);
            } else if (xhr.status === 404) {
                layer.alert("没有找到指定活动", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };

        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/activity/livefind/" + liveId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, processLive = function (json) {
        player = videojs("self-live-player", {
            "autoplay": true,
            "controls": false
        }, function () {
            //设置弹幕属性
            $("#danmu").danmu({
                left: "10px",
                top: "3%",
                height: $("#self-live-player").height() * 0.65, //$("#my-player").height(),
                width: $("#self-live-player").width() * 1.00,
                zindex: 100,
                speed: 7000,
                opacity: 1,
                //danmuss:danmuss,
                font_size_small: 16,
                font_size_big: 24,
                top_botton_danmu_time: 6000
            });
            $('#danmu,.send_danmu_bar').show();
            //设置弹幕与视频同步
            var whereYouAt = player.currentTime();
            $('#danmu').danmu("setTime", Math.floor(whereYouAt * 10));
            $('#danmu').danmu('danmuResume');
            player.src(json["live-url"]); // 加载视频源
        });
    };

    $(document).ready(function () {
        loadLive(liveId, function (json) {
            processLive(json);
        });
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
    });
    //发送弹幕
    $(".send_danmu_bar button").click(function () {
        var whereYouAt = player.currentTime();
        //var duringTime=Math.floor(whereYouAt);
        //保留一位小数，精确到分秒，数据库存的播放时间单位是秒
        var duringTime = whereYouAt.toFixed(1);
        //         	$("#danmu").danmu("addDanmu", {text: $('#danmu').data("nowTime")+"-------"+a, color: "blue", size: 1, position: 0, time:  $('#danmu').data("nowTime") + 1, isnew: ""});
        var text = document.getElementById('text').value;
        var time = $('#danmu').data("nowTime") + 2;
        var color = "blue";
        var position = "0";
        var size = "1";
        if (text !== "") {
            checkDanmu(text, function (json) {
                if (json) {
//                        $('#danmu').danmu("addDanmu", {text: "", color: color, size: size, position: position, time: time, isnew: ""});
//                        alert("敏感弹幕已经被屏蔽,经管理员审核通过后将会发布！");

                } else {
                    $('#danmu').danmu("addDanmu", {text: text, color: color, size: size, position: position, time: time, isnew: ""});
                }
            });
        }
        document.getElementById('text').value = '';
    });
    //回车发送弹幕
    $("#text").keyup(function (e) {
        if (e.keyCode === 13) {
            $(".send_danmu_bar button").click();
        }
    });
    //是否显示弹幕  
    $(".send_danmu_bar input").change(function () {
        if (document.getElementById("ishide").checked) {
            $('#danmu,#text,.send_danmu_bar button').show();
        } else {
            $('#danmu,#text,.send_danmu_bar button').hide();
        }
    });
})(window, $, layer, SELF);
