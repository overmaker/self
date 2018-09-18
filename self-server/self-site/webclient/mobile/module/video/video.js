(function (window, $, SELF) {
    var type = 0,
            album = 0,
            age = 0,
            themes = [],
            arryAge = [
                {
                    "id": 0,
                    "name": "4-10岁"
                }, {
                    "id": 1,
                    "name": "10-18岁"
                }, {
                    "id": 2,
                    "name": "18-25岁"
                }, {
                    "id": 3,
                    "name": "25-40岁"
                }, {
                    "id": 4,
                    "name": "40岁以上"
                }
            ];

    var initUI = function () {
        $("#video-list ul").bind("click", function (event) {
            var target = $(event.target),
                    videoId = target.attr("data-video-id");
            while (!target.is("article") && videoId === undefined) {
                target = target.parent();
                videoId = target.attr("data-video-id");
            }
            if (videoId) {
                SELF.publish("show-video-detail", videoId);
            }
        });

//        $("#video-type-list").bind("click", function (event) {
//            var target = $(event.target),
//                    type = target.attr("data-id");
//            if (target.is("a")) {
//                type = parseInt(type);
//                if (currentType !== type) {
//                    currentType = type;
//                    currentOffset = 0;
//                    $("#video-list > ul").empty();
//                    $("#self-video-more").show();
//                    $("#self-video-none").hide();
//                    loadVideo(0, pageCount, "", "", "", [], "", false, false);
//                }
//            }
//
//        });

        $("#video-list").pullToRefresh(function () {
            currentOffset = 0;
            loadStatus = "ready";
            $("#video-list > ul").empty();
            $("#self-video-more").show();
            $("#self-video-none").hide();
            loadVideo(0, pageCount, "", "", "", [], "", false, false);
        });

        var listHeight = $("#video-list").height();
        $("#video-list").bind("scroll", function () {
            var top = $("#video-list").scrollTop();
            var height = $("#video-list").scrollHeight();
            if (Math.abs(height - top) <= (listHeight + 20)) {
                if (loadStatus === "ready") {
                    loadVideo(currentOffset, pageCount, "", "", "", [], "", false, false);
                }
            }
        });

        loadType(true, true);
        loadAlbum(true, true);
        loadTheme(true, true);
        processAge(arryAge, true, true);

        //MUI 导航JS
        var toggleMenu = function () {
            if (busying) {
                return;
            }
            busying = true;
            if (menuWrapperClassList.contains('mui-active')) {
                document.body.classList.remove('menu-open');
                menuWrapper.className = 'menu-wrapper fade-out-up';
                menu.className = 'menu bounce-out-up';
                backdrop.style.opacity = 0;
                menuWrapper.classList.add('hidden');
            } else {
                document.body.classList.add('menu-open');
                menuWrapper.className = 'menu-wrapper fade-in-down mui-active';
                menu.className = 'menu bounce-in-down';
                backdrop.style.opacity = 1;
            }
            busying = false;
        };

        mui.init({
            swipeBack: true //启用右滑关闭功能
        });
        var menuWrapper = document.getElementById("menu-wrapper");
        var menu = document.getElementById("menu");
        var menuWrapperClassList = menuWrapper.classList;
        var backdrop = document.getElementById("menu-backdrop");
        var info = document.getElementById("info");

        backdrop.addEventListener('tap', toggleMenu);
        document.getElementById("icon-menu").addEventListener('tap', toggleMenu);
        //下沉菜单中的点击事件
        mui('#menu').on('tap', 'a', function () {
            toggleMenu();
            //    info.innerHTML = '你已选择：' + this.innerHTML;
        });
        var busying = false;

    },
            destroyUI = function () {
                currentOffset = 0;
//                currentType = -1;
                loadStatus = "ready";
                $("#video-list ul").unbind("click");
//                $("#video-type-list").unbind("click");
                $("#video-list").unbind("scroll");
                $("#video-list").pullToRefreshDone();
            }, requestVideo = function (offset, count, title, type, album, themes, age, readCache, writeCache, success, fail) {
        var uri = "/site/video/search",
                response = null;
        if (readCache) {
            response = window.sessionStorage.getItem(uri);
        }
        if (response && response !== null) {
            success(response);
        }
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                if (writeCache) {
                    window.sessionStorage.setItem(uri, xhr.response);
                }
                success(xhr.response);
            } else {
                fail(xhr.status);
            }
        };
        xhr.onerror = function () {
            fail("error");
        };
        xhr.open("PUT", uri);
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
        
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, loadVideo = function (offset, count, title, type, album, themes, age, readCache, writeCache) {
        loadStatus = "loading";
        requestVideo(offset, count, title, type, album, themes, age, readCache, writeCache, function (response) {
            var json = window.JSON.parse(response),
                    list = json["v1"],
                    total = json["v2"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
            for (; i < length; i++) {
                obj = list[i];
                if (obj["enable"] === true) {
                    if (obj["title"].length > 10) {
                                videoTitle = obj["title"].substring(0, 10) + "...";
                            } else {
                                videoTitle = obj["title"]
                            }
                    html += "<li class='mui-table-view-cell mui-media mui-col-xs-6' data-video-id='" + obj["id"] + "'>";
                    html += "<a href='javascript:;'>";
                    html += "<img class='mui-media-object' src='" + obj["thumbnail"] + "' />";
                    if (obj["vip"] === true) {
                        html += "<img src='module/video/images/vip.png' class='vip' />";
                    }
                    html +="<div style='line-height: 1.5em;margin-top: 3%;'><p style='color: black;text-align: left;'>杨国伟</p>";
                    html += "<div class='aui-text-warning' style='font-size: 75%;text-align: left;'>" + videoTitle + "</div>";
                    html += "</div></a>";
                    html += "</li>";
                }
            }
            $("#video-list > ul").append(html);

            if (length < count || (offset + length) >= total) {
                loadStatus = "end";
                $("#video-list").pullToRefreshDone();
                $("#self-video-more").hide();
                $("#self-video-none").show();
            } else {
                loadStatus = "ready";
                $("#video-list").pullToRefreshDone();
            }

            currentOffset += length;

        }, function (status) {
            loadStatus = "ready";
            $("#video-list").pullToRefreshDone();
            SELF.errorHandler(status);
        });
    }, requestTheme = function (readCache, writeCache, success, fail) {
        var uri = "/site/video-theme?offset=0&count=100",
                response = null;
        if (readCache) {
            response = window.sessionStorage.getItem(uri);
        }
        if (response && response !== null) {
            success(response);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function () {
                fail("error");
            };
            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (writeCache) {
                        window.sessionStorage.setItem(uri, xhr.response);
                    }
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        }
    }, requestType = function (readCache, writeCache, success, fail) {
        var uri = "/site/video-type?offset=0&count=100",
                response = null;
        if (readCache) {
            response = window.sessionStorage.getItem(uri);
        }
        if (response && response !== null) {
            success(response);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function () {
                fail("error");
            };
            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (writeCache) {
                        window.sessionStorage.setItem(uri, xhr.response);
                    }
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        }
    }, requestAlbum = function (readCache, writeCache, success, fail) {
        var uri = "/site/video-album?offset=0&count=100",
                response = null;
        if (readCache) {
            response = window.sessionStorage.getItem(uri);
        }
        if (response && response !== null) {
            success(response);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function () {
                fail("error");
            };
            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (writeCache) {
                        window.sessionStorage.setItem(uri, xhr.response);
                    }
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        }
    }, loadType = function (readCache, writeCache) {
        requestType(readCache, writeCache, function (response) {
            var json = window.JSON.parse(response),
                    i = 0,
                    td = "<td>分类：</td><td><a select='false' data-id='0' href='javascript:;'>全部</a></td>";
            if (json["v1"].length > 0) {
                for (; i < json["v1"].length; i++) {
                    td += "<td><a select='false' data-id=" + json["v1"][i].id + " href='javascript:;'>" + json["v1"][i].name + "</a></td>";
                }
            }

            $("#type").html(td);
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
                        $("#video-list > ul").empty();
                        loadVideo(0, pageCount, "", type, "", [], "", false, false);

                    } else {
                        $(this).attr("select", "false");
                        $(this).css({"background": "#F5F5F5", "color": "gray"});
                        $(this).mouseover(function () {
                            $(this).css("color", "#FF920B");
                        });
                        $(this).mouseout(function () {
                            $(this).css("color", "gray");
                        });
                        type = 0;
                        $("#video-list > ul").empty();
                        loadVideo(0, pageCount, type, "", "", [], "", false, false);
                    }

                });
            });
        }, function (status) {
            SELF.errorHandler(status);
        });
    }, loadAlbum = function (readCache, writeCache) {
        requestAlbum(readCache, writeCache, function (response) {
            var json = window.JSON.parse(response),
                    i = 0,
                    td = "<td>专 辑：</td><td><a select='false' data-id='0' href='javascript:;'>全部</a></td>";
            if (json["v1"].length > 0) {
                for (; i < json["v1"].length; i++) {
                    td += "<td><a select='false' data-id=" + json["v1"][i].id + " href='javascript:;'>" + json["v1"][i].name + "</a></td>";
                }
            }

            $("#album").html(td);
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
                        $("#album td a").css({"background": "#F5F5F5", "color": "gray"});
                        $(this).css({"background": "#FF920B", "color": "white"});
                        $(this).unbind("mouseover");
                        $(this).unbind("mouseout");
                        $("#video-list > ul").empty();
                        loadVideo(0, "", "", "", album, [], "", false, false);

                    } else {
                        $(this).attr("select", "false");
                        $(this).css({"background": "#F5F5F5", "color": "gray"});
                        $(this).mouseover(function () {
                            $(this).css("color", "#FF920B");
                        });
                        $(this).mouseout(function () {
                            $(this).css("color", "gray");
                        });
                        type = 0;
                        $("#video-list > ul").empty();
                        loadVideo(0, pageCount, type, "", "", [], "", false, false);
                    }

                });
            });
        }, function (status) {
            SELF.errorHandler(status);
        });
    }, loadTheme = function (readCache, writeCache) {
        requestTheme(readCache, writeCache, function (response) {
            var json = window.JSON.parse(response),
                    i = 0,
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
                        $("#video-list > ul").empty();
                        loadVideo(0, pageCount, "", "", "", themes, "", false, false);
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
                        $("#video-list > ul").empty();
                        loadVideo(0, pageCount, "", "", "", themes, "", false, false);
                    }

                });
            });
        }, function (status) {
            SELF.errorHandler(status);
        });
    },
            processAge = function (arryAge) {
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
                            $("#video-list > ul").empty();
                            loadVideo(0, pageCount, "", "", "", [], age, false, false);

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
                            $("#video-list > ul").empty();
                            loadVideo(0, pageCount, "", "", "", [], age, false, false);
                        }

                    });
                });
            },
            pageCount = 10,
            currentOffset = 0,
//            currentType = -1,
            loadStatus = "ready";
    SELF.subscribe("unload-video", function () {
        destroyUI();
        $("body > article").empty();
    })("load-video", function (param) {
        SELF.loadHtml("module/video/video.html", function (html) {
            $("body > article").empty().html(html);
            initUI();
            if (param) {
                var theme = [
                    {
                        "id": param["theme-id"]
                    }];
                loadVideo(0, pageCount, "", "", "", theme, "", false, false);
            } else {
                loadVideo(0, pageCount, "", "", "", [], "", false, false);
            }
        });
    });

})(window, $, SELF);