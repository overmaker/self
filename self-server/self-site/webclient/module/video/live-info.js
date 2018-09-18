(function (window, $, layer, SELF) {
    var liveId = SELF.getQueryString("id"), player,
            loadLive = function (liveId) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = window.JSON.parse(xhr.response);
                        $("#commendCount").html("(" + json["comment-num"] + ")"); //显示直播评论数   
                        processLive(json);
                    } else if (xhr.status === 404) {
                        layer.alert("没有找到指定视频", {icon: 2, title: false});
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.open("GET", "/site/live/find/" + liveId);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send();
            }, shareToSina = function (title, url, picurl) {
        var sharesina = 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url + '&pic=' + picurl;
        var top = (window.outerHeight - 505) / 2;
        var left = (window.outerWidth - 615) / 2;
        window.open(sharesina, '_blank', 'width=615,height=505,top=' + top + ',left=' + left);
    }, shareToQQ = function (title, url, picurl) {
        var sharesina = 'https://connect.qq.com/widget/shareqq/index.html?title=' + title + '&url=' + url + '&pics=' + picurl;
        var top = (window.outerHeight - 505) / 2;
        var left = (window.outerWidth - 615) / 2;
        window.open(sharesina, '_blank', 'width=615,height=505,top=' + top + ',left=' + left);
    }, shareToQQzone = function (title, url, picurl) {
        var sharesina = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + title + '&url=' + url + '&pics=' + picurl;
        var top = (window.outerHeight - 505) / 2;
        var left = (window.outerWidth - 615) / 2;
        window.open(sharesina, '_blank', 'width=615,height=505,top=' + top + ',left=' + left);
    }, shareToWeixin = function (title, url, picurl) {
        var sharesina = ' http://s.jiathis.com/qrcode.php?title="+title+"&url="+url';
        var top = (window.outerHeight - 505) / 2;
        var left = (window.outerWidth - 615) / 2;
        window.open(sharesina, '_blank', 'width=615,height=505,top=' + top + ',left=' + left);
    }, processLive = function (json) {
        player = videojs("self-live-player", {
            "autoplay": true,
            "controls": false
        }, function () {
            var timestamp = Date.parse(new Date());
            var startTime = json["start-time"];
            var endTime = json["end-time"];
            if (timestamp >= startTime && timestamp <= endTime) {
                var CT = timestamp - startTime;
                player.currentTime(CT / 1000);
                player.src(json["live-url"]); // 加载视频源
            } else {
                if (timestamp <= startTime) {
//                    player.poster("http://www.self.org.cn/self_tpj/201707/W020180309614472530139.png");
                    layui.use('util', function () {
                        var util = layui.util;
                        //示例
                        var endTime = new Date(json["start-time"]).getTime(), //假设为结束日期
                                serverTime = new Date().getTime(); //假设为当前服务器时间，这里采用的是本地时间，实际使用一般是取服务端的
                        util.countdown(endTime, serverTime, function (date, serverTime, timer) {
                            var str = date[0] + '天' + date[1] + '时' + date[2] + '分' + date[3] + '秒';
                            layui.$('#test').html('距离直播活动开始时间还有：' + str);
                        });
                    });

                } else {
//                    player.poster("http://www.self.org.cn/self_tpj/201707/W020180309614472530139.png");
                    layui.$('#test').html('直播已经结束');
                }

            }
        });
    },
            sendComment = function (liveId, userId, comment) {

                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        $("#self-comment").val("");
                         layer.msg("评论成功，请等待审核");
//                        document.location.reload(); //当前页面 
                        loadComment(0, 5, liveId, "");
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.open("POST", "/site/live-comment/");
                xhr.setRequestHeader("Content-Type", "application/json");
                var obj = {
                    "user": {
                        "id": userId
                    },
                    "live": {
                        "id": liveId
                    },
                    "comment": comment
                };
                xhr.send(JSON.stringify(obj));
            }, putScore = function (userId, liveId, score) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 204) {
                layer.msg("评分成功");
                clear();
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("POST", "/site/live-score/");

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("user=" + userId + "&live=" + liveId + "&score=" + score);
    },
            getScore = function (userId, liveId) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var result = xhr.response;
                        if (result) {
                            $("#star").raty('score', result / 2);
                            $("#star").raty('readOnly', true);

                        }
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                var query = "/site/live-score/research?live=" + liveId + "&user=" + userId;
                xhr.open("GET", query);
                xhr.send();
            }, loadComment = function (offset, count, liveId, pageNum) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = JSON.parse(xhr.response);
                list = json["v1"],
                        len = list.length,
                        total = json["v2"],
                        i = 0,
                        comment = undefined,
                        template = undefined,
                        totalTemplate = "";
                $("#commendCount").html("(" + total + ")");
                for (; i < len; i++) {
                    comment = list[i];
                    template = commentTemplate(comment["id"],
                            comment["user"]["user-name"],
                            comment["user-info"]["nick-name"],
                            comment["user-info"]["photo"],
                            comment["create-time"],
                            comment["comment"]);
                    totalTemplate += template;
                }
                $(".commend-comment ul").empty().append(totalTemplate);
//                        删除评论事件
                delClick();
                laypage.render({
                    elem: "comment-pager",
                    limit: 5,
                    count: total,
                    curr: pageNum,
                    jump: function (obj, first) {
                        if (!first) {
                            loadComment((obj.curr - 1) * obj.limit, obj.limit, liveId, obj.curr);
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
        var query = "/site/live-comment?live-id=" + liveId + "&offset=" + offset + "&count=" + count;
        xhr.open("GET", query);
        xhr.send();
    }, commentTemplate = function (id, userName, nickname, photo, time, content) {
        var util = layui.util;
        return "<li>" +
                "<div class='layui-row comment-div' style='margin-bottom: 1%;'>" +
                "<div class='layui-col-md1 comment-h'>" +
                "<div class='grid-demo grid-demo-bg1' >" +
                "<img src='" + photo + "' class='comment-img'/>" +
                "</div>" +
                "</div>" +
                "<div class='layui-col-md9'>" +
                "<div class='grid-demo'>" +
                "<p>&nbsp;&nbsp;&nbsp;<strong><span  style='color:black;'>" + ((nickname && nickname.length > 0) ? nickname : userName) + "</span></strong>&nbsp;&nbsp;&nbsp;" + util.timeAgo(time, false) + "<button style='float: right;' id='" + id + "' data-id='delComment' href='javascript:;' >删除</button></p>" +
                "<p class='comment-p'>" + content + "</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</li>";
    };
    deleteComment = function (id) {
        $.ajax({
            url: "/site/live-comment/" + id,
            type: "delete",

            success: function (msg) {
                callback(msg);
            },
            error: function (xhr, textstatus, thrown) {

            }
        });
    }, delClick = function () {
        $(".commend-comment ul button[data-id='delComment']").each(function () {
            $(this).click(function () {
                var id = $(this).attr("id");
                SELF.getUser(function (user) {
                    if (user === 401 || user["type"] !== "admin") {
                        layer.msg("只有管理员才能删除评论");
                    } else {
                        layer.confirm('确认删除？', function (index) {
                            deleteComment(id);
                            //                                document.location.reload(); //当前页面 
                            loadComment(0, 5, liveId, 1);
                            layer.close(index);
                        });
                    }
                });
            });
        });

    }
    // 点赞
    putLaud = function (userId, liveId, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 204) {
                callback();
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("PUT", "/site/live-likes");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("user=" + userId + "&live=" + liveId);
    }, getLaud = function (userId, liveId, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                callback(json);
            } else if (xhr.status === 404) {
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/live-likes?user=" + userId + "&live=" + liveId);
        xhr.send();
    }, refreshLaud = function (liveId) {
        SELF.getUser(function (user) {
            if (typeof user === "object") {
                getLaud(user["id"], liveId, function (response) {
                    if (response === true || response === "true") {
                        $("#live-laud").attr("src", "../../../image/laud13.png");
                    } else {
                        $("#live-laud").attr("src", "../../../image/laud12.png");
                    }
                }, function (status) {
                });
            }
        });
    };
    $(document).ready(function () {
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
//                loadLive(liveId);              
            };
            head.appendChild(script);
        });
        loadLive(liveId);
        /* 分享 */
        $("#live-share").bind("click", function () {
            SELF.getUser(function (user) {
                if (user === 401) {
                    layer.msg("只有登录用户才能点赞");
                } else {
//                    var title = live["title"],
                    var title = "nihao",
                            url = window.location.href,
//                                url = video["path"],
//                            picurl = live["thumbnail"];
                            picurl = "<img src='../../../image/weibo2.png'/>";
                    layer.alert(
                            "<div id='shareTo'  style='cursor: pointer;'><a   id='qq'  style='color: #FFC107;'>分享到qq<img src='../../../image/qq2.png'/></a>&nbsp&nbsp&nbsp<a  id='qqzone' style='color: #FF9800;' >分享到qqzone<img src='../../../image/qq2.png'/></a>\n\
 <br><br><a  id='weibo' style='color: #FF5722;'>分享到微博<img src='../../../image/weibo2.png'/></a></div> "
//  <a  id='weiixn' style='color: #4CAF50;'>分享到微信</a>&nbsp&nbsp&nbsp "
                            );
                    $("#qq").click(function () {
                        shareToQQ(title, url, picurl);
                    });
                    $("#qqzone").click(function () {
                        shareToQQzone(title, url, picurl);
                    });
                    $("#weiixn").click(function () {
                        shareToWeixin(title, url, picurl);
                    });
                    $("#weibo").click(function () {
                        shareToSina(title, url, picurl);
                    });
                }
            });
        });
        /* 加载点赞信息 */
        refreshLaud(liveId);
        /* 加载评论 */
        layui.use(["laypage", "util"], function () {
            laypage = layui.laypage;
            loadComment(0, // 初始从数据库第0条检索
                    5, // 每页查5条
                    liveId, // 视频ID
                    ""); // 初始是第一页
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

//        /* 发布评论1 */
//        $("input[type=submit]").click(function () {
//            var content = $("#self-comment").val();
//            SELF.getUser(function (user) {
//                if (user === 401) {
//                    layer.msg("只有登录用户才能评论");
//                    $("#self-comment").val("");
//                } else if (content.trim() === "") {
//                    layer.msg("不能发布空评论");
//                } else {
//                    sendComment(liveId, user.id, content);
//                }
//            });
//        }); 

        /* 发布评论2 */
        $("input[type=submit]").click(function () {
            var content = $("#self-comment").val();
            sendComment(liveId, 28, content);
        });
        
        /* 点赞 */

        $("#live-laud").bind("click", function () {
            SELF.getUser(function (user) {
                if (user === 401) {
                    layer.msg("只有登录用户才能点赞");
                } else {
                    putLaud(user["id"], liveId, function () {
                        refreshLaud(liveId);
                    }, function (status) {
                        layer.msg("点赞失败");
                        refreshLaud(liveId);
                    });
                }
            });
        });
        /* 评分 */
        SELF.getUser(function (user) {
            if (user === 401) {
                layer.msg("只有登录用户才能评分");
                $("#star").raty({
                    half: true,
                    size: 24,
                    starHalf: "star-half-big.png",
                    starOff: "star-off-big.png",
                    starOn: "star-on-big.png",
                    click: function (score, evt) {
                        layer.msg("只有登录用户才能评分");
                    }
                });
                $("#star").raty("readOnly", true)
            } else {
                $("#star").raty({
                    half: true,
                    size: 24,
                    starHalf: "star-half-big.png",
                    starOff: "star-off-big.png",
                    starOn: "star-on-big.png",
                    click: function (score, evt) {
                        $("#star").raty("readOnly", true);
                        var score = $("#star").raty('score') * 2;
                        debugger;
                        putScore(user["id"], liveId, score);
                    }
                });
                getScore(user["id"], liveId);
            }
        });
    }
    );
})(window, $, layer, SELF);