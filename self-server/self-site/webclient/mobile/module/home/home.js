(function(window, $, SELF) {

    var adverSlide = undefined,
        initUI = function() {
            $("#home-video-list").bind("click", function(event) {
                var target = $(event.target),
                    videoId = target.attr("data-video-id");
                while(!target.is("article") && videoId === undefined) {
                    target = target.parent();
                    videoId = target.attr("data-video-id");
                }
                if(videoId) {
                    SELF.publish("show-video-detail", videoId);
                }
            });
            $("#home-micro-list").bind("click", function(event) {
                var target = $(event.target),
                    videoId = target.attr("data-video-id");
                while(!target.is("article") && videoId === undefined) {
                    target = target.parent();
                    videoId = target.attr("data-video-id");
                }
                if(videoId) {
                    SELF.publish("show-video-detail", videoId);
                }
            });
            /*  演讲集跳转到视频页*/
            $("#aui-row").bind("click", function(event) {
                var target = $(event.target),
                    themeId = target.attr("data-video-id");
                while(!target.is("article") && themeId === undefined) {
                    target = target.parent();
                    themeId = target.attr("data-video-id");
                }
                if(themeId) {
                    SELF.publish("switch-video", {
                        "theme-id": themeId
                    });
                }
            });
            $("#home-video-more").bind("click", function() {
                SELF.publish("switch-video");
            });

            $("#home-activity-more").bind("click", function() {
                SELF.publish("switch-activity");
            });

            $("#home-product-more").bind("click", function() {
                SELF.publish("switch-product");
            });
            
//            var oForm =  document.getElementsByTagName("form")[0];
//            oForm.onsubmit = function(){
//                alert("我进来了");
//            };

            loadAdver(function(response) {
                var json = window.JSON.parse(response),
                    list = json["v1"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
                /*       for (; i < length; i++) {
                           obj = list[i];
                           html += "<div class='aui-slide-node' data-type='";
                           html += obj["type"];
                           html += "' data-target='";
                           html += obj["target-id"];
                           html += "'>";
                           html += "<img src='" + obj["image"] + "'>";
                           html += "</div>";
                       }*/
                      
                for(; i < length; i++) {
                    obj = list[i];
                    html += "<div class='mui-slider-item' data-type='";
                    html += obj["type"];
                    html += "' data-target='";
                    html += obj["target-id"];
                    html += "'>";
                    html += "<a href='#'><img src='" + obj["image"] + "'>";
                    html += "<p class='mui-slider-title'>"+obj["target-text"]+"</p>";
                    html += "</a></div>";
                }
                $("#loop").empty().html(html);
                mui.init({
                    swipeBack: true //启用右滑关闭功能
                });
                var slider = mui("#slider");
                slider.slider({
                    interval: 5000
                });

                $("#home-adver section.aui-slide-wrap").bind("click", function(event) {
                    var target = $(event.target),
                        type = target.attr("data-type"),
                        targetId = target.attr("data-target");
                    while(!target.is("section") && targetId === undefined) {
                        target = target.parent();
                        type = target.attr("data-type");
                        targetId = target.attr("data-target");
                    }
                    if(targetId) {
                        alert(type + "   " + targetId);
                    }
                });
            });

            loadVideo(function(response) {
                var json = window.JSON.parse(response),
                    list = json["v1"],
                    length = list.length,
                    i = 0,
                    videoTitle = "",
                    obj = undefined,
                    html = "";
                for(; i < length; i++) {
                    obj = list[i];
                    if(obj["enable"] === true) {
                        if(obj["title"].length > 10) {
                            videoTitle = obj["title"].substring(0, 10) + "...";
                        } else {
                            videoTitle = obj["title"];
                        }
                        html += "<div class='aui-col-xs-6 aui-card-list-footer'>";
                        html += "<section class='aui-content' data-video-id='";
                        html += obj["id"];
                        html += "'> <div class='aui-flex-col aui-flex-center aui-border-tb'><div class='aui-flex-item-12'><img src='";
                        html += obj["thumbnail"];
                        html += "'><div style='line-height: 2em;margin-bottom: 5%;'><p style='color: black;text-indent: 0.5em;'>杨雪</p> <h6 class='aui-text-warning' style='font-size: 90%;text-indent: 0.5em;'>";
                        html += videoTitle;
                        html += "</h6></div>";
                        html += "</div>  </div>  </section> </div>";
                    }
                }
                $("#home-video-list").html(html);
            });
            /*微纪录*/
            loadMicroVideo(function(response) {
                var json = window.JSON.parse(response),
                    list = json["v1"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
                for(; i < length; i++) {
                    obj = list[i];
                    html += "<div class='aui-slide-node bg-dark'>";
                    html += "<section class='aui-content'  data-video-id='";
                    html += obj["id"];
                    html += "' style='margin-top:0%;'>";
                    html += "<div class='aui-card-list' style='margin:1%;'>";
                    html += "<div class='aui-card-content'>";
                    html += "<img src='";
                    html += obj["thumbnail"];
                    html += "' style='height:170px;'/>";
                    html += "</div>";
                    html += "<div class='aui-card-list-footer'>";
                    html += "<div class='grid-demo'  id='micro-introduce'>";
                    html += "<h3 style='font-size:20px;margin-top:3%;color:gray;'>";
                    html += obj["title"];
                    html += "</h3>";
                    html += "<h3 style='color:gray;line-height:25px;font-size:16px;margin-top:3%;'>";
                    html += obj["introduction"];
                    html += "</h3>";
                    html += "</div></div></div></section></div>";
                }
                $("#home-micro-list").empty().html(html);

                new auiSlide({
                    container: document.getElementById("aui-slide"),
                    // "width":300,
                    "height": 350,
                    "speed": 500,
                    "autoPlay": 3000, //自动播放
                    "loop": true,
                    "pageShow": true,
                    "pageStyle": 'line',
                    'dotPosition': 'center'
                });
            });
            /*煮酒论道*/
            loadDaoVideo(function(response) {
                var json = window.JSON.parse(response),
                    list = json["v1"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
                for(; i < length; i++) {
                    obj = list[i];
                    html += "<div class='aui-col-xs-4 aui-card-list-footer'>";
                    html += "<section class='aui-content' data-video-id='";
                    html += obj["id"];
                    html += "'>";
                    html += "<div class='aui-flex-col aui-flex-center aui-border-tb'>";
                    html += "<div class='aui-flex-item-12'><img src='";
                    html += obj["thumbnail"];
                    html += "' style='height: 130px;'>";
                    html += "<div>";
                    html += obj["title"]; 
                    html += "</div>";
                    html += "</div>";
                    html += "</section>";
                    html += "</div>";
                }
                $("#aui-row1").html(html);
            });
            /* 演讲集*/
            loadTypeVideo(function(response) {
                var json = window.JSON.parse(response),
                    list = json["v1"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
                for(; i < length; i++) {
                    obj = list[i];
                    html += "<div class='aui-col-xs-4 aui-card-list-footer'>";
                    html += "<section class='aui-content' style='width: 100%;' data-video-id='";
                    html += obj["id"];
                    html += "'>  <div class='aui-flex-col aui-flex-center aui-border-tb'><a class='c-preview' style='width: 100%;'> <div class='aui-flex-item-12 c-preview__img'><img src='";
                    html += obj["thumbnail"];
                    html += "' style='height: 76px;'> </div><h5 class='c-preview__title'>"+obj["name"]+"</h5></a></div> </section></div>";
                }
                $("#aui-row").html(html);
            });
            /* 微纪录*/
//            loaderMicro(function(response) {
//                var json = window.JSON.parse(response),
//                    i = 0;
//
//                for(; i < json["v1"].length; i++) {
//                    if(json["v1"][i]["type"]["name"] == "微纪录") {
//                        //                            console.log(json["v1"][i]);
//                    }
//                }
//            })

            loadProduct(function(response) {
                var json = window.JSON.parse(response),
                    list = json["v1"],
                    length = list.length,
                    i = 0,
                    obj = undefined,
                    html = "";
                for(; i < length; i++) {
                    obj = list[i];
                    if(obj["is_enable"] === 1) {
                        html += "<div class='aui-col-xs-6 aui-card-list-footer'>";
                        html += "<section class='aui-content' data-video-id='";
                        html += obj["id"];
                        html += "'> <div class='aui-flex-col aui-flex-center aui-border-tb'><div class='aui-flex-item-12'><img src='";
                        html += obj["thumbnail"];
                        html += "'  style='width: 150px;height: 150px;'> <h5 class='aui-text-warning' style='margin-top: 5%;line-height: 25px;text-indent: 0.5rem;'>";
                        html += obj["name"];
                        html += "</h5>";
                        html += "<span class='aui-text-warning' style='margin-top: 5%;line-height: 25px;margin-left: 10%;'> ¥ &nbsp";
                        html += obj["price"];
                        html += "</span>";
                        html += "</div>  </div>  </section> </div>";
                    }
                }
                $("#home-product-list").html(html);
            });
        },
        destroyUI = function() {
            $("#home-video-list").unbind("click");
        },
        loadAdver = function(callback) {
            var uri = "/site/advertisement?offset=0&count=5",
                response = window.sessionStorage.getItem(uri);
            if(response && response !== null) {
                callback(response);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function() {
                    SELF.errorHandler("error");
                };
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        window.sessionStorage.setItem(uri, xhr.response);
                        callback(xhr.response);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.open("GET", uri);
                xhr.send();
            }
        },
        loadVideo = function(callback) {
            var uri = "/site/video?offset=0&count=4&isEnable=true",
                response = window.sessionStorage.getItem(uri);
            if(response && response !== null) {
                callback(response);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function() {
                    SELF.errorHandler("error");
                };
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        window.sessionStorage.setItem(uri, xhr.response);
                        callback(xhr.response);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.open("GET", uri);
                xhr.send();
            }
        },
        /*煮酒论道*/
        loadDaoVideo = function(callback) {
            var uri = "/site/video/dao?offset=0&count=3",
                response = window.sessionStorage.getItem(uri);
            if(response && response !== null) {
                callback(response);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function() {
                    SELF.errorHandler("error");
                };
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        window.sessionStorage.setItem(uri, xhr.response);
                        callback(xhr.response);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.open("GET", uri);
                xhr.send();
            }
        },
        /*微纪录*/
        loadMicroVideo = function(callback) {
            var uri = "/site/video/micro?offset=0&count=3",
                response = window.sessionStorage.getItem(uri);
            if(response && response !== null) {
                callback(response);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function() {
                    SELF.errorHandler("error");
                };
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        window.sessionStorage.setItem(uri, xhr.response);
                        callback(xhr.response);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.open("GET", uri);
                xhr.send();
            }
        },
        /* 演讲集*/
        loadTypeVideo = function(callback) {
            var uri = "/site/video-theme/order?offset=0&count=6",
                response = window.sessionStorage.getItem(uri);
            if(response && response !== null) {
                callback(response);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function() {
                    SELF.errorHandler("error");
                };
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        window.sessionStorage.setItem(uri, xhr.response);
                        callback(xhr.response);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.open("GET", uri);
                xhr.send();
            }
        },
        /* 微纪录*/
        loaderMicro = function(callback) {
            var uri = "/site/video?offset=0&count=10000",
                response = window.sessionStorage.getItem(uri);
            if(response && response !== null) {
                callback(response);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function() {
                    SELF.errorHandler("error");
                };
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        var type = window.sessionStorage.setItem(uri, xhr.response);
                        callback(xhr.response);
                        //                            loadTypeVideos(type);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.open("GET", uri);
                xhr.send();
            }
        },
        loadProduct = function(callback) {
            var uri = "/site/product?offset=0&count=6",
                response = window.sessionStorage.getItem(uri);
            if(response && response !== null) {
                callback(response);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onerror = function() {
                    SELF.errorHandler("error");
                };
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        window.sessionStorage.setItem(uri, xhr.response);
                        callback(xhr.response);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.open("GET", uri);
                xhr.send();
            }
        };

    SELF.subscribe("unload-home", function() {
        adverSlide = undefined;
        destroyUI();
        $("body > article").empty();
    })("load-home", function() {
        SELF.loadHtml("module/home/home.html", function(html) {
            $("body > article").empty().html(html);
            initUI();
        });
    });

})(window, $, SELF);