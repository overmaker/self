(function (window, $, layer, SELF) {

    /**
     * 格式化时间
     * @param {type} date 时间参数
     * @param {type} format 转换格式
     * @returns {String} 转换结果
     */
    function formatDate(date, format) {
        if (!format)
            format = "yyyy-MM-dd";
        date = new Date(parseInt(date));
        var dict = {
            "yyyy": date.getFullYear(),
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "S": date.getMilliseconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(y+|M+|d+)/g, function (a) {
            return dict[a];
        });
    }
    loadTask = function (title, startData, status, uid) {
        var xhr = new XMLHttpRequest();
               
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                var append = "";
                var zhuangtai = "";
                var indentity = 0;

                for (var i = 0; i < json.v1.length; i++) {
                    indentity++;
                    if (json.v1[i].status === 0) {
                        zhuangtai = "已无效";
                    } 
                    else if (json.v1[i].status === 1) {
                        zhuangtai = "未认领";
                    }
                    else if (json.v1[i].status === 2) {
                        zhuangtai = "已认领";
                    } else if (json.v1[i].status === 3) {
                        zhuangtai = "已结束";
                    }
                    append += "<tr><td style='width:70px;' >" + indentity + "</td><td>" + json.v1[i].title + "</td><td>" + json.v1[i].descript + "</td><td>" + formatDate(json.v1[i].startTime) + "</td><td>" + zhuangtai + "</td></tr>";
                }
                $("#task-list").html(append);

            } else if (xhr.status === 404) {
                layer.alert("没有找到指任务", {icon: 2, title: false});
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        var query = "/site/task?offset=0&count=10&uid="+userId;
        if (title !== null && title !== undefined) {
            query += "&title=" + title;
        }
        if (startData !== null && startData !== undefined && startData !== "") {
            query += "&startTime=" + startData;
        }
        if (status !== null && status !== undefined && status !== "") {
            query += "&status=" + status;
        }

        xhr.open("GET", query);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    },
            requestTask = function () {
                var appendSeachBox = "<input type=\"button\" class=\"btn btn-primary\"  value=\"查询\" id=\"submit\" />";
                $("#task-table1-td").html(appendSeachBox);
                var search = document.getElementById("submit");
                search.onclick = function () {
                    loadTask($("#task-title").val(), $("#task-startdate").val(), $("#task-status-sel option:selected").val, 1);
                };
            };
            var userId = undefined;
    $(document).ready(function () {
    	 SELF.getUser(function (user) {
        	
            if (typeof user === "object") {
                userId = user["id"];
                loadTask("","",1,userId);
                requestTask();
            }
        });
    });
})(window, $, layer, SELF);

