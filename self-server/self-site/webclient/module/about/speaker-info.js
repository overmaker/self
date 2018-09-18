(function (window, $, layer, SELF) {
    var speakerId = SELF.getQueryString("id");
    /相关视频/
    speakerVideo = function (speakerId) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        list = json["v1"],
                        totle = json["v2"],
                        apeendVideo = "",
                        len = list.length;
                if(totle==0){
                     $("#sameVideo").append("暂无相关视频");
                }
                for (var i = 0; i < len; i++) {
                    var obj = list[i];
                    apeendVideo = "<td style='width:20%'><a href='../../module/video/video-info.html?id=" + obj.id + "'>";
                    apeendVideo += "<img src='" + obj.thumbnail + "' style='width: 100%;height: 100%;'>";
                    apeendVideo += "<p class='p-video-p'><strong>&nbsp;" + obj.title + "</strong></p>";
                    apeendVideo += "</a>  <br><br></td>";
                }
                $("#speakerVideo").append(apeendVideo);
            } else if (xhr.status === 404) {
                layer.alert("没有找到指定视频", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/video/speaker/" + speakerId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    };
    $(document).ready(function () {
        speakerVideo(speakerId);
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
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

        var xhr = new XMLHttpRequest(),
                id = SELF.getQueryString("id");
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response),
                        img = json.photo,
                        name = json.name,
                        intro = json.introduction,
                        intro1 = intro.substring(0, 270),
                        intro2 = intro.substring(271, 425),
                        intro3 = intro.substring(426, 570),
                        intro4 = intro.substring(571);
                //图片
                var apeendVideo = "<img src='" + img + "'>";
                $("#images1").html(apeendVideo);

                //姓名、头像
                $("#speakerName").html(name);
                $("#speakerImage").attr("src", img);

                //介绍
                $("#intro1").html(intro1);
                $("#intro2").html(intro2);
                $("#intro3").html(intro3);
                $("#intro4").html(intro4);


                apeendVideo = "<p>" + intro + "</p>";
                $("#introduction").html(apeendVideo);

            } else if (xhr.status === 404) {
                layer.alert("没有找到演讲者", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };

        $("#lis li").each(function () {
            $(this).click(function () {
                $("#lis li").css("color", "gray");
                $(this).css("color", "#FF920B");
            });
        })

        xhr.onerror = function () {
            SELF.errorHandler("error");
        };

//        xhr.open("GET", "/site/speaker/findby?id=" + id);
        xhr.open("GET", "/site/speaker/findby/" + id);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    });
})(window, $, layer, SELF);
