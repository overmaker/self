(function (window, $, layer, SELF) {
    var videoId = SELF.getQueryString("id"),
            id = 0,
            danmuss = [],
            player, flag = true,
            isVipIp = false;
    checkIp = function (iPGroup) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                isVipIp = window.JSON.parse(xhr.response);
                return isVipIp;
            } else if (xhr.status === 404) {
                processDisable();
            } else {
                SELF.errorHandler(xhr.status);
            }
        };

        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/user/ip?iPGroup=" + iPGroup);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, checkDanmu = function (content, callback) {
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
    }, checkSave = function (videoId, uId, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                callback(json);
                if (json) {
                    $("#video-save").css("color", "red");
                }
            } else if (xhr.status === 404) {
                alert(404);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };

        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("PUT", "/site/save/check");
        let objPrams = {
            "target-id": videoId,
            "type": "1",
            "user": {
                "id": uId}
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, postSave = function (title, image, videoId, uId) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 204) {
                alert("收藏成功");
                $("#video-save").css("color", "red");
            } else if (xhr.status === 404) {
                alert("资源有误");
            } else {
                SELF.errorHandler(xhr.status);
            }
        };

        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/save");
        let objPrams = {
            "title": title,
            "image": image,
            "target-id": videoId,
            "type": "1",
            "user": {
                "id": uId}
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
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
    }, /同期视频/
    sameTimeVideo = function (offset, count, videoId) {
        var xhr = new XMLHttpRequest();
        videoId = SELF.getQueryString("id"),
                xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        title = "";
                //                标题字数控制以及相关视频排除自身
                for (var k = 0; k < json.v1.length; k++) {
                    if (json.v1[k].title.length > 22) {
                        title = json.v1[k].title.substring(0, 24) + "...";
                    } else {
                        title = json.v1[k].title;
                    }
                    if (videoId != json.v1[k].id) {
//                        id = json.v1[1].id;
                        loadVideoInfo2(json.v1[k].id, json.v1[k], title);
                    }
                }
            } else if (xhr.status === 404) {
                layer.alert("没有找到指定视频", {icon: 2, title: false});
                processDisable();
            } else {
                SELF.errorHandler(xhr.status);
            }
        }

        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/video/find/" + videoId + "?offset=" + offset + "&count=" + count);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, /视频演讲者/
    videoSpeaker = function (videoId) {
        var xhr = new XMLHttpRequest();
        videoId = SELF.getQueryString("id"),
                xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        introduction = json["introduction"],
                        name = json["name"],
                        id = json.id,
                        path = json["photo"];
                if (introduction.length > 50) {
                    introduction = introduction.substring(0, 50) + "...";
                }
                var apeendVideo = "<li><div class=\"layui-row\">";
                apeendVideo += "<div class=\"layui-col-md2\">";
                apeendVideo += "<div class=\"grid-demo grid-demo-bg1\">";
                apeendVideo += "<a href=\"../../module/about/speaker-info.html?id=" + id + "\"><img src=" + path + " class=\"commend-right-img\" style='width: 83px;height: 83px;border-radius: 50px;margin-left: 20%;' /></a> ";
                apeendVideo += "</div>";
                apeendVideo += "</div>";
                apeendVideo += "<div class=\"layui-col-md9\">";
                apeendVideo += "<div class=\"grid-demo\">";
                apeendVideo += " <a href=\"../../module/about/speaker-info.html?id=" + id + "\"><h2>" + name + "&nbsp;" + json["post"] + "</h2></a> ";
                apeendVideo += "  <p style='margin-top: 2%;'>" + introduction + "</p>";
                apeendVideo += "</div>";
                apeendVideo += "</div>";
                apeendVideo += "</div>";
//              apeendVideo += "<hr />";
                apeendVideo += "<li />";
                $("#speakerIntro").append(apeendVideo);
            } else if (xhr.status === 404) {
                $("#speakerIntro").append("暂无演讲者信息");
            } else {
                SELF.errorHandler(xhr.status);
            }
        };

        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/speaker/find/" + videoId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadVideo = function (videoId, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        intro = json["introduction"];
                $("#commendCount").html("(" + json["comment-num"] + ")"); //显示视频评论数
//                if (intro.length > 50) {
//                    intro = intro.substring(0, 50) + "...";
//                }
                $("#intro").html(intro); //显示视频评论数
                callback(json);
            } else if (xhr.status === 404) {
                layer.alert("没有找到指定视频", {icon: 2, title: false});
                processDisable();
            } else {
                SELF.errorHandler(xhr.status);
            }
        };

        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/video/" + videoId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadVideoInfo2 = function (videoId, json, title) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var videoInfo = window.JSON.parse(xhr.response);

                var apeendVideo = "<li><div class=\"layui-row\">";
                apeendVideo += "<div class=\"layui-col-md6\">";
                apeendVideo += "<div class=\"grid-demo grid-demo-bg1\">";
                apeendVideo += "<a href=\"video-info.html?id=" + json.id + "\"><img src=" + json.thumbnail + " class=\"commend-right-img\" /></a> ";
                apeendVideo += "</div>";
                apeendVideo += "</div>";
                apeendVideo += "<div class=\"layui-col-md6\">";
                apeendVideo += "<div class=\"grid-demo\">";
                apeendVideo += " <a href=\"video-info.html?id=" + json.id + "\"><h4>" + title + "</h4></a> ";
                apeendVideo += "  <p style='font-size: 11px;'>" + videoInfo.hitsNum + "次观看</p>";
                apeendVideo += "</div>";
                apeendVideo += "</div>";
                apeendVideo += "</div>";
                apeendVideo += "<hr />";
                apeendVideo += "<li />";
                $("#sameTimeVideo").append(apeendVideo);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/video-info/" + videoId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, /相关视频/
    loadVideoInfo = function (videoId, json, title) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var videoInfo = window.JSON.parse(xhr.response);

                var apeendVideo = "<li><div class=\"layui-row\">";
                apeendVideo += "<div class=\"layui-col-md6\">";
                apeendVideo += "<div class=\"grid-demo grid-demo-bg1\">";
                apeendVideo += "<a href=\"video-info.html?id=" + json.id + "\"><img src=" + json.thumbnail + " class=\"commend-right-img\" /></a> ";
                apeendVideo += "</div>";
                apeendVideo += "</div>";
                apeendVideo += "<div class=\"layui-col-md6\">";
                apeendVideo += "<div class=\"grid-demo\">";
                apeendVideo += " <a href=\"video-info.html?id=" + json.id + "\"><h4>" + title + "</h4></a> ";
                apeendVideo += "  <p style='font-size: 11px;'>" + videoInfo.hitsNum + "次观看</p>";
                apeendVideo += "</div>";
                apeendVideo += "</div>";
                apeendVideo += "</div>";
                apeendVideo += "<hr />";
                apeendVideo += "<li />";
                $("#autoplayVideo").append(apeendVideo);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/video-info/" + videoId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, /相关视频/
    loadAutoplayVideo = function (offset, count, type) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                //                数组实现倒序
                json["v1"].reverse();
                var title = "";
                for (var i = 0; i < json.v1.length; i++) {
                    if (videoId === json.v1[i].id) {
                        //                        slice() 方法可从已有的数组中返回选定的元素。splice清空数组元素
                        var a = json["v1"].slice(0, i);
                        json["v1"].splice(0, i);
                        for (var j = 0; j < a.length; j++) {
                            json["v1"].push(a[j]);
                        }
                    }
                }
                //                标题字数控制以及相关视频排除自身
                for (var k = 0; k < json.v1.length; k++) {
                    if (json.v1[k].title.length > 22) {
                        title = json.v1[k].title.substring(0, 24) + "...";
                    } else {
                        title = json.v1[k].title;
                    }
                    if (videoId != json.v1[k].id) {
                        id = json.v1[1].id;
                        loadVideoInfo(json.v1[k].id, json.v1[k], title);
                    }
                }

            } else if (xhr.status === 404) {
                layer.alert("没有找到指定视频", {icon: 2, title: false});
                processDisable();
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", `/site/video?offset=${offset}&count=${count}&type=` + type);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    },
            //  保存发送弹幕
            saveDanmu = function (userId, videoId, duringTime, danmuContent) {

                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
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
            },
            //         下载非即时弹幕
            loadDanmu = function (videoId) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = JSON.parse(xhr.response);
                        for (i = 0; i < json.length; i++) {
                            var color = "white";
                            var position = "0";
                            var size = "1";
                            var time = Math.floor(json[i]["during-time"] * 10);
                            var danmu = {text: json[i]["content"], color: color, size: size, position: position, time: time};
                            danmuss.push(danmu);
                        }
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                var query = "/site/danmu?video-id=" + videoId;
                xhr.open("GET", query);
                xhr.send();
            },
            //    删除弹幕
            deleteDanmu = function (id) {
                $.ajax({
                    url: "/site/danmu/" + id,
                    type: "delete",

                    success: function (msg) {
                        callback(msg);
                    },
                    error: function (xhr, textstatus, thrown) {

                    }
                });
            },
            processVideo = function (json) {
                player = videojs("self-video-player", {
                    "controls": "true"
                }, function () {

                    //设置弹幕属性
                    $("#danmu").danmu({
                        //                        left: "2.5%",
                        top: "16%",
                        height: $("#self-video-player").height() * 0.65, //$("#my-player").height(),
                        width: $("#self-video-player").width(),
                        zindex: 100,
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
                            SELF.getUser(function (user) {
                                putHits(videoId, user.id);
                            });
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
//                        $('#danmu,.send_danmu_bar').hide();
                    });
                    player.on("ended", function () {
                        SELF.getUser(function () {
                            if (id > 0) {
                                window.location.href = "video-info.html?id=" + id;
                            }
                        });
                    });
                    //视频播放前展示图片
                    //                    player.poster("http://www.self.org.cn/self_tpj/201707/W020180309614472530139.png");
                    $(".video-title > h2").html(json["title"]);
                    player.src(json["path"]); // 加载视频源
                    /* 装载字幕 */
                    if (json["enSubtitle"] && json["enSubtitle"] !== null) {
                        player.addRemoteTextTrack({
                            kind: "subtitles",
                            srclang: "en",
                            src: json["enSubtitle"],
                            label: "English"
                        }, false);
                    }
                    if (json["zhSubtitle"] && json["zhSubtitle"] !== null) {
                        player.addRemoteTextTrack({
                            kind: "subtitles",
                            srclang: "zh",
                            src: json["zhSubtitle"],
                            label: "中文"
                        }, false);
                    }
                    if (json["esSubtitle"] && json["esSubtitle"] !== null) {
                        player.addRemoteTextTrack({
                            kind: "subtitles",
                            srclang: "es",
                            src: json["esSubtitle"],
                            label: "El espa?ol"
                        }, false);
                    }
                });
            },
            /* 未登录用户或普通用户vip视频播放 */
            processVideo2 = function (json) {

                player = videojs("self-video-player", {
                    controls: "true"
                }, function () {
                    //设置弹幕属性
                    $("#danmu").danmu({
                        left: "14.5%",
                        top: "26%",
                        height: $("#self-video-player").height() * 0.65, //$("#my-player").height(),
                        width: $("#self-video-player").width(),
                        zindex: 100,
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
                            SELF.getUser(function (user) {
                                putHits(videoId, user.id);
                            });
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
//                        $('#danmu,.send_danmu_bar').hide();
                    });
                    player.on("progress", function () {
                        var progress = this.currentTime();
                        playerEvent(progress);
                    });

                    function playerEvent(progress) {
                        if (parseInt(progress) >= 360) {
                            player.pause();
                            player.currentTime(0);
                            layer.alert("非VIP只能观看前6分钟,如要观看完整视频请先成为vip！", {
                                skin: 'layui-layer-molv', //样式类名  自定义样式
                                closeBtn: 1 // 是否显示关闭按钮
                            });
                        }
                    }
                    //视频播放前展示图片
//                    player.poster("http://www.self.org.cn/self_tpj/201707/W020180309614472530139.png");
                    $(".video-title > h2").html(json["title"]);
                    player.src(json["path"]); // 加载视频源
                    //装载字幕 
                    if (json["enSubtitle"] && json["enSubtitle"] !== null) {
                        player.addRemoteTextTrack({
                            kind: "subtitles",
                            srclang: "en",
                            src: json["enSubtitle"],
                            label: "English"
                        }, false);
                    }
                    if (json["zhSubtitle"] && json["zhSubtitle"] !== null) {
                        player.addRemoteTextTrack({
                            kind: "subtitles",
                            srclang: "zh",
                            src: json["zhSubtitle"],
                            label: "中文"
                        }, false);
                    }
                    if (json["esSubtitle"] && json["esSubtitle"] !== null) {
                        player.addRemoteTextTrack({
                            kind: "subtitles",
                            srclang: "es",
                            src: json["esSubtitle"],
                            label: "El espa?ol"
                        }, false);
                    }
                });
            },
            /* 无效视频的处理 */
            processDisable = function () {
                $("#self-comment").attr("disabled", true);
                $("input[type=submit]").attr("disabled", true);
            },
            sendComment = function (videoId, userId, comment) {

                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        $("#self-comment").val("");
                        layer.msg("评论成功,请等候审核");
                        //                        document.location.reload(); //当前页面 
                        loadComment(0, "", videoId, 1);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
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
            },
            putScore = function (userId, videoId, score) {
                //var obj = "user=" + userId + "&video=" + videoId + "&score=" + score;
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

                xhr.open("POST", "/site/video-score/");

                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send("user=" + userId + "&video=" + videoId + "&score=" + score);
            },
            getScore = function (userId, videoId) {
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
                var query = "/site/video-score/research?video=" + videoId + "&user=" + userId;
                xhr.open("GET", query);
                xhr.send();
            },
            putHits = function (videoId, userId) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.open("POST", "/site/video-hits/");
                xhr.setRequestHeader("Content-Type", "application/json");
                var obj = {
                    "user": {
                        "id": userId
                    },
                    "video": {
                        "id": videoId
                    }
                };
                xhr.send(JSON.stringify(obj));
            },
            loadComment = function (offset, count, videoId, pageNum) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = JSON.parse(xhr.response),
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
                        //删除评论事件
                        delClick();
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                var query = "/site/video-comment?video-id=" + videoId + "&offset=" + offset + "&count=10000";
                xhr.open("GET", query);
                xhr.send();
            },
            //<a style='float: right;color: gray;font-size: 16px;'id='" + id + "' data-id='delComment' href='javascript:;' >删除</a>（删除功能）
            commentTemplate = function (id, userName, nickname, photo, time, content) {
                var util = layui.util;
                return "<li>" +
                        "<div class='layui-row  comment-div'>" +
                        "<div class='layui-col-md3 comment-h'>" +
                        "<div class='grid-demo grid-demo-bg1' >" +
                        "<img src='" + photo + "' class='comment-img'/>" +
                        "</div>" +
                        "</div>" +
                        "<div class='layui-col-md9'>" +
                        "<div class='grid-demo'>" +
                        "<p style='font-size:12px'>&nbsp;&nbsp;&nbsp;<strong><span  style='color:#2196F3;font-size:13px'>" + ((nickname && nickname.length > 0) ? nickname : userName) + "</span></strong>&nbsp;&nbsp;&nbsp;" + util.timeAgo(time, false) + "</p>" +
                        "<p class='comment-p' style='font-size:14px'> " + content + "</p>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</li>";
            }, deleteComment = function (id) {
        $.ajax({
            url: "/site/video-comment/" + id,
            type: "delete",

            success: function (msg) {
                callback(msg);
            },
            error: function (xhr, textstatus, thrown) {

            }
        });
    }, delClick = function () {
        $(".commend-comment ul a[data-id='delComment']").each(function () {
            $(this).click(function () {
                var id = $(this).attr("id");
                SELF.getUser(function (user) {
                    if (user === 401 || user["type"] !== "admin") {
                        var index = layer.open({
                            title: '登陆',
                            type: 2,
                            area: ["1000px", "720px"],
                            content: "/login/login.html?redirect_url=/module/video/video-info.html?id=" + videoId
                        });
//                    layer.msg("只有登录用户才能评论");
//                    $("#self-comment").val("");
                        layer.msg("只有管理员才能删除评论");
                    } else {
                        layer.confirm('确认删除？', function (index) {
                            deleteComment(id);
                            //                                document.location.reload(); //当前页面 
                            loadComment(0, "", videoId, 1);
                            layer.close(index);
                        });
                    }
                });
            });
        });
    }
    //     点赞
    putLaud = function (userId, videoId, callback) {
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
        xhr.open("PUT", "/site/video-likes");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("user=" + userId + "&video=" + videoId);
    }, getLaud = function (userId, videoId, callback) {
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
        xhr.open("GET", "/site/video-likes?user=" + userId + "&video=" + videoId);
        xhr.send();
    }, refreshLaud = function (videoId) {
        SELF.getUser(function (user) {
            if (typeof user === "object") {
                getLaud(user["id"], videoId, function (response) {
                    if (response === true || response === "true") {
                        $("#video-laud").css("color", "red");
                    } else if (response === false || response === "false") {
                        $("#video-laud").css("color", "white");
                    }
                }, function (status) {});
            }
        });
    }, putVideoDonation = function (userId, videoId, videoDonation) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = JSON.parse(xhr.response),
                        return_code = json["return_code"],
                        result_code = json["result_code"];
                if (return_code === "SUCCESS" && result_code === "SUCCESS") {
                    layer.alert(
                            "<img src='/site/donationpay/qr-code?data=" + json["code_url"] + "' />"
                            );
                }
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/donationpay/wxpay");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        var obj = {
            "user": {
                "id": userId
            },
            "video": {
                "id": videoId
            },
            "total-fee": videoDonation
        };
        xhr.send(JSON.stringify(obj));
    };
    laypage = undefined;
    $(document).ready(function () {
        $("#weixinDiv").hide();
        $("#shareTo").hide();
        window.onload = function () {
            (function () {
                //获取放置微信二维码的DIV
                var content = document.getElementById("qrcode");
                //设置属性
                var qrcode = new QRCode(content, {
                    width: 200,
                    height: 200
                });
                //设置二维码内容
                var defaultContent = window.location.href;
                qrcode.makeCode(defaultContent);
            })();
        }
        SELF.getUser(function (user) {
            var uId = user["id"];
            if (user === 401) {
                layer.msg("只有登录用户收藏");
            } else {
                checkSave(videoId, uId, function (json) {
                });
            }
        });
//        sameTimeVideo(id, function () {
//        });
        videoSpeaker(id, function () {
        });
        checkIp();
//        $('#danmu,.send_danmu_bar').hide();
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                Video();
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
        if (videoId === null) {
            layer.alert("没有指定视频", {icon: 2, title: false});
            processDisable();
            return;
        }
        loadVideo(videoId, function (video) {
            /* 分享 */
            $("#video-share").bind("click", function () {
                SELF.getUser(function (user) {
                    var title = video["title"],
                            url = window.location.href,
//                                url = video["path"],
                            picurl = video["thumbnail"];
                    $("#shareTo").show();
                    $("#qq").click(function () {
                        shareToQQ(title, url, picurl);
                    });
                    $("#qqzone").click(function () {
                        shareToQQzone(title, url, picurl);
                    });
                    $("#weiixn").click(function () {
                        $("#weixinDiv").show();
                    });
                    $("#weibo").click(function () {
                        shareToSina(title, url, picurl);
                    });
                });
            });
            var offset = 0,
                    count = 4;
            //相关视频

            loadAutoplayVideo(0, // 初始从数据库第0条检索
                    4, // 每页查5条
                    video.type.id, // 视频ID
                    1);
            loadAutoplayVideo(video.type.id, offset, count);
            $("#huan").click(function () {
                $("#autoplayVideo").empty();
                loadAutoplayVideo(0, // 初始从数据库第0条检索
                        4, // 每页查5条
                        video.type.id, // 视频ID
                        1);
            });
            //相关视频
            sameTimeVideo(videoId, 0, 3);
            $("#huan1").click(function () {
                $("#sameTimeVideo").empty();
                sameTimeVideo(0, // 初始从数据库第0条检索
                        3, // 每页查5条
                        videoId, // 视频ID
                        1);
            });

            if (video["vip"] === true) {
                /* 如果是VIP视频，需用户登录然后判断用户是VIP用户才可以播放 */
                SELF.getUser(function (user) {
                    if (user === 401) {
                        var index = layer.open({
                            title: '登陆',
                            type: 2,
                            area: ["1000px", "720px"],
                            content: "/login/login.html?redirect_url=/module/video/video-info.html?id=" + videoId
                        });
//                    layer.msg("只有登录用户才能评论");
//                    $("#self-comment").val("");
                        processVideo2(video);
                    } else if (typeof user !== "object") {
                        SELF.errorHandler(user);
                        processDisable();
                    } else {
                        SELF.getUserInfo(user["id"], function (userInfo) {
                            if (userInfo === 401) {
                                processVideo2(video);
                            } else if (typeof userInfo !== "object") {
                                SELF.errorHandler(user);
                                processDisable();
                            } else {
                                if (userInfo["vip"] === true || isVipIp) {
                                    processVideo(video);
                                    /* 加载评论 */
                                    loadComment(0,"",videoId,1);
                                } else {
                                    processVideo2(video);
                                }
                            }
                        });
                    }
                });
            } else {
                /* 如果是非VIP视频，无需登录和审核用户权限，直接播放 */
                processVideo(video);
                /* 加载评论 */
                loadComment(0,"",videoId,1);
            }
        });
        refreshLaud(videoId);
        //加载弹幕数据
        loadDanmu(videoId);
        /* 发布评论 1*/
        //"/login/login.html?redirect_url=/module/video/video-info.html?id=" + videoId,
        $("input[type=submit]").click(function () {
            var content = $("#self-comment").val();
            SELF.getUser(function (user) {
                if (user === 401) {
                    var index = layer.open({
                        title: '登陆',
                        type: 2,
                        content: "/login/login.html?redirect_url=/module/video/video-info.html?id=" + videoId,
                        area: ['1200px', '700px']
                    });
//                    layer.msg("只有登录用户才能评论");
//                    $("#self-comment").val("");
                } else if (content.trim() === "") {
                    layer.msg("不能发布空评论");
                } else {
                    sendComment(videoId, user.id, content);
                }
            });
        });

//        /* 发布评论 2*/
//        $("input[type=submit]").click(function () {
//            var content = $("#self-comment").val();
//            sendComment(videoId, 28, content);
//        });

        //打赏事件

        $("#donation a").each(function () {
            $(this).click(function () {
                var donation = $(this).attr("id");
                SELF.getUser(function (user) {
                    if (user === 401) {
                        layer.msg("只有登录用户才能打赏");
                        var index = layer.open({
                            title: '登陆',
                            type: 2,
                            area: ["1000px", "720px"],
                            content: "/login/login.html?redirect_url=/module/video/video-info.html?id=" + videoId
                        });
//                    layer.msg("只有登录用户才能评论");
//                    $("#self-comment").val("");
                    } else {
                        putVideoDonation(user.id, videoId, donation);
                    }
                });
            });
        });
        $("#reward").hover(function () {
            $(".mod-award-popWrap").attr("style", "display: block;");
        });

        $(".mod-award-popWrap").hover(function () {
            $(".mod-award-popWrap").attr("style", "display: block;");
        });

        $("#reward").mouseout(function () {
            $(".mod-award-popWrap").attr("style", "display: none;");
        });

        /* 点赞 */
        $("#video-laud").bind("click", function () {
            SELF.getUser(function (user) {
                if (user === 401) {
                    layer.msg("只有登录用户才能点赞");
                    var index = layer.open({
                        title: '登陆',
                        type: 2,
                        area: ["1000px", "720px"],
                        content: "/login/login.html?redirect_url=/module/video/video-info.html?id=" + videoId
                    });
                } else {
                    putLaud(user["id"], videoId, function () {
                        refreshLaud(videoId);
                    }, function (status) {
                        layer.msg("点赞失败");
                        refreshLaud(videoId);
                    });
                }
            });
        });
        /* 收藏*/
        $("#video-save").bind("click", function () {
            SELF.getUser(function (user) {
                var uId = user["id"];
                if (user === 401) {
                    layer.msg("请先登录");
                    var index = layer.open({
                        title: '登陆',
                        type: 2,
                        area: ["1000px", "720px"],
                        content: "/login/login.html?redirect_url=/module/video/video-info.html?id=" + videoId
                    });
//                    layer.msg("只有登录用户才能评论");
//                    $("#self-comment").val("");
                } else {
                    checkSave(videoId, uId, function (json) {
                        if (json) {
                            alert("视频已收藏");
                        } else {
                            loadVideo(videoId, function (video) {
                                var title = video["title"],
                                        image = video["thumbnail"];
                                postSave(title, image, videoId, uId);
                            });
                        }
                    });


                }

            });

        });
        /* 评分 */
//        SELF.getUser(function (user) {
//            if (user === 401) {
//                layer.msg("只有登录用户才能评分");
//                 
//                    layer.msg("只有登录用户才能评论");
//                    $("#self-comment").val("");
//                $("#star").raty({
//                    half: true,
//                    size: 24,
//                    starHalf: "star-half-big.png",
//                    starOff: "star-off-big.png",
//                    starOn: "star-on-big.png",
//
//                    click: function (score, evt) {}
//                });
//                $("#star").raty("readOnly", true)
//            } else {
//                $("#star").raty({
//                    half: true,
//                    size: 24,
//                    starHalf: "star-half-big.png",
//                    starOff: "star-off-big.png",
//                    starOn: "star-on-big.png",
//                    click: function (score, evt) {
//                        $("#star").raty("readOnly", true);
//                        var score = $("#star").raty('score') * 2;
//                        putScore(user["id"], videoId, score);
//
//                    }
//                });
//
//                getScore(user["id"], videoId);
//            }
//        });

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
            SELF.getUser(function (user) {
                if (user === 401) {
                    //saveDanmu(null,videoId, duringTime, text);
                } else {
                    saveDanmu(user["id"], videoId, duringTime, text);
                }
            });
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

    });
})(window, $, layer, SELF);