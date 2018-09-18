(function (window, $, layer, SELF) {
    loadAdvertisement = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var advertisement = window.JSON.parse(xhr.response);
                processAdvertisement(advertisement, "");
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/advertisement?offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, processAdvertisement = function (advertisement) {
        var l = 0,
                str = "<div carousel-item>";

        for (; l < advertisement["v1"].length; l++) {
            str += "<div><a data-id='" + advertisement["v1"][l]["target-id"] + "' data-type='" + advertisement["v1"][l].type + "' href='javascript:;'><img src='" + advertisement["v1"][l].image + "' draggable='false' style='width: 100%;height: 100%;'/><span style='background:rgba(237,237,237,0.6);width: 40%;height: 82%;position: absolute;top: 18%;right: 0;'><h1 style='margin-top: 15%;margin-left: 10%;color: black;'>从鱼到人的生命之旅</h1><h3 style='margin: 4% 10%;;color: gray;font-size: 16px;'>王原</h3><h5 style='margin: 4% 10%;font-size: 16px;line-height: 30px;color: black;'>从鱼到人的生命之旅获得中国科普作家优秀科普作品奖金奖、吴某某科学普及著作奖金签奖<等多项重量级奖项</h5></span></a></div> ";
        }
        str += "</div>";

        $("#carousel").html(str);
        layui.use("carousel", function () {
            var carousel = layui.carousel;
            //建造实例
            carousel.render({
                elem: "#carousel",
                width: "100%", //设置容器宽度
                height: "100%",
                arrow: "always" //始终显示箭头
            });
        });
        $("#carousel a").each(function () {
            $(this).click(function () {
                if ($(this).attr("data-type") === "video") {
                    window.location.href = "module/video/video-info.html?id=" + $(this).attr("data-id");
                } else if ($(this).attr("data-type") === "activity") {
                    loadActivity($(this).attr("data-id"));
                } else if ($(this).attr("data-type") === "product") {

                }
            });
        });
    }, loadVideo = function (title, type, album, themes) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                processVideo(json);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("PUT", "/site/video/search");
        let objPrams = {
            "offset": 0,
            "count": 10000,
            "title": title,
            "type": {
                "id": type
            },
            "album": {
                "id": album
            },
            "themes": themes
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    }, processVideo = function (json) {
        var i = 0,
                tr = "",
                videoTitle = "",
                speakerName = "";

        for (; i < 2; i++) {
            tr += "<tr>";
            for (var j = 0; j < 4; j++) {
//                 if (json["v1"][j].enable === true) {
                if ((i * 4 + j) >= json["v1"].length) {
                    tr += "<td></td>";
                } else {
                    if (json["v1"][i * 4 + j].title.length > 23) {
                        videoTitle = json["v1"][i * 4 + j].title.substring(0, 27) + "...";
                    } else {
                        videoTitle = json["v1"][i * 4 + j].title;
                    }
                    if (json["v1"][i * 4 + j]["speakers"] !== null && json["v1"][i * 4 + j]["speakers"].length > 0) {
                        speakerName = json["v1"][i * 4 + j]["speakers"][0]["name"];
                    } else {
                        speakerName = "";
                    }
//                    if (json["v1"][i * 4 + j].vip === true) {
//                        tr += "<td><a href='module/video/video-info.html?id=" + json["v1"][i * 4 + j].id + "'><image src='" + json["v1"][i * 4 + j].thumbnail + "'  class='remmoend-image'/><p style='margin-top: 3%;'>" + speakerName + "</p><p style='margin-top: 1%;font-weight: bold;'>" + videoTitle + "</p><p><img src='/image/vip.png' class='self-video-img' /></p></a></td>";
//                    } else {
                        tr += "<td><a href='module/video/video-info.html?id=" + json["v1"][i * 4 + j].id + "'><image src='" + json["v1"][i * 4 + j].thumbnail + "'  class='remmoend-image'/><p style='margin-top: 3%;'>" + speakerName + "</p><p style='margin-top: 1%;font-weight: bold;'>" + videoTitle + "</p></a></td>";
//                    }
                }
            }
//            }
            tr += "</tr>";
        }
        $("#table").html(tr);
    }, loadType = function (name) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var type = window.JSON.parse(xhr.response);
                loadTypeVideo(type);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        if (SELF.isIE()) {
            name = encodeURI(name);
        }
        xhr.open("GET", "/site/video-type?name=" + name + "&offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, loadTypeVideo = function (type) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200 || xhr.status === 400) {
                var json1 = window.JSON.parse(xhr.response);
                processTypeVideo(json1);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

//        xhr.open("GET", "/site/video?offset=0&count=10000&type=" + type["v1"][0].id);
//        xhr.setRequestHeader("Content-Type", "application/json"); 
        xhr.open("GET", "/site/video-theme/order?offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, processTypeVideo = function (json1) {
        var i1 = 0,
                tr1 = "";

        outer:
                for (; i1 < 2; i1++) {
            tr1 += "<tr class='layui-row'>";
            for (var j1 = 0; j1 < 3; j1++) {
//                var name = json1["v1"][i1 * 3 + j1].name;
                if (json1["v1"][i1 * 3 + j1] === undefined) {
                    switch (j1) {
                        case 1:
                            tr1 += "<td></td><td></td><td></td>";
                            break outer;
                        case 2:
                            tr1 += "<td></td><td></td>";
                            break outer;
                        default:
                            tr1 += "<td></td>";
                            break outer;
                    }
                } else {
                    tr1 += "<td  class='layui-col-md4'><dl><dt><a class='c-preview' href='module/video/video.html?id=" + json1["v1"][i1 * 3 + j1].id + "' style='height: 214px;'><image src='" + json1["v1"][i1 * 3 + j1].thumbnail + "'  class='remmoend-images c-preview__img' draggable='false' /><h2 class='c-preview__title'>" + json1["v1"][i1 * 3 + j1].name + "</h2></a></dt></dl></td>";
                }
            }
            tr1 += "</tr>";
        }
        $("#table1").html(tr1);
    }, loadProduct = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json2 = window.JSON.parse(xhr.response);
                processProduct(json2);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/product?offset=0&count=10000");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, processProduct = function (json2) {
//        var div = "<div class='layui-col-xs8'><div class='grid-demo grid-demo-bg1'><a href='module/shop/product-info.html?id=" + json2["v1"][4].id + "'><img src='" + json2["v1"][4].thumbnail + "' style='width: 99%;height: 320px; margin-left: 21px;'></a></div></div><div class='layui-col-xs4'><div class='grid-demo grid-demo-bg1'><a href='module/shop/product-info.html?id=" + json2["v1"][10].id + "'><img src='" + json2["v1"][10].thumbnail + "' style='width: 100%;height: 150px;margin-left: 20px'></a></div><div class='grid-demo grid-demo-bg1' style='padding-top: 20px;'><a href='module/shop/product-info.html?id=" + json2["v1"][12].id + "'><img src='" + json2["v1"][12].thumbnail + "' style='width: 100%;height: 150px;margin-left: 20px'></a></div></div>";
        var div = "<div class='layui-col-xs8'><div class='grid-demo grid-demo-bg1'><a href='module/shop/product.html" + "'><img src='" + json2["v1"][4].thumbnail + "' style='width: 99%;height: 320px; margin-left: 21px;'></a></div></div><div class='layui-col-xs4'><div class='grid-demo grid-demo-bg1'><a href='module/shop/product.html" + "'><img src='" + json2["v1"][10].thumbnail + "' style='width: 100%;height: 150px;margin-left: 20px'></a></div><div class='grid-demo grid-demo-bg1' style='padding-top: 20px;'><a href='module/shop/product.html" + "'><img src='" + json2["v1"][12].thumbnail + "' style='width: 100%;height: 150px;margin-left: 20px'></a></div></div>";

        $("#product").html(div);

    }, loadActivity = function (id) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                window.location.href = json["kepu-activity-url"] + "event/event_detail_" + json.eid + ".html";
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/activity/find/" + id);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    },
            loadMicro1 = function () {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = window.JSON.parse(xhr.response),
                                list = json["v1"],
                                length = list.length,
                                i = 0;
                        for (0; i < 5; i++) {
                            $("#title" + i).append(list[i].title);
                            $("#image" + i).attr("src", list[i].thumbnail);
                            $("#href" + i).attr("href", "module/video/video-info.html?id=" + list[i].id);
                        }
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };

                xhr.open("GET", "/site/video/micro?offset=0&count=5");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send();
            }, loadDao = function () {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        list = json["v1"],
                        length = list.length,
                        i = 0,
                        obj = undefined,
                        html = "";
                for (; i < length; i++) {
                    obj = list[i];
                    var time1 = obj["modified-time"],
                            time = new Date(time1).toLocaleString();
                    if (i === 0) {
                        html += "<div class='item active'><div class='layui-col-lg6'>";
                        html += "<div class='item'> <img src='";
                        html += obj["thumbnail"];
                        html += "'style='height: 380px;width: 100%;'></div> </div>";
                        html += " <div class='layui-col-lg6'> <div class='grid-demo' style='padding: 8% 10%;float: left;'>";
                        html += " <a href='module/video/video-info.html?id='";
                        html += obj["id"];
                        html += "'> <h1>" + obj["title"] + "</h1>";
//                      html += " <h4 style='font-size: 16px;margin-top: 3%;color: gray;'>" + time + "</h4>";
                        html += "<h3 style='color: gray;line-height: 25px;font-size: 16px;margin-top: 3%;'>" + obj["introduction"] + "<p><br></p></h3></a>";
                        html += "</div></div></div>";
                    } else {
                        html += "<div class='item'><div class='layui-col-lg6'>";
                        html += "<div class='item'> <img src='";
                        html += obj["thumbnail"];
                        html += "'style='height: 380px;width: 100%;'></div> </div>";
                        html += " <div class='layui-col-lg6'> <div class='grid-demo' style='padding: 8% 10%;float: left;'>";
                        html += " <a href='module/video/video-info.html?id='";
                        html += obj["id"];
                        html += "'> <h1>" + obj["title"] + "</h1>";
//                      html += " <h4 style='font-size: 16px;margin-top: 3%;color: gray;'>" + time + "</h4>";
                        html += "<h3 style='color: gray;line-height: 25px;font-size: 16px;margin-top: 3%;'>" + obj["introduction"] + "<p><br></p></h3></a>";
                        html += "</div></div></div>";
                    }
                }
                $("#dao").append(html);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

        xhr.open("GET", "/site/video/dao?offset=0&count=3");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    };
    $(document).ready(function () {
        $("#top").load("/top.html", function () {

            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.charset = "UTF-8";
            script.onload = function () {
                Home();
            };
            head.appendChild(script);

            loadAdvertisement();
            loadVideo();
            loadType("演讲集");
//            loaderMicro("微纪录");
            loadProduct();
            loadMicro1();
            loadDao();
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