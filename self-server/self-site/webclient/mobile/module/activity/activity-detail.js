(function(window, $, SELF) {
    var initUI = function(html) {
            $("body").append(html);
            $("#activity-detail").popup();
            $("#activity-detail header span").bind("click", function() {
                destroyUI();
            });
            var inputp = {
                indexInput: 0,

                addNew: function(obj, stepNum) {
                    this.initNew(obj, stepNum);
                    this.indexInput++;
                },
                getDigit: function(val, num) {
                    var digitNum = 0;
                    if(num.toString().split(".")[1]) {
                        digitNum = num.toString().split(".")[1].length;
                    }

                    if(digitNum > 0) {
                        val = val.toFixed(digitNum);
                    }
                    return val;

                },
                initNew: function(obj, stepNum) {

                    var width = obj.width();
                    var height = obj.height();
                    var height1 = height;

                    var _root = this;
                    width += 3;
                    //height+=0; 

                    obj.css("border-style", "none");
                    obj.css("border-width", "0px");

                    obj.css("width", width - height1 * 2 - 7);
                    obj.css("text-align", "center");
                    obj.css("outline", "none");
                    obj.css("vertical-align", "middle");
                    obj.css("line-height", height + "px");

                    obj.wrap("<div id='" + obj.attr('id') + "T' style='overflow:hidden;width:" + width + "px;height:" + height + "px;border: 1px solid #CCC;'></div>");

                    obj.before("<div id='" + obj.attr('id') + "l'  onselectstart='return false;' style='-moz-user-select:none;cursor:pointer;text-align:center;width:" + height1 + "px;height:" + height1 + "px;line-height:" + height1 + "px;border-right-width: 1px;border-right-style: solid;border-right-color: #CCC;float:left'>-</div>");
                    obj.after("<div id='" + obj.attr('id') + "r'  onselectstart='return false;' style='-moz-user-select:none;cursor:pointer;text-align:center;width:" + height1 + "px;height:" + height1 + "px;line-height:" + height1 + "px;border-left-width: 1px;border-left-style: solid;border-left-color: #CCC;float:right'>+</div>");
                    $("#" + obj.attr('id') + "l").click(function() {

                        _root.leftDo(obj, stepNum);
                    });
                    $("#" + obj.attr('id') + "r").click(function() {
                        _root.rightDos(obj, stepNum);
                    });

                },
                leftDo: function(obj, stepNum) {
                    var val = this.formatNum(obj.val());
                    val = Math.abs(val);
                    val -= stepNum;

                    val = this.getDigit(val, stepNum);

                    if(val < 0) {
                        val = 0;
                        obj.val(0);
                    } else {
                        this.moveDo(obj, val, true, stepNum);
                    };

                },
                rightDos: function(obj, stepNum) {

                    var val = this.formatNum(obj.val());
                    val = Math.abs(val);
                    val += stepNum;
                    val = this.getDigit(val, stepNum);

                    this.moveDo(obj, val, false, stepNum);

                },
                moveDo: function(obj, num, isup, stepNum) {
                    var startTop = 0;
                    var endTop = 0;
                    if(stepNum >= 1) {
                        if(num.toString().split(".")[1]) {
                            num = num.toString().split(".")[0];
                            obj.val(num);
                        }
                    }

                    var num1 = num;
                    var lens1 = num.toString().length;
                    var divwidth = parseFloat(obj.css("font-size")) / 2;
                    if(isup) {
                        obj.val(num1);
                        var isDecimal = false;
                        for(i = lens1 - 1; i >= 0; i--) {
                            var s = num.toString();
                            var s1 = s.substr(i, 1);
                            var s1num = parseFloat(s1);
                            if(s1num != 9 || isNaN(s1num)) {
                                if(isNaN(s1num)) {
                                    //num=parseFloat(s.substr(i-1,lens1-i));
                                    //                          num++;
                                    //                          num=this.getDigit(num,stepNum);
                                } else {
                                    num = parseFloat(s.substr(i, lens1 - i));
                                    num++;
                                    break;
                                }

                            }
                        }
                        //num=this.getDigit(num,stepNum)
                        startTop = 0;
                        endTop = -40;
                    } else {
                        var isDecimal = false;
                        for(i = lens1 - 1; i >= 0; i--) {
                            var s = num.toString();
                            var s1 = s.substr(i, 1);
                            var s1num = parseFloat(s1);
                            if(s1num != 0 || isNaN(s1num)) {

                                if(isNaN(s1num)) {
                                    //num=parseFloat(s.substr(i-1,lens1-i));
                                    //                          num=this.getDigit(num,stepNum);
                                    isDecimal = true;
                                } else {
                                    num = parseFloat(s.substr(i, lens1 - i));
                                    break;
                                }
                            }
                        }
                        if(isDecimal) {
                            num = this.getDigit(num, stepNum);
                        }
                        startTop = 40;
                        endTop = 0;
                    }

                    if($("#" + obj.attr('id') + "Num").length < 1) {
                        //background-color:#fff;
                        var numstr = num.toString();
                        var widths = divwidth * numstr.length;
                        var stri = "<div id='" + obj.attr('id') + "sy' style='position:relative;width:0px;height:0px'><div id='" + obj.attr('id') + "Num' style='width:" + widths + "px;z-index:100;position:absolute;height:" + obj.height() + "px;top:" + startTop + "px; line-height:" + obj.height() + "px;font-family: " + obj.css("font-family") + ";font-size:" + obj.css("font-size") + ";'>";
                        for(i = 0; i < numstr.length; i++) {
                            var nums = numstr.substr(i, 1);
                            if(nums == ".") {
                                stri += "<div style='float:left;width:" + divwidth + "px;'>&nbsp;";
                            } else {
                                stri += "<div style='float:left;width:" + divwidth + "px;background-color:#fff'>";
                                stri += nums;
                            }
                            stri += "</div>";
                        }
                        stri += "</div></div>";

                        $("#" + obj.attr('id') + "T").prepend(stri);
                        var leftOff = 0;
                        if(num1.toString().length - num.toString().length > 0) {
                            leftOff = (divwidth * (num1.toString().length - num.toString().length)) / 2;
                        }
                        var pz = 0;
                        if(/msie/.test(navigator.userAgent.toLowerCase())) {
                            pz = 1;
                        }
                        if(/firefox/.test(navigator.userAgent.toLowerCase())) {
                            pz = 1;
                        }
                        if(/webkit/.test(navigator.userAgent.toLowerCase())) {

                        }
                        if(/opera/.test(navigator.userAgent.toLowerCase())) {
                            pz = 1;
                        }
                        var leftpx = (obj.width() / 2) + obj.height() - ($("#" + obj.attr('id') + "Num").width() / 2) + 1 + leftOff + pz;
                        $("#" + obj.attr('id') + "Num").css("left", leftpx);
                        $("#" + obj.attr('id') + "Num").animate({
                                top: endTop + 'px'
                                //,opacity:0.4
                            },
                            300,
                            function() {
                                $("#" + obj.attr('id') + "sy").remove();
                                if(isup) {

                                } else {
                                    obj.val(num1);
                                }
                            });
                    }
                },

                formatNum: function(val) {
                    var val = parseFloat(val);
                    if(isNaN(val)) {
                        val = 0;
                    }
                    return val;
                },

            };
            inputp.addNew($("#inp"), 1);
            //鼠标单击票种事件
            var initDiv = function() {
                $("#oclick").css("border-color", "");
                $("#oclick").mouseover(function() {
                        $(this).css("border-color", "#588600");
                    })
                    .mouseout(function() {
                        $(this).css("border-color", "");
                    })
            };
            initDiv();
            $("#oclick")
                .click(function() {
                    initDiv();
                    //当前被点击的div改变背景色
                    $(this).css("border-color", "red");
                    $(this).css("color", "red");
                    //取消当前div的mouseout和mouseover事件
                    $(this).unbind("mouseout");
                    $(this).unbind("mouseover");
                });

        },
        requestActivity = function(activityId, success, fail) {
            var uri = "/site/activity/find/" + activityId;
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = SELF.startLoadAnimation();
            xhr.onloadend = SELF.stopLoadAnimation();
            xhr.onerror = function() {
                fail("error");
            };
            xhr.onload = function() {
                if(xhr.status === 200) {
                    success(xhr.response);
                } else {
                    fail(xhr.status);
                }
            };
            xhr.open("GET", uri);
            xhr.send();
        },
        loadActivity = function(activityId) {
            requestActivity(activityId, function(response) {
                var activity = JSON.parse(response),
                    startTime1 = activity["start-time"],
                    nowTime = new Date().getTime(),
                    joinEnd = new Date(activity["join-endtime"]).getTime(),
                    startTime = new Date(startTime1).toLocaleString();
                $("#activity-submit").attr("data-id", activity["id"]);
                $("#activity-image").attr("src", activity["image"]);
                $("#activity-title").html(activity.title);
                $("#activity-place").html(activity.place);
                $("#activity-intro").html(activity.introduction);
                $("#activity-time").html(startTime);

                if(joinEnd >= nowTime) {
                    $("#activity-submit").attr("value", "立即报名");
                    $("#activity-submit").click(function(event) {
                        alert("123");
                        $("#man").show();
                        var target = $(event.target),
                            activityId = target.attr("data-id");
                        while(!target.is("article") && activityId === undefined) {
                            target = target.parent();
                            activityId = target.attr("data-id");
                        }
                        if(activityId) {
                            SELF.publish("show-activity-join", activityId);
                        }

                    });
                } else {
                    $("#activity-submit").attr("value", "报名已结束！");
                }
            }, function(status) {
                SELF.errorHandler(status);
            });
        },
        destroyUI = function() {
            $("#activity-detail header > span").unbind();
            $.closePopup();
            $("#activity-detail").remove();
        };
    SELF.subscribe("show-activity-detail", function(activityId) {
        SELF.loadHtml("module/activity/activity-detail.html", function(html) {
            initUI(html);
            loadActivity(activityId);
            $("#activity-submit").click(function(event) {
                $("#man").show();

            });
        });

    });
})(window, $, SELF);