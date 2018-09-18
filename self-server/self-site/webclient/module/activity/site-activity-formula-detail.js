(function (window, $, layer, SELF) {

    var flow = undefined;

    function fullNum(obj) {
        if (Number(obj) < 10) {
            return '0' + obj;
        } else {
            return obj;
        }
    }
    
    var loadActivityFormula = function () {
        var xhr = new XMLHttpRequest(),
                id = SELF.getQueryString("id");
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json = window.JSON.parse(xhr.response);
                var mystime = new Date(json["publish-date"]),
                        startTime = mystime.getFullYear() + '-' + fullNum(Number(mystime.getMonth()) + 1) + '-' + fullNum(mystime.getDate()) + ' ' + fullNum(mystime.getHours()) + ":" + fullNum(mystime.getMinutes()) + ":" + fullNum(mystime.getSeconds());
                var div = "<h1 style='text-align: center;'>"+json["activity-name"]+"</h1><div class='times' style='margin-top: 2%;'> <span style='color: gray;'>"+json["cooperation-name"]+"</span><span style='float: right; margin-right: 35%;'>"+startTime+"</span></div><div id='show_0' style='float:left;margin-left:10px;padding:20px;font-size:14px;line-height:24px;'>"+json.content+"</div>";
                $("#formula-detail").html(div);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        
        xhr.open("GET", "/site/publicity/find/"+id);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    };

    $(document).ready(function () {
        $("#top").load("/top.html", function () {
            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                Activity();
            };
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

        loadActivityFormula();
    });
})(window, $, layer, SELF);
