((window, $, layer, upload, SELF) => {
    SELF.registeredModule("activity-detail", "module/activity/site-activity-detail.html");
    
    let [currentCooperationPageNumber, currentCooperationPageSize] = [1, 10]; // 初始化第1页，每页10行
    
    let id = undefined; // 更新的活动ID
    
    let requestActivity = id => {
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
            xhr.open("GET", `/admin/activity/find/${id}`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();
        });
    }, loadActivity = id => {
        requestActivity(id).then(activity => {
            var title = activity.title,
                        intro = activity.introduction,
                        intro2 = intro.substring(0, 5),
                        intro3 = intro.substring(5),
                        time1 = new Date(activity["start-time"]).toLocaleString(),
                        time11 = activity["join-starttime"],
                        time12 = activity["join-endtime"],
                        time2 = new Date(activity["end-time"]).toLocaleString(),
                        img = activity.thumbnail,
                        place = activity.place,
                        now = Date.parse(new Date()),
                        maxnum = activity['max-num'],
                        sponsor = activity["sponsor"],
                        full_text = activity["full-text"];
                $("#title").html(title);
                $("#intro2").html(intro2);
                $("#intro3").html(intro3);
                $("#startTime").html(time1);
                $("#endTime").html(time2);
                $("#count").html(maxnum);
                $("#place").html(place);
                $("#sponsor").html(sponsor);
                $("#full-text").html(full_text);
                $("#imageBig").attr("src", img);
                $("#imageSmall").attr("src", img);
                if (now < time11) {
                    $("input[type=button]").attr("value", "报名尚未开始");
                    $("input[type=button]").attr('disabled', true);
                } else if (now > time11 && now < time12) {
                    $("input[type=button]").attr("value", "我要报名");
                } else if (now > time12) {
                    $("input[type=button]").attr("value", "报名已结束");
                }
        }, error => {
            SELF.errorHandler(error);
        });
    };

    SELF.subscribe("load-module", (moduleName, activityId) => {
        if (moduleName === "activity-detail") {
            id = activityId;
            loadActivity(id);
        }
    });
})(this, $, layer, layui.upload, SELF);
