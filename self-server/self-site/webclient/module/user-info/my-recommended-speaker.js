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
                    var append = "",
                            reason = "",
                            statuce = "";
                    var identity = 0;
                    for (var a = 0; a < json.v1.length; a++) {
                        identity++;
                        if (json["v1"][a].reason.length > 23) {
                            reason = json["v1"][a].reason.substring(0, 20) + "...";
                        } else {
                            reason = json["v1"][a].reason;
                        }
                        if (json["v1"][a].checled == true) {
                            statuce = "通过";
                        } else {
                            statuce = "不通过";
                        }
                        append += "<tr><td style='width:100px;'>" + identity + "</td><td>" + json.v1[a]["speaker-name"] + "</td><td>" + reason + "</td><td style='width:200px;'>" + statuce + "</td></tr>";
                    }

                    $("#speaker-table-tr").html(append);
                } else {
                    SELF.errorHandler(xhr.status);
                }
            };
            xhr.onerror = function () {
                SELF.errorHandler("error");
            };

            xhr.open("GET", "/site/speaker-recommend?id=" + userId);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        }
    });
})(window, $, layer, SELF);