(function(window, $, layer, SELF) {

    var requestFutureLive = function(callback) {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onload = function() {
                if(xhr.status === 200) {
                    var json = window.JSON.parse(xhr.response),
                        future = "<a  href='../activity/site-activity-detail.html?id=" + json["v1"][0].id + "'> <img src='" + json["v1"][0].image + "'style='width: 100%;height: 300px;' /></a>";
                    $("#futureLive").append(future);
                } else {
                    SELF.errorHandler(xhr.status);
                }
            };
            xhr.onerror = function() {
                SELF.errorHandler("error");
            };
            var query = "/site/activity/futureLive";
            xhr.open("GET", query);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        },
        requestLiving = function(callback) {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onload = function() {
                if(xhr.status === 200) {
                    var json = window.JSON.parse(xhr.response),
                        i3 = 0,
                        tr = "";
                    outer:
                        for(; i3 < Math.ceil(json["v1"].length / 1); i3++) {
                            for(var j3 = 0; j3 < 5; j3++) {
                                if(json["v1"][i3 * 5 + j3] === undefined) {
                                      /*switch (j3) {
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
                                      }*/
                                } else {
                                    var date = new Date(json["v1"][i3 * 5 + j3]["live-starttime"]), //日期对象
                                        now = "";
                                    now = date.getFullYear(json["v1"][i3 * 5 + j3]["live-starttime"]) + "年"; //读英文就行了
                                    now = now + (date.getMonth(json["v1"][i3 * 5 + j3]["live-starttime"]) + 1) + "月"; //取月的时候取的是当前月-1如果想取当前月+1就可以了
                                    now = now + date.getDate(json["v1"][i3 * 5 + j3]["live-starttime"]) + "日";
                                    now = now + date.getHours(json["v1"][i3 * 5 + j3]["live-starttime"]) + "时";
                                    now = now + date.getMinutes(json["v1"][i3 * 5 + j3]["live-starttime"]) + "分";
                                    now = now + date.getSeconds(json["v1"][i3 * 5 + j3]["live-starttime"]) + "秒";

                                    if(json["v1"][i3 * 5 + j3].title .length > 20) {
                                        title = json["v1"][i3 * 5 + j3].title .substring(0, 20) + "...";
                                    } else {
                                        title = json["v1"][i3 * 5 + j3].title ;
                                    }

                                    tr += "<div class='layui-col-md3' style='border: 1px solid gainsboro;margin-right: 1%;'>";
                                    tr += "<div><a href='live-detail.html?id=" + json["v1"][i3 * 5 + j3].id + "'><img src='" + json["v1"][i3 * 5 + j3].image + "'style='width: 100%;'/></a></div>";
                                    tr += "<div>";
                                    tr += "<p style='color: #000000; background-color: gainsboro;'><i class='layui-icon'>&#xe600;</i> " + title + "</p>";
                                    tr += "<p>" + now + "</p>";
                                    tr += "<p>发起人：网络中心</p>";
                                    tr += "<p style='color: #000000;float: right;margin-right: 10%;'><i class='layui-icon'>&#xe600;</i>直播中</p>";
                                    tr += "</div>";
                                    tr += "</div>";
                                }
                            }
                        }
                    $("#living").html(tr);
                } else {
                    SELF.errorHandler(xhr.status);
                }
            };
            xhr.onerror = function() {
                SELF.errorHandler("error");
            };
            var query = "/site/activity/living";
            xhr.open("GET", query);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        },
        requestPastLive = function(callback) {
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onload = function() {
                if(xhr.status === 200) {
                    var json = window.JSON.parse(xhr.response);
                    //                callback(json);
                } else {
                    SELF.errorHandler(xhr.status);
                }
            };
            xhr.onerror = function() {
                SELF.errorHandler("error");
            };
            var query = "/site/activity/pastLive";
            xhr.open("GET", query);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        };
    $(document).ready(function() {
        requestFutureLive();
        requestLiving();
        requestPastLive();
        $("#top").load("/top.html", function() {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function() {
                LiveActivity();
            };
            head.appendChild(script);
        });
        $("#flooter").load("/bottom.html", function() {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            var email = $("input[type=email]").val();
            script.src = "/bottom.js";
            script.type = "text/javascript";
            script.onload = function() {
                loadEmail(email, "");
            };
            head.appendChild(script);
        });
    });
})(window, $, layer, SELF);