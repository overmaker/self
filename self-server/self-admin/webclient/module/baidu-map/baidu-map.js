((window, $, layer, SELF) => {
    SELF.registeredPopup("baidu-map-viewer", "module/baidu-map/baidu-map.html");

    let init = false;

    let [dialog, map, local] = [undefined, undefined, undefined];

    initUI = () => {
        return new window.Promise((resolve, reject) => {

            if (dialog === undefined) {
                let html = SELF.getPopupHtml("baidu-map-viewer");
                dialog = $(html).appendTo("body").dialog({
                    title: "百度地图",
                    width: 500,
                    height: 450,
                    closed: false,
                    cache: false,
                    modal: true
                });
            }

            SELF.initBaidumap = SELF.initBaidumap || (() => {
                if (map === undefined) {
                    map = new BMap.Map("baidu-map-viewer");
                    map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
                    map.addControl(new BMap.NavigationControl());
                    map.addControl(new BMap.ScaleControl());
                    map.addControl(new BMap.OverviewMapControl());
                    map.addControl(new BMap.MapTypeControl());
                }

                if (local === undefined) {
                    local = new BMap.LocalSearch(map, {
                        renderOptions: {map: map}
                    });
                }

                init = true;

                resolve({
                    dialog: dialog,
                    map: map,
                    local: local
                });
            });

            if (init === false) {
                let script = document.createElement("script");
                script.src = "https://api.map.baidu.com/api?v=2.0&ak=34LE286pfBxpzcqMjaFcGBW4wQu7ecYg&callback=SELF.initBaidumap";
                document.body.appendChild(script);
            } else {
                resolve({
                    dialog: dialog,
                    map: map,
                    local: local
                });
            }

        });

    }, destoryUI = () => {
    };

    SELF.subscribe("self-baidumap", (geoObj, output) => {
        initUI().then((obj) => {
            const[dialog, map, local] = [obj["dialog"], obj["map"], obj["local"]];
            dialog.dialog("open");
            if (geoObj && geoObj.place && geoObj.place.length > 0 && geoObj.city && geoObj.city.length > 0) {
                //local.search(place);
                let geocoder = new BMap.Geocoder();
                geocoder.getPoint(geoObj.place, function (point) {
                    if (point) {
                        output.x = point.lng;
                        output.y = point.lat;
                        if (output.callback) {
                            output.callback();
                        }
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                    } else {
                        /* 无法定位 */
                        delete output.x;
                        delete output.y;
                        if (output.callback) {
                            output.callback();
                        }
                    }
                }, geoObj.city);
            }
        });

    });

})(this, $, layer, SELF);