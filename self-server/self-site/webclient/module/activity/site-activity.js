(function (window, $, layer, SELF) {
    //定义全局变量存放查询参数
    var type = "", themes = [],
            laypage = undefined;
    loadActivity = function (offset, count, title, type, themes, pageNum) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        list = json["v1"],
                        len = list.length,
                        i = 0,
                        html = "",
                        total = json["v2"];
                for (; i < len; i++) {
                    var obj = list[i],
                            startTime = new Date(obj["start-time"]).toLocaleString(),
                            startTime1 = obj["start-time"],
                            now1 = Date.parse(new Date()),
                            endTime1 = obj["end-time"],
                            now = new Date(obj["start-time"]).toLocaleString(),
                            endTime = new Date(obj["end-time"]).toLocaleString(),
                            live = obj["live"];
                    if (live && now1 <= endTime1)
                    {
                        html += "<a  href='../video/live-detail.html?id=";
                        html += obj["id"];
                        html += "'><div class='layui-row layui-col-space30'>";
                        html += " <div class='layui-col-md6'><img src='";
                        html += obj["thumbnail"];
                        html += "'style='width: 100%; height: auto;' /></div>";
                        html += "<div class='layui-col-md6' style='margin: 3% 0px;'>";
                        html += " <p class='active-title'>";
                        html += obj["title"];
                        html += "</p>";
                        html += " <p class='active-times'><i class='layui-icon'>&#xe60e;</i>";
                        html += startTime;
                        html += "</p> <p class='active-address'><i class='layui-icon'>&#xe715;</i> ";
                        html += obj["place"];
                        html += "</p><p class='active-status'> 直播中</p></div> </div>";
                        html += "</a>";
                    } else {
                        html += "<a  href='site-activity-detail.html?id=";
                        html += obj["id"];
                        html += "'><div class='layui-row layui-col-space30'>";
                        html += " <div class='layui-col-md6'><img src='";
                        html += obj["thumbnail"];
                        html += "'style='width: 100%; height: auto;' /></div>";
                        html += "<div class='layui-col-md6' style='margin: 3% 0px;'>";
                        html += " <p class='active-title'>";
                        html += obj["title"];
                        html += "</p>";
                        html += " <p class='active-times'><i class='layui-icon'>&#xe60e;</i>";
                        html += startTime;
                        html += "</p> <p class='active-address'><i class='layui-icon'>&#xe715;</i> ";
                        html += obj["place"];
                          if (startTime1 > now1) {
                            html += "<p class='active-status'> 即将开始</p>";
                        } else if (startTime1 < now1 && now1 < endTime1) {
                            html += "<p class='active-status'> 活动中</p> ";
                        } else if (now1 > endTime1) {
                            html += "<p class='active-status'> 已结束</p> ";
                        }
                        html += "</p> </div> </div>";
                        html += "</a>";
                    }
                }
                $("#active-list").empty().append(html);
                laypage.render({
                    elem: "comment-pager",
                    limit: 4,
                    count: total,
                    curr: pageNum,
                    jump: function (obj, first) {
                        if (!first) {
                            loadActivity((obj.curr - 1) * obj.limit, obj.limit, "", type, themes, obj.curr);
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
        xhr.open("PUT", "/site/activity/search625?offset=" + offset + "&count=" + count);
        let objPrams = {
            "title": title,
            "type": {
                "id": type
            },
            "themes": themes
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, loadReport = function (offset, count, pageNum) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        list = json["v1"],
                        len = list.length,
                        i = 0,
                        html = "",
                        total = json["v2"];
                for (; i < len; i++) {
                    var obj = list[i],
                            time = new Date(obj["report-time"]).toLocaleString(),
                            name = obj["title"];
                    if (name.length > 10) {
                        name = name.substring(0, 15) + "...";
                    } else {
                        name = name;
                    }
                    html += " <li class='am-g am-list-item-dated'>";
                    html += "<a href='site-activity-report-detail.html?id=";
                    html += obj["id"];
                    html += "'> <i class='am-icon-play' style='margin-right: 4%;'></i>";
                    html += name;
                    html += "</a> <span class='am-list-date am-margin-right-lg am-list-item-text'>";
                    html += time;
                    html += "</span> </li> ";
                }
                $("#report-list1").empty().append(html);
           /*     laypage.render({
                    elem: "report-pager",
                    limit: 5,
                    count: total,
                    curr: pageNum,
                    jump: function (obj, first) {
                        if (!first) {
                            loadReport((obj.curr - 1) * obj.limit, obj.limit, obj.curr);
                        }
                    }
                });*/
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/activity-report?offset=" + offset + "&count=" + count);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadPublicity = function (offset, count, pageNum) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        list = json["v1"],
                        len = list.length,
                        i = 0,
                        html = "",
                        total = json["v2"];
                for (; i < len; i++) {
                    var obj = list[i],
                            time = new Date(obj["publish-date"]).toLocaleString(),
                            name = obj["activity-name"];
                    if (name.length > 10) {
                        name = name.substring(0, 15) + "...";
                    } else {
                        name = name;
                    }
                    html += " <li class='am-g am-list-item-dated'>";
                    html += "<a href='../../participation-bid-info.html?id=";
                    html += obj["id"];
                    html += "'> <i class='am-icon-play' style='margin-right: 4%;'></i>";
                    html += name;
                    html += "</a> <span class='am-list-date am-margin-right-lg am-list-item-text'>";
                    html += time;
                    html += "</span> </li> ";
                }
//                $("#publicity-list1").empty().append(html);
                /*laypage.render({
                    elem: "publicity-pager",
                    limit: 5,
                    count: total,
                    curr: pageNum,
                    jump: function (obj, first) {
                        if (!first) {
                            loadPublicity((obj.curr - 1) * obj.limit, obj.limit, obj.curr);
                        }
                    }
                });*/
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/publicity?offset=" + offset + "&count=" + count);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadType = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json1 = window.JSON.parse(xhr.response);
                processType(json1);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("PUT", "/site/activity-type?offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadTheme = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                processTheme(json);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/activity-theme?offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, processType = function (json1) {
        var i1 = 0,
                td1 = "<td>分 类：</td><td><a data-id='' select='false' href='javascript:;'>全部</a></td>";
        if (json1["v1"].length > 0) {
            for (; i1 < json1["v1"].length; i1++) {
                td1 += "<td><a  select='false' data-id=" + json1["v1"][i1].id + " href='javascript:;'>" + json1["v1"][i1].name + "</a></td>";
            }
        }
        $("#type").html(td1);
        $("#type td a").each(function () {
            $(this).mouseover(function () {
                $(this).css("color", "#FF920B");
            });
            $(this).mouseout(function () {
                $(this).css("color", "gray");
            });
            $(this).click(function () {
                //根据自定义select属性判定条件是否被选定,未选中为false,选中为true,页面加载时初始值为false
                var select = $(this).attr("select");
                if (select === "false") {
                    //选中条件后select为true
                    $(this).attr("select", "true");
                    $("#type td a").mouseover(function () {
                        $(this).css("color", "#FF920B");
                    });
                    $("#type td a").mouseout(function () {
                        $(this).css("color", "gray");
                    });
                    type = $(this).attr("data-id");
                    $("#type td a").css({"background": "#F5F5F5", "color": "gray"});
                    $(this).css({"background": "#FF920B", "color": "white"});
                    $(this).unbind("mouseover");
                    $(this).unbind("mouseout");
                    $("#active-list").empty();
                    loadActivity(0, 4, "", type, themes, 1);

                } else {
                    $(this).attr("select", "false");
                    $(this).css({"background": "#F5F5F5", "color": "gray"});
                    $(this).mouseover(function () {
                        $(this).css("color", "#FF920B");
                    });
                    $(this).mouseout(function () {
                        $(this).css("color", "gray");
                    });
                    type = "";
                    $("#active-list").empty();
                    loadActivity(0, 4, "", type, themes, 1);
                }

            });
        });
    }, processTheme = function (json) {
        var i = 0,
                td = "<td>主 题：</td><td><a select='false' data-id='0' href='javascript:;'>全部</a></td>";
        if (json["v1"].length > 0) {
            for (; i < json["v1"].length; i++) {
                td += "<td><a select='false' data-id=" + json["v1"][i].id + " href='javascript:;'>" + json["v1"][i].name + "</a></td>";
            }
        }
        $("#theme").html(td);

        $("#theme td a").each(function () {
            $(this).mouseover(function () {
                $(this).css("color", "#FF920B");
            });
            $(this).mouseout(function () {
                $(this).css("color", "gray");
            });
            $(this).click(function () {
                //根据自定义select属性判定条件是否被选定,未选中为false,选中为true,页面加载时初始值为false
                var select = $(this).attr("select");
                if (select === "false") {
                    //选中条件后select为true
                    $(this).attr("select", "true");
                    $("#theme td a").mouseover(function () {
                        $(this).css("color", "#FF920B");
                    });
                    $("#theme td a").mouseout(function () {
                        $(this).css("color", "gray");
                    });
                    var themeId = $(this).attr("data-id");
                    //alert("themes:"+themes+" album:"+album+" type:"+type);
                    var theme =
                            {
                                "id": themeId,
                                "name": ""
                            };
                    if (themeId === "0") {
                        $("#theme td a").css({"background": "#F5F5F5", "color": "gray"});
                        themes.splice(0, themes.length); //清空JSON数组
                        var m1 = $("#theme td a[data-id=0]");
                        m1.unbind("mouseover");
                        m1.unbind("mouseout");
                    } else {
                        $("#theme td a[data-id=0]").css({"background": "#F5F5F5", "color": "gray"});
                        var newLength = themes.push(theme);
                    }

                    $(this).css({"background": "#FF920B", "color": "white"});
                    /*                      for (var i = 0; i < themes.length; i++) {
                     var dataId = themes[i].id;
                     var m2 = $("#theme td a[data-id='" + dataId + "']");
                     m2.unbind("mouseover");
                     m2.unbind("mouseout");
                     }*/
                    //选中元素取消鼠标移入移出效果
                    var m2 = $("#theme td a[select='true']");
                    m2.unbind("mouseover");
                    m2.unbind("mouseout");
                    $("#active-list").empty();
                    loadActivity(0, 4, "", type, themes, 1);

                } else {
                    $(this).attr("select", "false");
                    $(this).css({"background": "#F5F5F5", "color": "gray"});
                    $(this).mouseover(function () {
                        $(this).css("color", "#FF920B");
                    });
                    $(this).mouseout(function () {
                        $(this).css("color", "gray");
                    });
                    var themeId = $(this).attr("data-id");
                    for (var i = 0; i < themes.length; i++) {
                        var dataId = themes[i].id;
                        if (dataId == themeId) {
                            themes.splice(i, 1);
                        }
                    }
                    //alert(JSON.stringify(themes));
                    $("#active-list").empty();
                    loadActivity(0, 4, "", type, themes, 1);
                }

            });
        });
    };
    $(document).ready(function () {
//        loadReport();
//        loadPublicity();
        loadType();
        loadTheme();
        /*加载活动列表*/
        layui.use(["laypage", "util"], function () {
            laypage = layui.laypage;
            loadActivity(0, // 初始从数据库第0条检索
                    4,
                    "", // 每页查5条
                    type,
                    themes, // 视频ID
                    1); // 初始是第一页
        });
//         layui.use(["laypage", "util"], function () {
//            laypage = layui.laypage;
//            loadActivity(0, // 初始从数据库第0条检索
//                    4,
//                    "放歌",// 每页查5条
//                    type,
//                    themes, // 视频ID
//                    1); // 初始是第一页
//        });
        /*加载报道列表*/
        layui.use(["laypage", "util"], function () {
            laypage = layui.laypage;
            loadReport(0, // 初始从数据库第0条检索
                    8, // 每页查5条
                    1); // 初始是第一页
        });
        /*加载self+公示列表*/
        layui.use(["laypage", "util"], function () {
            laypage = layui.laypage;
            loadPublicity(0, // 初始从数据库第0条检索
                    8, // 每页查5条
                    1); // 初始是第一页
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
})(window, $, layer, SELF);
