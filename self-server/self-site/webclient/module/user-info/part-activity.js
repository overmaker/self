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
                    var i = 0,
                            li = "";
                    if (json["v1"].length > 0) {
                        for (; i < json["v1"].length; i++) {
                            var startTime = new Date(json["v1"][i].activity["start-time"]).toLocaleString(),
                            startTime1 = json["v1"][i].activity["start-time"],
                            now1 = Date.parse(new Date()),
                            endTime1 = json["v1"][i].activity["end-time"];
                            li += "<a href='../activity/site-activity-detail.html?id="+json["v1"][i].activity.id+"'><div class='layui-row layui-col-space30'><div class='layui-col-md4'><img src='"+json["v1"][i].activity.thumbnail+"' style='width: 100%; height: auto;'></div><div class='layui-col-md7'><p class='active-title'>"+json["v1"][i].activity.title+"</p><p class='active-times'><i class='layui-icon'></i>"+startTime+"</p><p class='active-address'><i class='layui-icon'></i>"+json["v1"][i].activity.place+"</p>";
                            if (startTime1 > now1) {
                            li += "<p class='active-status'> 即将开始</p>";
                        } else if (startTime1 < now1 && now1 < endTime1) {
                            li += "<p class='active-status'> 活动中</p> ";
                        } else if (now1 > endTime1) {
                            li += "<p class='active-status'> 已结束</p> ";
                        }
                            li += "<p></p></div></div></a>";
                        }
                        $("#active-list").html(li);
                    }
                } else {
                    SELF.errorHandler(xhr.status);
                }
            };
            xhr.onerror = function () {
                SELF.errorHandler("error");
            };
            xhr.open("GET", "/site/activity-join?id=" + userId);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        }
    });
})(window, $, layer, SELF);
