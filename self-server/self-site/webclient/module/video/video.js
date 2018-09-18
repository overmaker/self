(function (window, $, layer, SELF) {
//定义全局变量存放查询参数
    var type = "", album = "", age = "", themes = [],
            prams = GetRequest();
    loadVideo = function (title, type, album, themes, age, offset, count, pageNum) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json3 = window.JSON.parse(xhr.response);
                var i3 = 0,
                        tr = "",
                        videoTitle = "";
                outer:
                        for (; i3 < Math.ceil(json3["v1"].length / 1); i3++) {
                    tr += "<tr>";
                    for (var j3 = 0; j3 < 5; j3++) {
                        if (json3["v1"][i3 * 5 + j3] === undefined) {
                            switch (j3) {
                                case 1:
                                    tr += "<td></td><td></td><td></td><td></td><td></td>";
                                    break outer;
                                case 2:
                                    tr += "<td></td><td></td><td></td><td></td>";
                                    break outer;
                                case 3:
                                    tr += "<td></td><td></td><td></td>";
                                    break outer;
                                case 4:
                                    tr += "<td></td><td></td>";
                                    break outer;
                                default :
                                    tr += "<td></td>";
                                    break outer;
                            }
                        } else {

                            if (json3["v1"][i3 * 5 + j3].title.length > 23) {
                                videoTitle = json3["v1"][i3 * 5 + j3].title.substring(0, 27) + "...";
                            } else {
                                videoTitle = json3["v1"][i3 * 5 + j3].title;
                            }
//                            if (json3["v1"][i3 * 5 + j3].vip === true) {
//                                tr += "<td><a href='video-info.html?id=" + json3["v1"][i3 * 5 + j3].id + "'><image src='" + json3["v1"][i3 * 5 + j3].thumbnail + "'  class='video-image'/><p  class='p-video-p'><strong>&nbsp;" + videoTitle + "</strong></p><p style='float: right;'><image src='../../image/bf-loc.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["hits-num"] + "&nbsp;&nbsp;<image src='../../image/hz.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["likes-num"]  + "</p></div></p></a><img src='/image/vip.png' class='self-video-img' /></td>";
//                            } else {
                                tr += "<td><a href='video-info.html?id=" + json3["v1"][i3 * 5 + j3].id + "'><image src='" + json3["v1"][i3 * 5 + j3].thumbnail + "'  class='video-image'/><p  class='p-video-p'><strong>&nbsp;" + videoTitle + "</strong></p><p  style='float: right;'><image src='../../image/bf-loc.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["hits-num"] + "&nbsp;&nbsp;<image src='../../image/hz.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["likes-num"]+ "</p></div></p></a><br /><br /></td>";
//                            }
                        }
                    }
                    tr += "</tr>";

                }
                $("#table").html(tr);
                
                laypage.render({
                    elem: "video-pager",
                    limit: 10,
                    count: json3["v2"],
                    curr: pageNum,
                    jump: function (obj, first) {
                        if (!first) {
                            loadVideo(title, type, album, themes, age, (obj.curr - 1) * obj.limit, obj.limit, obj.curr);
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
        xhr.open("PUT", "/site/video/search");
        let objPrams = {
            "offset": offset,
            "count": count,
            "title": title,
            "type": {
                "id": type
            },
            "album": {
                "id": album
            },
            "themes": themes,
            "age": age
        };
        // alert("objPrams------" + JSON.stringify(objPrams));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, loadFeeVideo = function (offset, count, pageNum) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json3 = window.JSON.parse(xhr.response);
                var i3 = 0,
                        tr = "",
                        videoTitle = "";
                outer:
                        for (; i3 < Math.ceil(json3["v1"].length / 1); i3++) {
                    tr += "<tr>";
                    for (var j3 = 0; j3 < 5; j3++) {
                        if (json3["v1"][i3 * 5 + j3] === undefined) {
                            switch (j3) {
                                case 1:
                                    tr += "<td></td><td></td><td></td><td></td><td></td>";
                                    break outer;
                                case 2:
                                    tr += "<td></td><td></td><td></td><td></td>";
                                    break outer;
                                case 3:
                                    tr += "<td></td><td></td><td></td>";
                                    break outer;
                                case 4:
                                    tr += "<td></td><td></td>";
                                    break outer;
                                default :
                                    tr += "<td></td>";
                                    break outer;
                            }
                        } else {

                            if (json3["v1"][i3 * 5 + j3].title.length > 23) {
                                videoTitle = json3["v1"][i3 * 5 + j3].title.substring(0, 27) + "...";
                            } else {
                                videoTitle = json3["v1"][i3 * 5 + j3].title;
                            }
                            if (json3["v1"][i3 * 5 + j3].vip === true) {
                                tr += "<td><a href='video-info.html?id=" + json3["v1"][i3 * 5 + j3].id + "'><image src='" + json3["v1"][i3 * 5 + j3].thumbnail + "'  class='video-image'/><p  class='p-video-p'><strong>&nbsp;" + videoTitle + "</strong></p><p style='float: right;'><image src='../../image/bf-loc.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["hits-num"] + "&nbsp;&nbsp;<image src='../../image/hz.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["likes-num"] + "&nbsp;&nbsp;</div></p></a><img src='/image/vip.png' class='self-video-img' /></td>";
                            } else {
                                tr += "<td><a href='video-info.html?id=" + json3["v1"][i3 * 5 + j3].id + "'><image src='" + json3["v1"][i3 * 5 + j3].thumbnail + "'  class='video-image'/><p  class='p-video-p'><strong>&nbsp;" + videoTitle + "</strong></p><p  style='float: right;'><image src='../../image/bf-loc.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["hits-num"] + "&nbsp;&nbsp;<image src='../../image/hz.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["likes-num"] + "&nbsp;&nbsp;</div></p></a><br /><br /></td>";
                            }
                        }
                    }
                    tr += "</tr>";
                }
                $("#table").html(tr);
                
                laypage.render({
                    elem: "video-pager",
                    limit: 10,
                    count: json3["v2"],
                    curr: pageNum,
                    jump: function (obj, first) {
                        if (!first) {
                            loadFeeVideo((obj.curr - 1) * obj.limit, obj.limit, obj.curr);
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
        xhr.open("GET", "/site/video/fee?offset=" + offset + "&count=" + count);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadTimeVideo = function (offset, count, pageNum) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json3 = window.JSON.parse(xhr.response);
                var i3 = 0,
                        tr = "",
                        videoTitle = "";
                outer:
                        for (; i3 < Math.ceil(json3["v1"].length / 1); i3++) {
                    tr += "<tr>";
                    for (var j3 = 0; j3 < 5; j3++) {
                        if (json3["v1"][i3 * 5 + j3] === undefined) {
                            switch (j3) {
                                case 1:
                                    tr += "<td></td><td></td><td></td><td></td><td></td>";
                                    break outer;
                                case 2:
                                    tr += "<td></td><td></td><td></td><td></td>";
                                    break outer;
                                case 3:
                                    tr += "<td></td><td></td><td></td>";
                                    break outer;
                                case 4:
                                    tr += "<td></td><td></td>";
                                    break outer;
                                default :
                                    tr += "<td></td>";
                                    break outer;
                            }
                        } else {

                            if (json3["v1"][i3 * 5 + j3].title.length > 23) {
                                videoTitle = json3["v1"][i3 * 5 + j3].title.substring(0, 27) + "...";
                            } else {
                                videoTitle = json3["v1"][i3 * 5 + j3].title;
                            }
                            if (json3["v1"][i3 * 5 + j3].vip === true) {
                                tr += "<td><a href='video-info.html?id=" + json3["v1"][i3 * 5 + j3].id + "'><image src='" + json3["v1"][i3 * 5 + j3].thumbnail + "'  class='video-image'/><p  class='p-video-p'><strong>&nbsp;" + videoTitle + "</strong></p><p style='float: right;'><image src='../../image/bf-loc.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["hits-num"] + "&nbsp;&nbsp;<image src='../../image/hz.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["likes-num"] + "&nbsp;&nbsp;</div></p></a><img src='/image/vip.png' class='self-video-img' /></td>";
                            } else {
                                tr += "<td><a href='video-info.html?id=" + json3["v1"][i3 * 5 + j3].id + "'><image src='" + json3["v1"][i3 * 5 + j3].thumbnail + "'  class='video-image'/><p  class='p-video-p'><strong>&nbsp;" + videoTitle + "</strong></p><p  style='float: right;'><image src='../../image/bf-loc.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["hits-num"] + "&nbsp;&nbsp;<image src='../../image/hz.png' class='ff-items-p-image' >&nbsp;" + json3["v1"][i3 * 5 + j3]["likes-num"] + "&nbsp;&nbsp;</div></p></a><br /><br /></td>";
                            }
                        }
                    }
                    tr += "</tr>";
                }
                $("#table").html(tr);
                
                laypage.render({
                    elem: "video-pager",
                    limit: 10,
                    count: json3["v2"],
                    curr: pageNum,
                    jump: function (obj, first) {
                        if (!first) {
                            loadTimeVideo((obj.curr - 1) * obj.limit, obj.limit, obj.curr);
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
        xhr.open("GET", "/site/video/time?offset=" + offset + "&count=" + count);
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
        xhr.open("GET", "/site/video-theme?offset=0&count=10000");
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
        xhr.open("GET", "/site/video-type?offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadAlbum = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json2 = window.JSON.parse(xhr.response);
//                processAlbum(json2);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/video-album?offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    },
    processTheme = function (json) {
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
                            layui.use(["laypage", "util"], function () {
                                laypage = layui.laypage;
                                loadVideo("", type, album, themes, age, 0, 10, 1);
                            });

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
                            layui.use(["laypage", "util"], function () {
                                laypage = layui.laypage;
                                loadVideo("", type, album, themes, age, 0, 10, 1);
                            });
                        }

                    });
                });

                if (prams.id != undefined) {
                    var m3 = $("#theme td a[data-id='" + prams.id + "']");
                    m3.css({"background": "#FF920B", "color": "white"});
                    m3.unbind("mouseover");
                    m3.unbind("mouseout");
                }
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
                    layui.use(["laypage", "util"], function () {
                        laypage = layui.laypage;
                        loadVideo("", type, album, themes, age, 0, 10, 1);
                    });

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
                    layui.use(["laypage", "util"], function () {
                        laypage = layui.laypage;
                        loadVideo("", type, album, themes, age, 0, 10, 1);
                    });
                }

            });
        });

        if (prams.type != undefined) {
            var m3 = $("#type td a[data-id='" + prams.type + "']");
            m3.css({"background": "#FF920B", "color": "white"});
            m3.unbind("mouseover");
            m3.unbind("mouseout");
        }
    }, 
//    searchByTitle = function () {
//        $("#title-searchbox").click(function () {
//            var title = $("#title-searchtext").val();
//            window.location.href="../fSearch.html?value="+title;
//            layui.use(["laypage", "util"], function () {
//                laypage = layui.laypage;
//                loadVideo(title, "", "", themes[""], "", 0, 10, 1);
//            });
//        });
//    },
    processAge = function (arryAge) {
        var arryAge = new Array();
        arryAge[0] = {
            "id": 0,
            "name": "4-10岁"
        };
        arryAge[1] = {
            "id": 1,
            "name": "10-18岁"
        };
        arryAge[2] = {
            "id": 2,
            "name": "18-25岁"
        };
        arryAge[3] = {
            "id": 3,
            "name": "25-40岁"
        };
        arryAge[4] = {
            "id": 4,
            "name": "40岁以上"
        };
        var i1 = 0,
                td4 = "<td>适合人群：</td><td><a select='false' data-id='' href='javascript:;'>全部</a></td>";
        if (arryAge.length > 0) {
            for (; i1 < arryAge.length; i1++) {
                td4 += "<td><a select='false' data-id=" + arryAge[i1].id + " href='javascript:;'>" + arryAge[i1].name + "</a></td>";
            }
        }

        $("#age").html(td4);
        $("#age td a").each(function () {
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
                    $("#age td a").mouseover(function () {
                        $(this).css("color", "#FF920B");
                    });
                    $("#age td a").mouseout(function () {
                        $(this).css("color", "gray");
                    });
                    age = $(this).attr("data-id");
                    $("#age td a").css({"background": "#F5F5F5", "color": "gray"});
                    $(this).css({"background": "#FF920B", "color": "white"});
                    $(this).unbind("mouseover");
                    $(this).unbind("mouseout");
                    layui.use(["laypage", "util"], function () {
                        laypage = layui.laypage;
                        loadVideo("", type, "", themes, age, 0, 10, 1);
                    });

                } else {
                    $(this).attr("select", "false");
                    $(this).css({"background": "#F5F5F5", "color": "gray"});
                    $(this).mouseover(function () {
                        $(this).css("color", "#FF920B");
                    });
                    $(this).mouseout(function () {
                        $(this).css("color", "gray");
                    });
                    age = "";
                    layui.use(["laypage", "util"], function () {
                        laypage = layui.laypage;
                        loadVideo("", type, "", themes, age, 0, 10, 1);
                    });
                }

            });
        });
    },
  /*  processAlbum = function (json2) {
        var i2 = 0,
                td2 = "<td>专 辑：</td><td><a select='false' data-id='' href='javascript:;'>全部</a></td>";
        if (json2["v1"].length > 0) {
            for (; i2 < json2["v1"].length; i2++) {
                td2 += "<td><a select='false' data-id=" + json2["v1"][i2].id + " href='javascript:;'>" + json2["v1"][i2].name + "</a></td>";
            }
        }

        $("#album").html(td2);
        $("#album td a").each(function () {
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
                    $("#album td a").mouseover(function () {
                        $(this).css("color", "#FF920B");
                    });
                    $("#album td a").mouseout(function () {
                        $(this).css("color", "gray");
                    });
                    album = $(this).attr("data-id");
                    //alert("themes:"+themes+" album:"+album+" type:"+type);
                    $("#album td a").css({"background": "#F5F5F5", "color": "gray"});
                    $(this).css({"background": "#FF920B", "color": "white"});
                    $(this).unbind("mouseover");
                    $(this).unbind("mouseout");
                    loadVideo("", type, album, themes, age);

                } else {
                    $(this).attr("select", "false");
                    $(this).css({"background": "#F5F5F5", "color": "gray"});
                    $(this).mouseover(function () {
                        $(this).css("color", "#FF920B");
                    });
                    $(this).mouseout(function () {
                        $(this).css("color", "gray");
                    });
                    album = "";
                    loadVideo("", type, album, themes, age);
                }

            });
        });
    };*/
    laypage = undefined;
    $(document).ready(function () {
        var name = Number(prams);
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
        var dataType = prams.type,
                dataId = prams.id,
                type = "",
                themes = [];
        if (dataType != undefined) {
            type = dataType;
            layui.use(["laypage", "util"], function () {
                laypage = layui.laypage;
                loadVideo("", type, "", themes, "", 0, 10, 1);
            });
        } else if (dataId != undefined) {
            var theme =
                    {
                        "id": dataId,
                        "name": ""
                    };
            themes.push(theme);
            layui.use(["laypage", "util"], function () {
                laypage = layui.laypage;
                loadVideo("", type, "", themes, "", 0, 10, 1);
            });
        } else {
            layui.use(["laypage", "util"], function () {
                laypage = layui.laypage;
                loadVideo("", type, "", themes, "", 0, 10, 1);
            });
        }
        loadAlbum();
        processAge();
        loadTheme();
        loadType();
//        searchByTitle();
       $("#zuixin").click(function(){
            layui.use(["laypage", "util"], function () {
                laypage = layui.laypage;
                loadTimeVideo(0, 10, 1);
            });
       });
       $("#zuire").click(function(){
            layui.use(["laypage", "util"], function () {
                laypage = layui.laypage;
                loadFeeVideo(0, 10, 1);
            });
       });

        //回车检索
//        $("#title-searchtext").keyup(function (e) {
//            if (e.keyCode === 13) {
//                $("#title-searchbox").click();
//            }
//        });
    });
    //找到跳转URL里带过来的参数
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") !== -1) {
            var str = url.substr(1),
                    strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
})(window, $, layer, SELF);
