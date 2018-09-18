((window, $, layer, SELF) => {
    SELF.registeredModule("score-config", "module/commons/integral-rule.html");
    let [okBtn] = [undefined];

    let[panel] = [];
    
    const initUI = () => {
        panel = $("#self-module-score-config").panel({
            fit: true
        });
        
        okBtn = $("#self-btn-score-config-submit").linkbutton({
            text: "确定",
            width: 115,
            height: 30
        });
        
        okBtn.bind("click", () => {
            
            /** 获取参数*/
            const ajs = document.getElementById("ajs").value;
            const acs = document.getElementById("acs").value;
            const vhs = document.getElementById("vhs").value;
            const vcs = document.getElementById("vcs").value;
            
            updateScoreConfig(ajs,acs,vhs,vcs);
        });
    }, destoryUI = () => {
        
    };
    
    let updateScoreConfig = (ajs,acs,vhs,vcs) => {
        return new window.Promise((resolve, reject) => {
            var obj = {
                "activity-join-score": ajs,
                "activity-comment-score": acs,
                "video-hit-score": vhs,
                "video-comment-score": vcs
            };
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => SELF.stopLoadAnimation();
            xhr.onload = () => {
                if (xhr.status === 204) {
                    loadScoreConfig();
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (evt) => {
                reject("error");
            };
            xhr.open("PUT", `/admin/score-config`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(obj));
        });
    }, requestScoreConfig = () => {
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
            xhr.open("GET", `/admin/score-config?offset=0&count=10`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadScoreConfig = () => {
        requestScoreConfig().then(result => {
            document.getElementById("ajs").value = result[0]["activity-join-score"];
            document.getElementById("acs").value = result[0]["activity-comment-score"];
            document.getElementById("vhs").value = result[0]["video-hit-score"];
            document.getElementById("vcs").value = result[0]["video-comment-score"];
        });
    };

    SELF.subscribe("load-module", (moduleName) => {
        if (moduleName === "score-config") {
            initUI();
            loadScoreConfig();
        }
    })("unload-module", (moduleName) => {
        if (moduleName === "load-score-config") {
            destoryUI();
            loadScoreConfig();
        }
    });
    ;

})(this, $, layer, SELF);
