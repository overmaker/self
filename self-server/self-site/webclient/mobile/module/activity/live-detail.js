(function (window, $, SELF) {

    var initUI = function (liveId, user) {
        $("#live-detail header > span").bind("click", function () {
            destroyUI();
        });
        loadLive(liveId);
    }, requestLive = function (liveId, success, fail) {
        var uri = "/site/activity/livefind/" + liveId;
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onerror = function () {
            fail("error");
        };
        xhr.onload = function () {
            if (xhr.status === 200) {
                success(xhr.response);
            } else {
                fail(xhr.status);
            }
        };
        xhr.open("GET", uri);
        xhr.send();
    }, loadLive = function (liveId) {
        requestLive(liveId, function (response) {
            var live = JSON.parse(response);
            processLive(live);
        }, function (status) {
            disableLive();
            SELF.errorHandler(status);
        });
    }, processLive = function (live) {
        console.log(live);
//        $("#live-intro-name").text(live["title"]);
//        $("#live-intro-content").text(live["introduction"]);
//        $("#live-intro-area img").attr("src", live["image"]);
        player = window.videojs("self-live-player", {
            "controls": "false"
        }, function () {
            //发送弹幕
            $(".send_danmu_bar button").click(function () {

                var whereYouAt = player.currentTime();
                //var duringTime=Math.floor(whereYouAt);
                //保留一位小数，精确到分秒，数据库存的播放时间单位是秒
                var duringTime = whereYouAt.toFixed(1);
//         	$("#danmu").danmu("addDanmu", {text: $('#danmu').data("nowTime")+"-------"+a, color: "blue", size: 1, position: 0, time:  $('#danmu').data("nowTime") + 1, isnew: ""});
                var text = document.getElementById('text').value;
                var time = $('#danmu').data("nowTime") + 1;
                var color = "blue";
                var position = "0";
                var size = "1";
                if (text !== "") {
                    $('#danmu').danmu("addDanmu",
                            {text: text, color: color, size: size, position: position, time: time, isnew: ""});
                }
                document.getElementById('text').value = '';
            });
            //设置弹幕与视频同步
            var whereYouAt = player.currentTime();
            $('#danmu').danmu("setTime", Math.floor(whereYouAt * 10));
            //$("#danmu").danmu("danmuStart");
            $('#danmu').danmu('danmuResume');
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
            player.src(live["live-url"]); // 加载视频源
            /* 装载字幕 */
            if (live["enSubtitle"] && live["enSubtitle"] !== null) {
                player.addRemoteTextTrack({
                    kind: "subtitles",
                    srclang: "en",
                    src: live["enSubtitle"],
                    label: "English"
                }, false);
            }
            if (live["zhSubtitle"] && live["zhSubtitle"] !== null) {
                player.addRemoteTextTrack({
                    kind: "subtitles",
                    srclang: "zh",
                    src: live["zhSubtitle"],
                    label: "中文"
                }, false);
            }
            if (live["esSubtitle"] && live["esSubtitle"] !== null) {
                player.addRemoteTextTrack({
                    kind: "subtitles",
                    srclang: "es",
                    src: live["esSubtitle"],
                    label: "El español"
                }, false);
            }
        });
    }, disableLive = function () {
        $("#live-detail .weui-input").attr("disabled", true);
        $("#live-comment-send").unbind();
        $("#live-laud").unbind();
        $("#live-comment-more").remove();
        $("#live-comment-none").remove();
    }, destroyUI = function () {
        if (player) {
            player.dispose();
            player = undefined;
        }
        $("#vidliveeo-detail header > span").unbind();
        $.closePopup();
        $("#live-detail").remove();
    }, player = undefined;

    SELF.subscribe("show-live-detail", function (liveId) {
        SELF.loadHtml("module/activity/live-detail.html", function (html) {
            $("body").append(html);
            $("#live-detail").popup();
            initUI(liveId);
        });
    });
})(window, $, SELF);
