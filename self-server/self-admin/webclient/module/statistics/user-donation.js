((window, $, layer, SELF) => {
    SELF.registeredModule("actity-join-statistics", "module/statistics/user-donation.html");

    let [table, pager] = [undefined, undefined];
    let [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
    let [dialog, dialogBtn, addBtn, exportBtn, searchBox] = [undefined, undefined, undefined, undefined, undefined];

    let currentId = undefined; // 当前选中的视频类型ID
    let openType = undefined;

    const dynamicButtons = []; // 动态生成的按钮，例如编辑、删除分类

    let requestActivityJoinList = (title, offset, count) => {
        return new window.Promise((resolve, reject) => {
            let obj = {
                "activity": {
                    "title": title
                }
            }
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
            xhr.open("PUT", `/admin/activity-join/count`);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(obj));
        });
    }, loadActivityJoinList = (title, offset, count) => {
        pager.pagination("loading");
        requestActivityJoinList(title, offset, count).then(result => {
            let dataList = result["v1"],
                    total = result["v2"];
            table.datagrid("loadData", dataList);
            pager.pagination({
                total: total,
                pageNumber: currentPageNumber,
                pageSize: currentPageSize
            });

            /* 解绑点击事件 */
            dynamicButtons.forEach((btn, index) => {
                btn.unbind("click");
            });

            dynamicButtons.length = 0; // 清空数组元素

            currentId = undefined;

            dataList.forEach((data, index) => {
                genOPButton(data["id"], data['name'], index);
            });

            pager.pagination("loaded");
        }, error => {
            pager.pagination("loaded");
            SELF.errorHandler(error);
        });
    }, /*报表条形图*/
            baobiao = function () {

                require.config({
                    paths: {
                        echarts: 'lib/echart'
                    }
                });

                // Step:4 require echarts and use it in the callback.  
                // Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径  
                require(
                        [
                            //这里的'echarts'相当于'./js'  
                            'echarts',
                            'echarts/chart/bar',
                            'echarts/chart/line',
                        ],
                        //创建ECharts图表方法  
                                function (ec) {
                                    var myChart = ec.init(document.getElementById('main'));
                                    //图表显示提示信息
                                    myChart.showLoading();
                                    //定义图表options
                                    var options = {
                                        color: ['#C91423'],
                                        title: {
                                            text: "活动报名统计报表",
                                        },

                                        tooltip: {
                                            trigger: 'axis'
                                        },
                                        legend: {
                                            data: []
                                        },
                                        //工具箱，每个图表最多仅有一个工具箱  
                                        toolbox: {
                                            //显示策略，可选为：true（显示） | false（隐藏），默认值为false  
                                            show: true,
                                            //启用功能，目前支持feature，工具箱自定义功能回调处理  
                                            feature: {
                                                //数据视图，打开数据视图，可设置更多属性,readOnly 默认数据视图为只读(即值为true)，可指定readOnly为false打开编辑功能  
                                                dataView: {show: true, readOnly: true},
                                                //magicType，动态类型切换，支持直角系下的折线图、柱状图、堆积、平铺转换  
                                                magicType: {show: true, type: ['line', 'bar']},
                                                //restore，还原，复位原始图表  
                                                restore: {show: true},
                                                //saveAsImage，保存图片（IE8-不支持）,图片类型默认为'png'  
                                                saveAsImage: {show: true}
                                            }
                                        },
                                        calculable: true,
                                        /*                  grid:{
                                         x:50,
                                         y:45,
                                         x2:5,
                                         y2:20,
                                         borderWidth:1
                                         }, */

                                        xAxis: [{
                                                name: '活动名称',

                                                axisLabel: {
                                                    interval: 0,
                                                    formatter: function (params) {
                                                        var newParamsName = "";
                                                        var paramsNameNumber = params.length;
                                                        var provideNumber = 6;
                                                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                                        if (paramsNameNumber > provideNumber) {
                                                            for (var p = 0; p < rowNumber; p++) {
                                                                var tempStr = "";
                                                                var start = p * provideNumber;
                                                                var end = start + provideNumber;
                                                                if (p == rowNumber - 1) {
                                                                    tempStr = params.substring(start, paramsNameNumber);
                                                                } else {
                                                                    tempStr = params.substring(start, end) + "\n";
                                                                }
                                                                newParamsName += tempStr;
                                                            }

                                                        } else {
                                                            newParamsName = params;
                                                        }
                                                        return newParamsName
                                                    }

                                                },
                                                type: 'category',
                                                data: []
                                            }],
                                        yAxis: [{
                                                name: '报名人数',
                                                type: 'value',

                                                splitArea: {
                                                    show: true
                                                }
                                            }],

                                        series: [{
                                                barWidth: 30, //柱图宽度
                                                itemStyle: {normal: {label: {show: true, position: 'top'}}}
                                            }]
                                    };

                                    //通过Ajax获取数据
                                    $.ajax({
                                        type: "put",
                                        async: false, //同步执行
                                        url: "/admin/activity-join/count0",
                                        dataType: "json", //返回数据形式为json
                                        success: function (result) {
                                            if (result) {
                                                //将返回的category和series对象赋值给options对象内的category和series
                                                //因为xAxis是一个数组 这里需要是xAxis[i]的形式
                                                options.xAxis[0].data = result.category;
                                                options.series[0].data = result.series[0].data;
                                                options.series[0].name = result.series[0].name;
                                                options.series[0].type = result.series[0].type;
                                                options.legend.data = result.legend;

                                                myChart.hideLoading();
                                                myChart.setOption(options);
                                            }
                                        },
                                        error: function (errorMsg) {
                                            alert("图表请求数据失败啦!");
                                        }
                                    });
                                }
                        );
                    }, genOPButton = (id, name, index) => {
                table.datagrid("fixRowHeight", index);
            };

            SELF.subscribe("load-module", moduleName => {
                if (moduleName === "actity-join-statistics") {
                    /* 页面被加载的处理 */
                    table = $("#self-module-actity-join-statistics").datagrid({
                        columns: [[
                                {field: "activity", title: "活动名称", width: "33%", align: "center", formatter: (value, row, index) => value.title},
                                {field: "num", title: "报名人数", width: "33%", align: "center"},
                                {field: "----", title: "金额", width: "33%", align: "center", formatter: (value, row, index) => row.activity.fee}
                            ]],
                        toolbar: "#self-module-actity-join-statistics-toolbar",
                        rownumbers: true,
                        pagination: true,
                        fitColumns: true,
                        singleSelect: true,
                        height: "100%"
                    });

                    pager = table.datagrid("getPager");
                    pager.pagination({
                        onSelectPage: (pageNumber, pageSize) => {
                            if (pageNumber > 0) {
                                [currentPageNumber, currentPageSize] = [pageNumber, pageSize];
                                loadActivityJoinList(searchBox.textbox("getValue"), (currentPageNumber - 1) * currentPageSize, currentPageSize);
                            }
                        }
                    });
                    /*报表查询*/
                    baobiao();
                    searchBox = $("#self-module-actity-join-statistics-toolbar-name").textbox({
                        label: "活动标题",
                        width: 200,
                        height: 38,
                        labelWidth: 100,
                        labelAlign: "center"
                    });

                    addBtn = $("#self-module-actity-join-statistics-toolbar-add").linkbutton({
                        text: "查询",
                        height: 38,
                        iconCls: "icon-search"
                    });

                    addBtn.bind("click", () => {
                        loadActivityJoinList(searchBox.textbox("getValue"), 0, 10);
                    });

                    exportBtn = $("#self-module-actity-join-statistics-toolbar-export").linkbutton({
                        text: "导出到excel",
                        height: 38,
                        iconCls: "icon-excel"
                    });

                    exportBtn.bind("click", () => {
                        const title = searchBox.textbox("getValue");
                        const uri = `/admin/activity-join/export?title=${title}`;
                        window.open(uri);
                    });

                    loadActivityJoinList(searchBox.textbox("getValue"), 0, 10);
                }
            })("unload-module", (moduleName) => {
                if (moduleName === "actity-join-statistics") {
                    /* 卸载动作 */
                    [table, pager] = [undefined, undefined];
                    [currentPageNumber, currentPageSize] = [1, 10]; // 初始化第1页，每页10行
                }
            });
        })(this, $, layer, SELF);