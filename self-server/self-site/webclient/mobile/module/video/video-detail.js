(function (window, $, SELF) {
    var danmuss = [], player, flag = true, isVipIp = false;
    var iPGroup = "192.168.1.0-192.168.1.100";
    var initUI = function (videoId, user) {
        $("#video-detail header > span").bind("click", function () {
            destroyUI();
        });
        $("#video-comment-list-area").css("height", 200);

        $("#video-comment-list-area").scroll(function () {
            var top = $("#video-comment-list-area").scrollTop();
            var height = $("#video-comment-list-area").scrollHeight();
            if (Math.abs(height - top) <= 220) {
                if (loadStatus === "ready") {
                    loadComment(currentOffset, pageCount, videoId);
                }
            }
        });
        /* 显示支付按钮 */
        $(".zhifu").click(function () {
            alert("zhifu");
//            getOppenid(function (Oppenid) {
//                var Oppenid = Oppenid;
//            pay();
//            });
        });
        /*监测用户ip*/
        checkIp(iPGroup);
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
            if (user === 401) {
                //saveDanmu(null,videoId, duringTime, text);
            } else {
                saveDanmu(user["id"], videoId, duringTime, text);
            }
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
        /* 评分 */
        if (typeof user === "object") {
            $("#star").raty({
                half: true,
                size: 24,
                starHalf: "star-half.png",
                starOff: "star-off.png",
                starOn: "star-on.png",
                click: function (score, evt) {
                    $("#star").raty("readOnly", true);
                    var score = $("#star").raty('score') * 2;
                    putScore(user["id"], videoId, score);
                }

            });
            getScore(user["id"], videoId);
        } else if (user === 401) {
            $.toptip("只有登录用户才能评分", "warning");
            $("#star").raty({
                half: true,
                size: 24,
                starHalf: "star-half.png",
                starOff: "star-off.png",
                starOn: "star-on.png",
                click: function (score, evt) {
                    layer.msg("只有登录用户才能评分");
                }
            });
            $("#star").raty("readOnly", true)
        }
        /* 点赞 */
        $("#video-laud").bind("click", function () {
            if (typeof user === "object") {
                putLaud(user["id"], videoId, function () {
                    refreshLaud(videoId, user);
                }, function (status) {
                    $.toptip("点赞失败", "error");
                    refreshLaud(videoId, user);
                });
            } else if (user === 401) {
                $.toptip("只有登录用户才能操作", "warning");
            } else {
                $.toptip("无法获取用户信息", "warning");
            }
        });
        //加载弹幕数据
        loadDanmu(videoId);
        /* 发送评论 */
        $("#video-comment-send").bind("click", function () {
            var content = $("#video-detail .weui-input").val();
            if (user === 401) {
                $.toptip("只有登录用户才能评论", "warning");
            } else if (content.trim() === "") {
                $.toptip("不能发布空评论", "warning");
            } else if (typeof user === "object") {
                sendComment(videoId, user["id"], content, function () {
                    $.toptip("评论成功", "success");
                    $("#video-detail .weui-input").val("");
                    reloadComment(videoId);
                }, function (status) {
                    SELF.errorHandler(status);
                });
            } else {
                $.toptip("无法获取用户信息", "warning");
            }
        });

        loadVideo(videoId, user);

        refreshLaud(videoId, user);

    }, requestVideo = function (videoId, success, fail) {
        var uri = "/site/video/" + videoId;
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
    }, checkIp = function (iPGroup, success, fail) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                isVipIp = window.JSON.parse(xhr.response);
                return isVipIp;
            } else if (xhr.status === 404) {
                disableVideo();
            } else {
                fail(xhr.status);
            }
        };

        xhr.onerror = function () {
            fail("error");
        };
        xhr.open("GET", "/site/user/ip?iPGroup=" + iPGroup);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadVideo = function (videoId, user) {
        requestVideo(videoId, function (response) {
            var video = JSON.parse(response);
            if (video["vip"] === true) {
                /* 如果是VIP视频，需用户登录然后判断用户是VIP用户才可以播放 */
                if (user === 401) {
                    $.toast("如要观看请先登录", "cancel");
                    disableVideo();
                } else if (typeof user !== "object") {
                    SELF.errorHandler(user);
                    disableVideo();
                } else {
                    SELF.getUserInfo(user["id"], function (userInfo) {
                        if (userInfo["vip"] === true || isVipIp) {
                            processVideo(video);
                            loadComment(0, pageCount, videoId);
                        } else {
                            $.toptip("VIP用户才可观看", "warning");
                            disableVideo();
                        }
                    });
                }
            } else {
                /* 如果是非VIP视频，无需登录和审核用户权限，直接播放 */
                processVideo(video);
                loadComment(0, pageCount, videoId);
            }

        }, function (status) {
            disableVideo();
            SELF.errorHandler(status);
        });
    }, processVideo = function (video) {
        if (video["enable"] === true) {
            $("#video-intro-name").text(video["title"]);
            $("#video-intro-content").text(video["introduction"]);
            $("#video-intro-area img").attr("src", video["thumbnail"]);
            $("#video-detail .aui-iconfont.aui-icon-note").text("  " + video["comment-num"]);
        }
        player = window.videojs("self-video-player", {
            "controls": "true"
        }, function () {
            //设置弹幕属性
            $("#danmu").danmu({
//                left: "14.5%",
                top: "10%",
                height: $("#self-video-player").height() * 0.65, //$("#my-player").height(),
                width: $("#self-video-player").width(),
                zindex: 10000,
                speed: 7000,
                opacity: 1,
                //danmuss:danmuss,
                font_size_small: 16,
                font_size_big: 24,
                top_botton_danmu_time: 6000
            });
            player.on("play", function () {
                $('#danmu,.send_danmu_bar').show();
                if (flag) {
                    $("#danmu").danmu("addDanmu", danmuss);
                    flag = false;
                }
                //设置弹幕与视频同步
                var whereYouAt = player.currentTime();
                $('#danmu').danmu("setTime", Math.floor(whereYouAt * 10));
                //$("#danmu").danmu("danmuStart");
                $('#danmu').danmu('danmuResume');
            });
            player.on("pause", function () {
                $('#danmu').danmu('danmuPause');
                $('#danmu,.send_danmu_bar').hide();
            });
            player.src(video["path"]);
            /* 装载字幕 */
            if (video["enSubtitle"] && video["enSubtitle"] !== null) {
                player.addRemoteTextTrack({
                    kind: "subtitles",
                    srclang: "en",
                    src: video["enSubtitle"],
                    label: "English"
                }, false);
            }
            if (video["zhSubtitle"] && video["zhSubtitle"] !== null) {
                player.addRemoteTextTrack({
                    kind: "subtitles",
                    srclang: "zh",
                    src: video["zhSubtitle"],
                    label: "中文"
                }, false);
            }
            if (video["esSubtitle"] && video["esSubtitle"] !== null) {
                player.addRemoteTextTrack({
                    kind: "subtitles",
                    srclang: "es",
                    src: video["esSubtitle"],
                    label: "El español"
                }, false);
            }
        });
    }, disableVideo = function () {
        $("#video-comment-send").unbind();
        $("#video-laud").unbind();
        $("#video-detail .weui-input").attr("disabled", true);
        $("#video-comment-more").remove();
        $("#video-comment-none").remove();
    }, sendComment = function (videoId, userId, comment, success, fail) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 204) {
                success();
            } else {
                fail(xhr.status);
            }
        };
        xhr.onerror = function () {
            fail("error");
        };
        xhr.open("POST", "/site/video-comment/");
        xhr.setRequestHeader("Content-Type", "application/json");
        var obj = {
            "user": {
                "id": userId
            },
            "video": {
                "id": videoId
            },
            "comment": comment
        };
        xhr.send(JSON.stringify(obj));
    }, requestComment = function (offset, count, videoId, success, fail) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                success(xhr.response);
            } else {
                fail(xhr.status);
            }
        };
        xhr.onerror = function () {
            fail("error");
        };
        var query = "/site/video-comment?video-id=" + videoId + "&offset=" + offset + "&count=" + count;
        xhr.open("GET", query);
        xhr.send();
    }, loadComment = function (offset, count, videoId) {
        loadStatus = "loading";
        requestComment(offset, count, videoId, function (response) {
            var json = JSON.parse(response),
                    list = json["v1"],
                    length = list.length,
                    total = json["v2"],
                    i = 0,
                    comment = undefined,
                    template = undefined,
                    totalTemplate = "";
            $("#video-detail .aui-iconfont.aui-icon-note").text("  " + total);
            for (; i < length; i++) {
                comment = list[i];
                template = commentTemplate(comment["user"]["user-name"],
                        comment["user-info"]["nick-name"],
                        comment["user-info"]["photo"],
                        new Date(comment["create-time"]).toLocaleString(),
                        comment["comment"]);
                totalTemplate += template;
            }
            $("#video-comment-list").append(totalTemplate);

            if (length < count || (offset + length) >= total) {
                loadStatus = "end";
                $("#video-comment-more").hide();
                $("#video-comment-none").show();
            } else {
                loadStatus = "ready";
            }

            currentOffset += length;

        }, function (status) {
            loadStatus = "ready";
            SELF.errorHandler(status);
        });
    }, commentTemplate = function (userName, nickname, photo, time, content) {
        var html = "<div class='aui-card-list-header aui-card-list-user aui-border-b'>";
        html += "<div class='aui-card-list-user-avatar' style='height: 40px;'>";
        html += "<img src='" + photo + "' class='aui-img-round' />";
        html += "</div>";
        html += "<div class='aui-card-list-user-name'>";
        html += "<div>" + ((nickname && nickname.length > 0) ? nickname : userName) + "</div>";
        html += "<small>" + time + "</small>";
        html += "</div>";
        html += "<div class='aui-card-list-user-info'>" + content + "</div>";
        html += "</div>";
        return html;
    }, reloadComment = function (videoId) {
        currentOffset = 0;
        loadStatus = "ready";
        $("#video-comment-list").empty();

        $("#video-comment-more").show();
        $("#video-comment-none").hide();

        loadComment(0, pageCount, videoId);
    }, //  保存发送弹幕
            saveDanmu = function (userId, videoId, duringTime, danmuContent, success, fail) {

                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        success(xhr.response);
                    } else {
                        fail(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    fail("error");
                };
                xhr.open("POST", "/site/danmu/");
                xhr.setRequestHeader("Content-Type", "application/json");
                var obj = {
                    "user": {
                        "id": userId
                    },
                    "video": {
                        "id": videoId
                    },
                    "during-time": duringTime,
                    "content": danmuContent
                };
                xhr.send(JSON.stringify(obj));
            }, //         下载非即时弹幕
            loadDanmu = function (videoId, success, fail) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = JSON.parse(xhr.response)
                        for (i = 0; i < json.length; i++) {
                            var color = "white";
                            var position = "0";
                            var size = "1";
                            var time = Math.floor(json[i]["during-time"] * 10);
                            var danmu = {text: json[i]["content"], color: color, size: size, position: position, time: time}
                            danmuss.push(danmu);
                        }
                    }
                };
                xhr.onerror = function () {
                    fail("error");
                };
                var query = "/site/danmu?video-id=" + videoId;
                xhr.open("GET", query);
                xhr.send();
            },
//    删除弹幕
//            deleteDanmu = function (id) {
//                $.ajax({
//                    url: "/site/danmu/" + id,
//                    type: "delete",
//
//                    success: function (msg) {
//                        callback(msg);
//                    },
//                    error: function (xhr, textstatus, thrown) {
//
//                    }
//                });
//            },
            /*星星评分*/
            putScore = function (userId, videoId, score, success, fail) {
                //var obj = "user=" + userId + "&video=" + videoId + "&score=" + score;
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        $.toptip("评分成功", "success");
                        ;
                        clear();
                    } else {
                        fail(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    fail("error");
                };
                xhr.open("POST", "/site/video-score/");

                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send("user=" + userId + "&video=" + videoId + "&score=" + score);
            },
            getScore = function (userId, videoId, success, fail) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var result = xhr.responseText;
                        if (result) {
                            $("#star").raty('score', result / 2);
                            $("#star").raty('readOnly', true);
                        }
                    } else {
                        fail(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    fail("error");
                };
                var query = "/site/video-score/research?video=" + videoId + "&user=" + userId;
                xhr.open("GET", query);
                xhr.send();
            },
            putLaud = function (userId, videoId, success, fail) { // 点赞
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        success();
                    } else {
                        fail(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    fail("error");
                };
                xhr.open("PUT", "/site/video-likes");
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send("user=" + userId + "&video=" + videoId);
            }, getLaud = function (userId, videoId, success, fail) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                success(xhr.responseText);
            } else if (xhr.status === 404) {
                success(false);
            } else {
                fail(xhr.status);
            }
        };
        xhr.onerror = function () {
            fail("error");
        };
        xhr.open("GET", "/site/video-likes?user=" + userId + "&video=" + videoId);
        xhr.send();
    }, refreshLaud = function (videoId, user) {
        if (typeof user === "object") {
            getLaud(user["id"], videoId, function (response) {
                if (response === true || response === "true") {
                    $("#video-laud > i").css("color", "red");
                } else {
                    $("#video-laud > i").css("color", "black");
                }
            }, function (status) {
                $.toptip("获取点赞失败", "error");
            });
        }
    },
            /*通过code获取oppenid*/
            getOppenid = function (code, success, fail) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var result = xhr.responseText,
                                openid = result.Oppenid;
                        sessionStorage.setItems("openid", openid)
//                        success(Oppenid);
                    } else {
                        fail(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    fail("error");
                };
                var query = "/site/donationpay?code=" + code;
                xhr.open("GET", query);
                xhr.send();
            },
            pay = function () {
                var obj = {
                    "user": {
                        "id": 1,
                        "name": openid,
                    },
                    "video": {
                        "id": 4
                    },
                    "total-fee": 10
                };
                /*oppenid*/
                var openid = sessionStorage.getItem("openid");
                if (openid == null || openid.length == 0) {
                    $.toast("无法获得openid");
                    return;
                }
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.response),
                                code = data.code,
                                paySign = data.paySign,
                                nonceStr = data.nonceStr,
                                timeStamp = data.timeStamp,
                                package = data.package;

                        WeixinJSBridge.invoke(
                                "getBrandWCPayRequest", {
                                    "appId": "wx077c19da2c0ddefa",
                                    "timeStamp": timeStamp,
                                    "nonceStr": nonceStr,
                                    "package": package,
                                    "signType": "MD5",
                                    "paySign": paySign
                                }, function (res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                window.location.href = "/mobile/index.jhtml";
                            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                $.toast("取消支付");
                            } else {
                                $.toast("支付失败");
                            }
                        }
                        );
                    } else {
                        $.toast("支付失败 " + xhr.status + " " + xhr.response);
                    }
                    xhr.onerror = function () {
                        fail("error");
                    };
                    var query = "/site/donationpay/mobileWxpay";
                    xhr.open("POST", query);
                    xhr.send(JSON.stringify(obj));
                }
            },
            destroyUI = function () {
                if (player) {
                    player.dispose();
                    player = undefined;
                }
                $("#video-comment-send").unbind();
                $("#video-laud").unbind();
                $("#video-detail header > span").unbind();
                $.closePopup();
                $("#video-detail").remove();

                currentOffset = 0;

            }, pageCount = 5, // 每次加载评论条数
            currentOffset = 0,
            loadStatus = "ready",
            player = undefined;

    SELF.subscribe("show-video-detail", function (videoId) {
//        if (typeof WeixinJSBridge === "undefined") {
//            alert("undefined");
//            if (document.addEventListener) {
//                alert("addEventListener");
//                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, true);
//            } else if (document.attachEvent) {
//                alert("attachEvent");
//                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
//                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
//            }
//        } else {
//            alert("defined");
//            onBridgeReady();
//        }
        SELF.loadHtml("module/video/video-detail.html", function (html) {
            $("body").append(html);
            $("#video-detail").popup();
            SELF.getUser(function (user) {
                initUI(videoId, user);
            }, function (error) {
                initUI(videoId, error);
            });
            /*获取code 开始*/
            var getRequest = this.getRequest();
            if (getRequest.code) {
                this.code = getRequest.code;
            } else {
                var pageUrl = window.location.href
                        .replace(/[/]/g, "%2f")
                        .replace(/[:]/g, "%3a")
                        .replace(/[#]/g, "%23")
                        .replace(/[&]/g, "%26")
                        .replace(/[=]/g, "%3d");
                var url =
                        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                        "填写网页授权回调域名所对应的那个公众号的AppId" +
                        "&redirect_uri=" +
                        pageUrl + //这里放当前页面的地址
                        "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
                window.location.href = url;
            }
            console.log("CODE：" + getRequest.code);
            alert(1);
            alert(getRequest.code);
            getOppenid(getRequest.code);
            /*获取code 结束*/
        });
    });
})(window, $, SELF);
