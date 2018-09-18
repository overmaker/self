((window, $, layer, upload, SELF) => {
    SELF.registeredModule("video-upload", "module/video/video-upload.html");

    let [panel, uploadBtn, videoPath] = [];

    const initUI = () => {
        panel = $("#self-module-video-upload").panel({
            fit: true
        });

        uploadBtn = $("#self-video-file-btn");

        let uploadInst = upload.render({
            elem: uploadBtn,
            accept: "video",
            acceptMime: "video/*",
            size: 1048576,
            auto: false,
            choose: (obj) => {
                obj.preview((index, file, result) => {
                    if (file.name.length >= 20) {
                        layer.msg("视频文件名应小于20字符！");
                        uploadInst.config.elem.next()[0].value = "";
                        return;
                    }
                    SELF.fileUpload("video-upload-video", file).then(filePath => {
                        videoPath = filePath;
                        uploadInst.config.elem.next()[0].value = "";
                        SELF.nav("video-publish", videoPath);
                    }, error => {
                        layer.alert("上传视频文件失败", {icon: 2, title: false});
                        uploadInst.config.elem.next()[0].value = "";
                    });
                });
            }
        });

    }, destoryUI = () => {
        uploadBtn = undefined;
        panel.panel("destroy");
    };

    SELF.subscribe("load-module", (moduleName) => {
        if (moduleName === "video-upload") {
            initUI();

        }
    })("unload-module", (moduleName) => {
        if (moduleName === "video-upload") {
            destoryUI();
        }
    });

})(this, $, layer, layui.upload, SELF);