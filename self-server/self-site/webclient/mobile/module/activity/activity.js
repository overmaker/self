(function(window, $, SELF) {
    var type = 0,
        themes = [],
        pageCount = 10,
        currentOffset = 0,
        loadStatus = "ready";

    var initUI = function() {
            $("#activity-list ul").click(function(event) {
                var target = $(event.target),
                    activityId = target.attr("data-activity-id"),
                    live = target.attr("data-activity-live");
                while(!target.is("article") && activityId === undefined) {
                    target = target.parent();
                    activityId = target.attr("data-activity-id");
                    live = target.attr("data-activity-live");
                }
                if(live === "true") {
                    SELF.publish("show-live-detail", activityId);
                } else {
                    SELF.publish("show-activity-detail", activityId);
                }
            });
            $("#activity-list").pullToRefresh(function() {
                currentOffset = 0;
                loadStatus = "ready";
                $("#activity-list > ul").empty();
                $("#self-activity-more").show();
                $("#self-activity-none").hide();
                loadActivity(0, pageCount, "", "", [], false, false);
            });

            var listHeight = $("#activity-list").height();
            $("#activity-list").bind("scroll", function() {
                var top = $("#activity-list").scrollTop();
                var height = $("#activity-list").scrollHeight();
                if(Math.abs(height - top) <= (listHeight + 20)) {
                    if(loadStatus === "ready") {
                        loadActivity(currentOffset, pageCount, "", "", [], false, false);
                    }
                }
            });
            $("#report-list").pullToRefresh(function() {
                currentOffset = 0;
                loadStatus = "ready";
                $("#report-list > ul").empty();
                $("#self-report-more").show();
                $("#self-report-none").hide();
                loadReport(0, pageCount, true, true);
            });

            var listHeight1 = $("#report-list").height();
            $("#report-list").bind("scroll", function() {
                var top1 = $("#report-list").scrollTop();
                var height1 = $("#report-list").scrollHeight();
                if(Math.abs(height1 - top1) <= (listHeight1 + 20)) {
                    if(loadStatus === "ready") {
                        loadReport(0, pageCount, true, true);
                    }
                }
            });
            $("#selfPlus-list").pullToRefresh(function() {
                currentOffset = 0;
                loadStatus = "ready";
                $("#selfPlus-list > ul").empty();
                $("#self-selfPlus-more").show();
                $("#self-selfPlus-none").hide();
                loadPublicity(0, pageCount, true, true);
            });

            var listHeight2 = $("#selfPlus-list").height();
            $("#selfPlus-list").bind("scroll", function() {
                var top2 = $("#selfPlus-list").scrollTop();
                var height2 = $("#selfPlus-list").scrollHeight();
                if(Math.abs(height2 - top2) <= (listHeight2 + 20)) {
                    if(loadStatus === "ready") {
                        loadPublicity(0, pageCount, true, true);
                    }
                }
            });
            loadActivity(0, pageCount, "", "", [], false, false);
            loadType(true, true);
            loadTheme(true, true);
            loadReport(0, pageCount, true, true);
            loadPublicity(0, pageCount, true, true);
            //MUI 导航JS
//          mui.init({
//              swipeBack: true //启用右滑关闭功能
//          });
//          var menuWrapper = document.getElementById("menu-wrapper");
//          var menu = document.getElementById("menu");
//          var menuWrapperClassList = menuWrapper.classList;
//          var backdrop = document.getElementById("menu-backdrop");
//          var info = document.getElementById("info");
//
//          backdrop.addEventListener('tap', toggleMenu);
//          document.getElementById("icon-menu").addEventListener('tap', toggleMenu);
//          //下沉菜单中的点击事件
//          mui('#menu').on('tap', 'a', function() {
//              toggleMenu();
//          });
//          var busying = false;
//
//          function toggleMenu() {
//              if(busying) {
//                  return;
//              }
//              busying = true;
//              if(menuWrapperClassList.contains('mui-active')) {
//                  document.body.classList.remove('menu-open');
//                  menuWrapper.className = 'menu-wrapper fade-out-up animated';
//                  menu.className = 'menu bounce-out-up animated';
//                  setTimeout(function() {
//                      backdrop.style.opacity = 0;
//                      menuWrapper.classList.add('hidden');
//                  });
//              } else {
//                  document.body.classList.add('menu-open');
//                  menuWrapper.className = 'menu-wrapper fade-in-down animated mui-active';
//                  menu.className = 'menu bounce-in-down animated';
//                  backdrop.style.opacity = 1;
//              }
//              setTimeout(function() {
//                  busying = false;
//              });
//          }
            //tab 切换
//          layui.use('element', function() {
//              var element = layui.element;
//          });
            //MUI点击事件结束

        },
        /*活动分类*/
        requestType = function(readCache, writeCache, success, fail) {
            var uri = "/site/activity-type?offset=0&count=10000",
                response = null;
            if(readCache) {
                response = window.sessionStorage.getItem(uri);
            }
            if(response && response !== null) {
                success(response);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function() {
                    fail("error");
                };
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        if(writeCache) {
                            window.sessionStorage.setItem(uri, xhr.response);
                        }
                        success(xhr.response);
                    } else {
                        fail(xhr.status);
                    }
                };
                xhr.open("PUT", uri);
                xhr.send();
            }
        },
        loadType = function(readCache, writeCache) {
            requestType(readCache, writeCache, function(response) {
                var json = window.JSON.parse(response),
                    i = 0,
                    td = "<td>分类：</td><td><a select='false' data-id='0' href='javascript:;'>全部</a></td>";
                if(json["v1"].length > 0) {
                    for(; i < json["v1"].length; i++) {
                        td += "<td><a select='false' data-id=" + json["v1"][i].id + " href='javascript:;'>" + json["v1"][i].name + "</a></td>";
                    }
                }

                $("#type").html(td);
                $("#type td a").each(function() {
                    $(this).mouseover(function() {
                        $(this).css("color", "#FF920B");
                    });
                    $(this).mouseout(function() {
                        $(this).css("color", "gray");
                    });
                    $(this).click(function() {
                        //根据自定义select属性判定条件是否被选定,未选中为false,选中为true,页面加载时初始值为false
                        var select = $(this).attr("select");
                        if(select === "false") {
                            //选中条件后select为true
                            $(this).attr("select", "true");
                            $("#type td a").mouseover(function() {
                                $(this).css("color", "#FF920B");
                            });
                            $("#type td a").mouseout(function() {
                                $(this).css("color", "gray");
                            });
                            type = $(this).attr("data-id");
                            $("#type td a").css({ "background": "#F5F5F5", "color": "gray" });
                            $(this).css({ "background": "#FF920B", "color": "white" });
                            $(this).unbind("mouseover");
                            $(this).unbind("mouseout");
                            $("#activity-list > ul").empty();
                            loadActivity(0, pageCount, "", type, [], false, false);

                        } else {
                            $(this).attr("select", "false");
                            $(this).css({ "background": "#F5F5F5", "color": "gray" });
                            $(this).mouseover(function() {
                                $(this).css("color", "#FF920B");
                            });
                            $(this).mouseout(function() {
                                $(this).css("color", "gray");
                            });
                            type = 0;
                            $("#activity-list > ul").empty();
                            loadActivity(0, pageCount, "", type, [], false, false);
                        }

                    });
                });
            }, function(status) {
                SELF.errorHandler(status);
            });
        },
        /*活动主题*/
        requestTheme = function(readCache, writeCache, success, fail) {
            var uri = "/site/activity-theme?offset=0&count=10000",
                response = null;
            if(readCache) {
                response = window.sessionStorage.getItem(uri);
            }
            if(response && response !== null) {
                success(response);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function() {
                    fail("error");
                };
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        if(writeCache) {
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
        },
        loadTheme = function(readCache, writeCache) {
            requestTheme(readCache, writeCache, function(response) {
                var json = window.JSON.parse(response),
                    i = 0,
                    td = "<td>主 题：</td><td><a select='false' data-id='0' href='javascript:;'>全部</a></td>";
                if(json["v1"].length > 0) {
                    for(; i < json["v1"].length; i++) {
                        td += "<td><a select='false' data-id=" + json["v1"][i].id + " href='javascript:;'>" + json["v1"][i].name + "</a></td>";
                    }
                }
                $("#theme").html(td);
                $("#theme td a").each(function() {
                    $(this).mouseover(function() {
                        $(this).css("color", "#FF920B");
                    });
                    $(this).mouseout(function() {
                        $(this).css("color", "gray");
                    });
                    $(this).click(function() {
                        //根据自定义select属性判定条件是否被选定,未选中为false,选中为true,页面加载时初始值为false
                        var select = $(this).attr("select");
                        if(select === "false") {
                            //选中条件后select为true
                            $(this).attr("select", "true");
                            $("#theme td a").mouseover(function() {
                                $(this).css("color", "#FF920B");
                            });
                            $("#theme td a").mouseout(function() {
                                $(this).css("color", "gray");
                            });
                            var themeId = $(this).attr("data-id");
                            var theme = {
                                "id": themeId,
                                "name": ""
                            };
                            if(themeId === "0") {
                                $("#theme td a").css({ "background": "#F5F5F5", "color": "gray" });
                                themes.splice(0, themes.length); //清空JSON数组
                                var m1 = $("#theme td a[data-id=0]");
                                m1.unbind("mouseover");
                                m1.unbind("mouseout");
                            } else {
                                $("#theme td a[data-id=0]").css({ "background": "#F5F5F5", "color": "gray" });
                                var newLength = themes.push(theme);
                            }

                            $(this).css({ "background": "#FF920B", "color": "white" });
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
                            $("#activity-list > ul").empty();
                            loadActivity(0, pageCount, "", "", themes, false, false);
                        } else {
                            $(this).attr("select", "false");
                            $(this).css({ "background": "#F5F5F5", "color": "gray" });
                            $(this).mouseover(function() {
                                $(this).css("color", "#FF920B");
                            });
                            $(this).mouseout(function() {
                                $(this).css("color", "gray");
                            });
                            var themeId = $(this).attr("data-id");
                            for(var i = 0; i < themes.length; i++) {
                                var dataId = themes[i].id;
                                if(dataId == themeId) {
                                    themes.splice(i, 1);
                                }
                            }
                            $("#activity-list > ul").empty();
                            loadActivity(0, pageCount, "", "", themes, false, false);
                        }

                    });
                });
            }, function(status) {
                SELF.errorHandler(status);
            });
        },
        /*全部活动*/
        requestActivity = function(offset, count, title, type, themes, readCache, writeCache, success, fail) {
            var uri = "/site/activity/search625?offset=" + offset + "&count=" + count,
                response = null;
            if(readCache) {
                response = window.sessionStorage.getItem(uri);
            }
            if(response && response !== null) {
                success(response);
            }
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onload = function() {
                if(xhr.status === 200) {
                    if(writeCache) {
                        window.sessionStorage.setItem(uri, xhr.response);
                    }
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.onerror = function() {
                fail("error");
            };
            xhr.open("PUT", uri);
            let objPrams = {
                "title": title,
                "type": {
                    "id": type
                },
                "themes": themes
            }
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(objPrams));
        },
        loadActivity = function(offset, count, title, type, themes, readCache, writeCache) {
            loadStatus = "loading";
            requestActivity(offset, count, title, type, themes, readCache, writeCache, function(response) {
                var json = window.JSON.parse(response),
                    list = json["v1"],
                    total = json["v2"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
                for(; i < length; i++) {
                    obj = list[i];
                    var startTime = new Date(obj["start-time"]).toLocaleString(),
                        startTime1 = obj["start-time"],
                        now1 = Date.parse(new Date()),
                        endTime1 = obj["end-time"],
                        now = new Date(obj["start-time"]).toLocaleString(),
                        endTime = new Date(obj["end-time"]).toLocaleString(),
                        title = obj["title"],
                        live = obj["live"];
                    if(title.length > 10) {
                        title = title.substring(0, 5) + "..."
                    }
                    //                if (live && now1 <= endTime1)
                    if(live) {
                        html += "<li class='mui-table-view-cell mui-media mui-col-xs-6' data-activity-id='" + obj["id"] + "'data-activity-live='" + live + "'>";
                        html += "<a href='javascript:;'>";
                        html += "<img class='mui-media-object' src='" + obj["thumbnail"] + "' />";
                        html += "<div class='mui-media-body'>" + title + "&nbsp&nbsp直播中</div>";
                        html += "</a>";
                        html += "</li>";
                    } else {
                        html += "<li class='mui-table-view-cell mui-media mui-col-xs-6' data-activity-id='" + obj["id"] + "'data-activity-live='" + live + "'>";
                        html += "<a href='javascript:;'>";
                        html += "<img class='mui-media-object' src='" + obj["thumbnail"] + "' />";
                        html += "<div class='mui-media-body'>" + title + "</div>";
                        html += "</a>";
                        html += "</li>";
                    }
                }
                $("#activity-list > ul").append(html);

                if(length < count || (offset + length) >= total) {
                    loadStatus = "end";
                    $("#activity-list").pullToRefreshDone();
                    $("#self-activity-more").hide();
                    $("#self-activity-none").show();
                } else {
                    loadStatus = "ready";
                    $("#activity-list").pullToRefreshDone();
                }

                currentOffset += length;

            }, function(status) {
                loadStatus = "ready";
                $("#activity-list").pullToRefreshDone();
                SELF.errorHandler(status);
            });
        },
        /*活动报道*/
        requestReport = function(offset, count, readCache, writeCache, success, fail) {
            var uri = "/site/activity-report?offset=" + offset + "&count=" + count,
                response = null;
            if(readCache) {
                response = window.sessionStorage.getItem(uri);
            }
            if(response && response !== null) {
                success(response);
            }
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onload = function() {
                if(xhr.status === 200) {
                    if(writeCache) {
                        window.sessionStorage.setItem(uri, xhr.response);
                    }
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.onerror = function() {
                fail("error");
            };
            xhr.open("GET", uri);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        },
        loadReport = function(offset, count, readCache, writeCache) {
            loadStatus = "loading";
            requestReport(offset, count, readCache, writeCache, function(response) {
                var json = window.JSON.parse(response),
                    list = json["v1"],
                    total = json["v2"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
                for(; i < length; i++) {
                    obj = list[i];

                    html += "<li  data-report-id='" + obj["id"] + "' style='line-height: 2rem;'>";
                    html += "<a href='javascript:;'>";
                    html += "<div class='mui-media-body'>" + obj["title"] + "</div>";
                    html += "</a>";
                    html += "</li>";

                }
                $("#report-list > ul").append(html);

                $("#report-list > ul > li").click(function() {
                    layer.open({
                        title :'活动报道',
                        type: 2,
                        content: 'module/activity/activity-report.html' ,
                        area: ['100%', '100%']
                    });
                });

                if(length < count || (offset + length) >= total) {
                    loadStatus = "end";
                    $("#report-list").pullToRefreshDone();
                    $("#self-report-more").hide();
                    $("#self-report-none").show();
                } else {
                    loadStatus = "ready";
                    $("#report-list").pullToRefreshDone();
                }

                currentOffset += length;

            }, function(status) {
                loadStatus = "ready";
                $("#report-list").pullToRefreshDone();
                SELF.errorHandler(status);
            });
        },
        /*self公示*/
        requestPublicity = function(offset, count, readCache, writeCache, success, fail) {
            var uri = "/site/publicity?offset=" + offset + "&count=" + count,
                response = null;
            if(readCache) {
                response = window.sessionStorage.getItem(uri);
            }
            if(response && response !== null) {
                success(response);
            }
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onload = function() {
                if(xhr.status === 200) {
                    if(writeCache) {
                        window.sessionStorage.setItem(uri, xhr.response);
                    }
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.onerror = function() {
                fail("error");
            };
            xhr.open("GET", uri);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        },
        loadPublicity = function(offset, count, readCache, writeCache) {
            loadStatus = "loading";
            requestPublicity(offset, count, readCache, writeCache, function(response) {
                var json = window.JSON.parse(response),
                    list = json["v1"],
                    total = json["v2"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
                for(; i < length; i++) {
                    obj = list[i];

                    html += "<li data-report-id='" + obj["id"] + "' style='line-height: 2rem;'>";
                    html += "<a href='javascript:;'>";
                    html += "<div class='mui-media-body'>" + obj["activity-name"] + "</div>";
                    html += "</a>";
                    html += "</li>";

                }
                $("#selfPlus-list > ul").append(html);
                
                 $("#selfPlus-list > ul > li").click(function() {
                    layer.open({
                        title :'SELF公示',
                        type: 2,
                        content: 'module/activity/activity-publicity.html' ,
                        area: ['100%', '100%']
                    });
                });

                if(length < count || (offset + length) >= total) {
                    loadStatus = "end";
                    $("#selfPlus-list").pullToRefreshDone();
                    $("#self-selfPlus-more").hide();
                    $("#self-selfPlus-none").show();
                } else {
                    loadStatus = "ready";
                    $("#selfPlus-list").pullToRefreshDone();
                }

                currentOffset += length;

            }, function(status) {
                loadStatus = "ready";
                $("#selfPlus-list").pullToRefreshDone();
                SELF.errorHandler(status);
            });
        },
        destroyUI = function() {
            currentOffset = 0;
            loadStatus = "ready";
            $("#activity-list ul").unbind("click");
            $("#activity-list").unbind("scroll");
            $("#activity-list").pullToRefreshDone();
        };
    SELF.subscribe("unload-activity", function() {
        destroyUI();
        $("body > article").empty();
    })("load-activity", function() {
        SELF.loadHtml("module/activity/activity.html", function(html) {
            $("body > article").empty().html(html);
            initUI();
        });
    });

})(window, $, SELF);