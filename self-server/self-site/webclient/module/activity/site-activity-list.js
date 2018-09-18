(function (window, $, layer, SELF) {
//定义全局变量存放查询参数
    var type = 0;
    loadActivity = function (type) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json3 = window.JSON.parse(xhr.response);
                processActivity(json3);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("PUT", "/site/activity/search");
        let objPrams = {
            "publish": true,
            "type": {
                "id": type
            }
        }
        // alert("objPrams------" + JSON.stringify(objPrams));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, loadFeeActivity = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json3 = window.JSON.parse(xhr.response);
                processActivity2(json3);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/activity/fee");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadTimeActivity = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json3 = window.JSON.parse(xhr.response);
                processActivity2(json3);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/activity/time");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    },
            loadType = function () {
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
            },
            processActivity = function (json3) {
                var i3 = 0,
                        tr = "",
                        activityTitle = "";
                outer:
                        for (; i3 < Math.ceil(json3["v1"].length / 1); i3++) {
                    tr += "<tr>";
                    for (var j3 = 0; j3 < 3; j3++) {
                        if (json3["v1"][i3 * 3 + j3] === undefined) {
                            switch (j3) {
                                case 1:
                                    tr += "<td></td><td></td><td></td>";
                                    break outer;
                                case 2:
                                    tr += "<td></td><td></td>";
                                    break outer;
                                default :
                                    tr += "<td></td>";
                                    break outer;
                            }
                        } else {

                            if (json3["v1"][i3 * 3 + j3].title.length > 23) {
                                activityTitle = json3["v1"][i3 * 3 + j3].title.substring(0, 27) + "...";
                            } else {
                                activityTitle = json3["v1"][i3 * 3 + j3].title;
                            }
                            tr += "<td><a href='site-activity-detail.html?id=" + json3["v1"][i3 * 3 + j3].id + "'><image src='" + json3["v1"][i3 * 3 + j3].thumbnail + "'  class='activity-image'/><p  class='p-activity-p'><strong>&nbsp;" + activityTitle + "</p></div></p></a><br /><br /></td>";
                        
                        }
                    }
                    tr += "</tr>";

                }
                $("#table").html(tr);
            }, processActivity2 = function (json3) {
        var i3 = 0,
                tr = "",
                activityTitle = "";
        outer:
                for (; i3 < Math.ceil(json3.length / 1); i3++) {
            tr += "<tr>";
            for (var j3 = 0; j3 < 3; j3++) {
                if (json3[i3 * 3 + j3] === undefined) {
                    switch (j3) {
                        case 1:
                            tr += "<td></td><td></td><td></td>";
                            break outer;
                        case 2:
                            tr += "<td></td><td></td>";
                            break outer;
                        default :
                            tr += "<td></td>";
                            break outer;
                    }
                } else {

                    if (json3[i3 * 3 + j3].title.length > 23) {
                        activityTitle = json3[i3 * 3 + j3].title.substring(0, 27) + "...";
                    } else {
                        activityTitle = json3[i3 * 3 + j3].title;
                    }
                    tr += "<td><a href='site-activity-detail.html?id=" + json3[i3 * 3 + j3].id + "'><image src='" + json3[i3 * 3 + j3].thumbnail + "'  class='activity-image'/><p  class='p-activity-p'><strong>&nbsp;" + activityTitle + "</p></div></p></a><br /><br /></td>";
                }
            }
            tr += "</tr>";
        }
        $("#table").html(tr);
    },
            processType = function (json1) {
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
                            loadActivity(type);

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
                            loadActivity(type);
                        }

                    });
                });
            },
            $(document).ready(function () {
        loadActivity("");

        $("#top").load("/top.html", function () {

            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
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

        loadType();

        $("#selected").on("change", function () {
            if ($("option:selected", this).val() == '1001') {
                loadTimeActivity();
            } else if ($("option:selected", this).val() == '1002') {
                loadFeeActivity();
            }
        });
    });


})(window, $, layer, SELF);
