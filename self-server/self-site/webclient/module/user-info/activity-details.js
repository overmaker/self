$(function () {
    $("#container").hide();
    $("#activity-info").show();
    $("#top").load("/top.html", function () {
        var head = document.getElementsByTagName("head").item(0);
        var script = document.createElement("script");
        script.src = "/top.js";
        script.type = "text/javascript";
        head.appendChild(script);
        UserInfo();
        loader();
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
});

function baiduMap() {
    $("#container").show();
    $("#activity-info").hide();
    var mp = new BMap.Map("container");
    mp.centerAndZoom(new BMap.Point(116.3964, 39.9093), 10);

    var myGeo = new BMap.Geocoder();

    myGeo.getPoint("北京市海淀区-中关村南四街四号 中科院软件园2号楼", function (point) {
        if (point) {
            mp.centerAndZoom(point, 16);
            mp.addOverlay(new BMap.Marker(point));
        } else {
            alert("您选择地址没有解析到结果!");
        }
    }, "北京市");

}
function activity() {
    $("#activity-info").show();
    $("#container").hide();
}