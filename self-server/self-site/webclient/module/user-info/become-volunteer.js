(function (window, $, layer, SELF) {

        SELF.getUser(function (user) {
            var userId = undefined;
            if (typeof user === "object") {
                userId = user["id"];
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = window.JSON.parse(xhr.response);
                        var tr = "",
                                i = 0,
                                videoTitle = "";
                        outer:
                                for (; i < Math.ceil(json["v1"].length / 1); i++) {
                            tr += "<tr>";
                            for (var j = 0; j < 5; j++) {
                                if (json["v1"][i * 5 + j] === undefined) {
                                    switch (j) {
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
                                    if (json["v1"][i * 5 + j].video.title.length > 23) {
                                        videoTitle = json["v1"][i * 5 + j].video.title.substring(0, 27) + "...";
                                    } else {
                                        videoTitle = json["v1"][i * 5 + j].video.title;
                                    }
                                    tr += "<td><a href='../video/video-info.html?id=" + json["v1"][i * 5 + j].video.id + "'><image src='" + json["v1"][i * 5 + j].video.thumbnail + "'  class='video-image'/><p  class='p-video-p'><strong>&nbsp;" + videoTitle + "</strong></p></div></p></a><br /><br /></td>";
                                }
                            }
                            tr += "</tr>";

                        }
                        $("#table").html(tr);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };

                xhr.open("GET", `/site/video-hits?id=${userId}`);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send();
            }
        });
})(window, $, layer, SELF);