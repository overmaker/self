((window, $, layer, SELF) => {
    SELF.registeredModule("video-check-view", "module/video/video-check-view.html");
    let themeArray = [];
    let speakerArray = [];
    let [videoPath] = [undefined]; // 缩略图和视频文件服务器路径
    var requestVideo = id => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("GET", `/admin/video/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadVideo = id => {
        requestVideo(id).then(video => {
            console.log(video);
            $("#vtitle").html(video.title);
            $("#atitle").html(video["activity-name"]);
            $("#vtype").html(video["type"]["name"]);
            $("#valbum").html(video["album"]["name"]);
            $("#vimage").attr("src", video["thumbnail"]);
            $("#vtheme").html(video.title);
            for (let i = 0, len = video["themes"].length; i < len; i++) {
                let themeId = video["themes"][i]["id"],
                        themeName = video["themes"][i]["name"];
                themeArray.push(themeId);
                $("#vtheme").html(themeName);
            }
            for (let i = 0, len = video["speakers"].length; i < len; i++) {
                let vspeakerId = video["speakers"][i]["id"],
                        vspeakerName = video["speakers"][i]["name"];
                speakerArray.push(vspeakerId);
                $("#vspeaker").html(vspeakerName);
            }
            if (video.path.length > 0) {
                videoPath = video.path;
                var player = videojs("self-video-player", {
                    "controls": "true"
                }, function () {
                    //视频播放前展示图片
                    player.poster("http://www.self.org.cn/self_tpj/201707/W020180309614472530139.png");


                    player.src(videoPath); // 加载视频源
                });
            }
            if (video.status === 1) {
                document.getElementById("statust").checked = true;
            } else if (video.status === 2) {
                document.getElementById("statusbt").checked = true;
            }

            $("input[type=submit]").bind("click", () => {

                /** 获取参数*/
                const status = $('input[name="status"]:checked ').val();
                console.log(status);
                updateVideo(id, status);
                SELF.nav("video-check");
            });

        }, error => {
            SELF.errorHandler(error);
        });
    },
            updateVideo = (id, status) => {
        return new window.Promise((resolve, reject) => {
            let obj = {
                "status": status,
            }
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    SELF.publish("load-video-upload");
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/video/check/${id}`);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    }

    SELF.subscribe("load-module", (moduleName, id) => {
        if (moduleName === "video-check-view") {
            loadVideo(id);
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "video-check-view") {
            destoryUI();
        }
    });
})(this, $, layer, SELF);
