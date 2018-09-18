(function (window, $, layer, SELF) {
    var activityId = SELF.getQueryString("id");
    var code,
            checkCode = false;
    createCode = function () {
        //首先默认code为空字符串
        code = '';
        //设置长度，这里看需求，我这里设置了4
        var codeLength = 4;
        var codeV = document.getElementById('code');
        //设置随机字符
        var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        //循环codeLength 我设置的4就是循环4次
        for (var i = 0; i < codeLength; i++) {
            //设置随机数范围,这设置为0 ~ 36
            var index = Math.floor(Math.random() * 36);
            //字符串拼接 将每次随机的字符 进行拼接
            code += random[index];
        }
        //将拼接好的字符串赋值给展示的Value
//      codeV.value = code;
    },
            //下面就是判断是否== 的代码，无需解释
            validate = function () {
                var oValue = document.getElementById('input').value.toUpperCase();
                if (oValue == 0) {
                    alert('请输入验证码');
                } else if (oValue != code) {
                    alert('验证码不正确，请重新输入');
                    $("#input").val("");
                    createCode();
                } else {
                    alert("校验成功");
                    $("#input").val("");
                    $("#smsCode").attr('disabled', false);//设置disabled属性为false，按钮可用
                    $("#mobileCode").attr('disabled', false);//设置disabled属性为false，按钮可用
                }
            }, sendCode = function () {
        var phoneNumber = 15197227051;
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert("短信发送成功");
            } else if (xhr.status === 404) {
                alert("短信发送失败");
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/user/check3?phoneNumber1=" + phoneNumber);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    },
    checkCode = function (mobile, code, callback) {
        let objPrams = {
            "mobile": mobile,
            "email": code
        };
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                checkCode = window.JSON.parse(xhr.response);
               callback(checkCode);
            } else if (xhr.status === 404) {
                alert("失败");
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("POST", "/site/user/checkCode");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(objPrams));
    },
//    var activityId = 120;
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
                        return format.replace(/(y+|M+|d+|H+|m+|s+)/g, function (a) {
                            return dict[a];
                        });
                    };
            loadActivity = function (activityId, callback) {

                // console.log("activityId为："+activityId);
                
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = window.JSON.parse(xhr.response); //后台传送来的完整json数据

                        console.log(json); //inserted by shimingxiang

                        processActivity(json);
                        callback(json);
                    } else if (xhr.status === 404) {
                        layer.alert("没有找到指定活动", {icon: 2, title: false});
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };

                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.open("GET", "/site/activity/find/" + activityId);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send();
            }, loadTicket = function (activityId, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = window.JSON.parse(xhr.response);
                        processTicket(json);
                        callback(json);
                    } else if (xhr.status === 404) {
                        layer.alert("没有找到指定活动", {icon: 2, title: false});
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };

                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.open("GET", "/site/activity-ticket?activity-id=" + activityId);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send();
            }, /*活动嘉宾*/
                    activityGuest = function (activityId) {
                        var xhr = new XMLHttpRequest(),
                                activityId = SELF.getQueryString("id");
                        xhr.onloadstart = SELF.startLoadAnimation();
                        xhr.onloadend = SELF.stopLoadAnimation();
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                var json = window.JSON.parse(xhr.response),
                                        introduction = json[0]["introduction"],
                                        name = json[0]["name"],
                                        id = json[0].id,
                                        path = json[0]["photo"];
                                if (introduction.length > 50) {
                                    introduction = introduction.substring(0, 50) + "...";
                                }
                                var tr = "<div class='layui-row layui-col-space10'>";
                                tr += "<div class='layui-col-md2'> <img src=" + path + " /></div>";
                                tr += "<div class='layui-col-md2'> <img src=" + path + " /></div>";
                                tr += "<div class='layui-col-md2'> <img src=" + path + " /></div>";
                                tr += "<div class='layui-col-md2'> <img src=" + path + " /></div>";
                                tr += "<div class='layui-col-md2'> <img src=" + path + " /></div>";
                                tr += "</div>";
                                tr += "<div class='layui-row layui-col-space10'>";
                                tr += "<div class='layui-col-md2'>";
                                tr += "<p>" + name + "</p>";
                                tr += "</div>";
                                tr += "<div class='layui-col-md2'>";
                                tr += "<p>" + name + "</p>";
                                tr += "</div>";
                                tr += "<div class='layui-col-md2'>";
                                tr += "<p>" + name + "</p>";
                                tr += "</div>";
                                tr += "<div class='layui-col-md2'>";
                                tr += "<p>" + name + "</p>";
                                tr += "</div>";
                                tr += "<div class='layui-col-md2'>";
                                tr += "<p>" + name + "</p>";
                                tr += "</div>";
                                tr += "</div>";

                                $("#guestIntro").append(tr);
                            } else if (xhr.status === 404) {
                                layer.alert("没有找到指定嘉宾", {icon: 2, title: false});
                            } else {
                                SELF.errorHandler(xhr.status);
                            }
                        };

                        xhr.onerror = function () {
                            SELF.errorHandler("error");
                        };

                        xhr.open("GET", "/site/guest/find/" + activityId);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send();
                    }, /*相关视频*/
                    sameTimeVideo = function (activityId) {
                        var xhr = new XMLHttpRequest();
                        activityId = SELF.getQueryString("id"),
                                xhr.onloadstart = SELF.startLoadAnimation();
                        xhr.onloadend = SELF.stopLoadAnimation();
                        xhr.onload = function () {
                            if (xhr.status === 200) {

                                var json = window.JSON.parse(xhr.response),
                                        i3 = 0,
                                        tr = "",
                                        videoTitle = "";
                                outer:
                                        for (; i3 < Math.ceil(json.length / 1); i3++) {
                                    tr += "<tr>";
                                    for (var j3 = 0; j3 < 3; j3++) {
                                        if (json[i3 * 3 + j3] === undefined) {
                                            switch (j3) {
                                                case 1:
                                                    tr += "<td></td><td></td><td></td>";
                                                    break outer;
                                                case 2:
                                                    tr += "<td></td><td></td>";
                                                    break outer;
                                                default :
                                                    tr += "<td></td>";
                                                    break outer;
                                            }
                                        } else {

                                            if (json[i3 * 3 + j3].title.length > 23) {
                                                videoTitle = json[i3 * 3 + j3].title.substring(0, 27) + "...";
                                            } else {
                                                videoTitle = json[i3 * 3 + j3].title;
                                            }
//                                    tr += "<td><a href='../../module/video/video-info.html?id=" + json[i3 * 3 + j3].id + "'><image src='" + json[i3 * 3 + j3].thumbnail + "'  class='activity-image'/><p  class='p-activity-p'><strong>&nbsp;" + videoTitle + "</p></div></p></a><br /><br /></td>";
//                                
                                            if (json[i3 * 5 + j3].vip === true) {
                                                tr += "<td><a href='../../module/video/video-info.html?id=" + json[i3 * 5 + j3].id + "'><image src='" + json[i3 * 5 + j3].thumbnail + "'  class='video-image'/><p  class='p-video-p'><strong>&nbsp;" + videoTitle + "</strong></p><p style='float: left;'><image src='../../image/bf-loc.png' class='ff-items-p-image' >&nbsp;" + json[i3 * 5 + j3]["hits-num"] + "&nbsp;&nbsp;<image src='../../image/hz.png' class='ff-items-p-image' >&nbsp;" + json[i3 * 5 + j3]["likes-num"] + "&nbsp;&nbsp;<p>评分：" + json[i3 * 5 + j3]["score"] / 2 + "&nbsp;星" + "</p></div></p></a><img src='/image/self-video-vip.png' class='self-video-img' style='left: 30%;' /></td>";
                                            } else {
                                                tr += "<td><a href='../../module/video/video-info.html?id=" + json[i3 * 5 + j3].id + "'><image src='" + json[i3 * 5 + j3].thumbnail + "'  class='video-image'/><p  class='p-video-p'><strong>&nbsp;" + videoTitle + "</strong></p><p  style='float: left;'><image src='../../image/bf-loc.png' class='ff-items-p-image' >&nbsp;" + json[i3 * 5 + j3]["hits-num"] + "&nbsp;&nbsp;<image src='../../image/hz.png' class='ff-items-p-image' >&nbsp;" + json[i3 * 5 + j3]["likes-num"] + "&nbsp;&nbsp;<p>评分：" + json[i3 * 5 + j3]["score"] / 2 + "&nbsp;星" + "</p></div></p></a><br /><br /></td>";
                                            }
                                        }
                                    }
                                    tr += "</tr>";

                                }
                                $("#sameTimeVideo").html(tr);

                            } else if (xhr.status === 404) {
                                layer.alert("没有找到相关视频", {icon: 2, title: false});
                            } else {
                                SELF.errorHandler(xhr.status);
                            }
                        };

                        xhr.onerror = function () {
                            SELF.errorHandler("error");
                        };

                        xhr.open("GET", "/site/video/activity/" + activityId);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send();
                    },
                    loadActivityInfo2 = function (videoId, json, title) {
                        var xhr = new XMLHttpRequest();
                        xhr.onloadstart = SELF.startLoadAnimation();
                        xhr.onloadend = SELF.stopLoadAnimation();
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                var videoInfo = window.JSON.parse(xhr.response),
                                        tr = "<tbody>";
                                tr += " <tr>";
                                tr += "<td>";
                                tr += "<a href='video-info.html?id=" + json.id + "'><img src='" + json.thumbnail + "' class='video-image'>";
                                tr += "<p class='p-video-p'><strong>&nbsp;" + title + "</strong></p>";
                                tr += "<p style='float: left;'><img src='../../image/bf-loc.png' class='ff-items-p-image'>&nbsp;1&nbsp;&nbsp;<img src='../../image/hz.png' class='ff-items-p-image'>&nbsp;2&nbsp;&nbsp;</p>";
                                tr += "<p>评分：2&nbsp;星</p>";
                                tr += "<p></p>";
                                tr += "</a><br><br></td>";
                                tr += "</tr>";
                                tr += "</tbody>";
                                $("#sameTimeVideo").append(tr);
                            } else {
                                SELF.errorHandler(xhr.status);
                            }
                        };
                        xhr.onerror = function () {
                            SELF.errorHandler("error");
                        };
                        xhr.open("GET", "/site/video-info/" + videoId);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send();
                    }, processTicket = function (json) {
                var i = 0,
                        html = "",
                        option = "",
                        list = json,
                        min = json["purchase-min"],
                        max = json["purchase-max"],
                        len = json.length;
//        for (min; i < max; i++) {
//            var obj = list[i];
//            option += " <option value='";
//            option += i;
//            option += "'>" + i + "张</option>";
//        }
//         $("#ticketNum").empty().append(option);
                for (i; i < len; i++) {
                    var obj = list[i];
                    min = obj["purchase-min"],
                            max = obj["purchase-max"];
                    $("#ticketNum").attr("placeholder", "限购" + min + "到" + max + "张，必填！");
                    if (obj["status"] === "joinning") {
                        html += " <li style='margin-left:0px;margin-right:1%;margin-bottom:5px;cursor:pointer;width:32%;float:left;'  status1='";
                        html += obj["status"] + "'>";
                        html += "<div class='thumbnail'  status='";
                        html += obj["status"] + "'" + "fee='" + obj["fee"] + "'id='" + obj["id"] + "'>";
                        html += "<table style='border:none;width:100%;'>";
                        html += "<tbody><tr> <td style='padding:0px;'>";
                        html += "  <h4 class=;clearfix' style='margin:4px 0 0 0;'><span class='pull-left'>¥";
                        html += obj["fee"];
                        html += "</span></h4></td>";
                        html += "</tr></tbody></table><div class='caption' style='color:#777;padding:0px;'>";
                        html += "<ul style='list-style:none;margin:0;padding:0;'>";
                        html += " <li style='font-size:12px;'>";
                        html += "<table style='border:none;width:100%;'>";
                        html += "<tbody><tr> <td style='padding:0px;'>";
                        html += "<div style='width:165px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>";
                        html += obj["name"] + "&nbsp&nbsp&nbsp售票中";
                        html += "</div> </td></tr> </tbody></table></li> </ul></div></div></li>";
                    } else if (obj["status"] === "not_open") {
                        html += " <li style='margin-left:0px;margin-right:1%;margin-bottom:5px;cursor:pointer;width:32%;float:left;'  status1='";
                        html += obj["status"] + "'>";
                        html += "<div class='thumbnail' status='";
                        html += obj["status"] + "'" + "fee='" + obj["fee"] + "'>";
                        html += "<table style='border:none;width:100%;'>";
                        html += "<tbody><tr> <td style='padding:0px;'>";
                        html += "  <h4 class=;clearfix' style='margin:4px 0 0 0;'><span class='pull-left'>¥";
                        html += obj["fee"];
                        html += "</span></h4></td>";
                        html += "</tr></tbody></table><div class='caption' style='color:#777;padding:0px;'>";
                        html += "<ul style='list-style:none;margin:0;padding:0;'>";
                        html += " <li style='font-size:12px;'>";
                        html += "<table style='border:none;width:100%;'>";
                        html += "<tbody><tr> <td style='padding:0px;'>";
                        html += "<div style='width:165px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>";
                        html += obj["name"] + "&nbsp&nbsp&nbsp未开售";
                        html += "</div> </td></tr> </tbody></table></li> </ul></div></div></li>";
                    } else if (obj["status"] === "over") {
                        html += " <li style='margin-left:0px;margin-right:1%;margin-bottom:5px;cursor:pointer;width:32%;float:left;'    status1='";
                        html += obj["status"] + "'>";
                        html += "<div class='thumbnail' status='";
                        html += obj["status"] + "'" + "fee='" + obj["fee"] + "'>";
                        html += "<table style='border:none;width:100%;'>";
                        html += "<tbody><tr> <td style='padding:0px;'>";
                        html += "  <h4 class=;clearfix' style='margin:4px 0 0 0;'><span class='pull-left'>¥";
                        html += obj["fee"];
                        html += "</span></h4></td>";
                        html += "</tr></tbody></table><div class='caption' style='color:#777;padding:0px;'>";
                        html += "<ul style='list-style:none;margin:0;padding:0;'>";
                        html += " <li style='font-size:12px;'>";
                        html += "<table style='border:none;width:100%;'>";
                        html += "<tbody><tr> <td style='padding:0px;'>";
                        html += "<div style='width:165px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>";
                        html += obj["name"] + "&nbsp&nbsp&nbsp售票已结束";
                        html += "</div> </td></tr> </tbody></table></li> </ul></div></div></li>";
                    }
                }

                $("#ticketType").empty().append(html);
            }, processActivity = function (json) { //将json数据中的内容装入页面
                var title = json.title,
                        intro = json.introduction, //活动介绍
                        intro2 = intro.substring(0, 5),
                        intro3 = intro.substring(5),
                        time1 = new Date(json["start-time"]).toLocaleString(),
                        startTime = json["start-time"],
                        time11 = json["join-starttime"],
                        time12 = json["join-endtime"],
                        time2 = new Date(json["end-time"]).toLocaleString(),
                        endTime = json["end-time"],
                        img = json.thumbnail,
                        place = json.place,
                        now = Date.parse(new Date()),
                        maxnum = json['max-num'],
                        fulltext = json['full-text'];//inserted by shimingxiang
                        console.log(intro);
                        console.log(fulltext);
                $("#title").html(title);
                $("#intro2").html(intro2);
                $("#intro3").html(intro3);
                $("#startTime").html(time1);
                $("#endTime").html(time2);
                $("#count").html(maxnum);
                $("#place").html(place);
                $("#imageBig").attr("src", img);
//                $("#imageSmall").attr("src", img);
                if (startTime > now) {
                    $("#submit").attr('disabled', false);
                } else if (startTime < now && now < endTime) {
                    $("#submit").attr('disabled', true);
                } else if (now > endTime) {
                    $("#submit").attr('disabled', true);
                }
                        
                if (now < time11) {
                    $("input[type=button]").attr("value", "报名尚未开始");
                    $("input[type=button]").attr('disabled', true);
                } else if (now > time11 && now < time12) {
                    $("input[type=button]").attr("value", "我要报名");
                } else if (now > time12) {
                    $("input[type=button]").attr("value", "报名已结束");
//                    $("input[type=button]").attr('disabled', true);
                }

                $("#activity-fulltext").html(fulltext);

//        document.getElementById("image").src = json.thumbnail;
            }, loadComment = function (offset, count, activityId, pageNum) {
                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var json = JSON.parse(xhr.response),
                                list = json,
                                len = list.length,
                                total = json["v2"],
                                i = 0,
                                comment = undefined,
                                template = undefined,
                                totalTemplate = "";
                        $("#commendCount").html("(" + total + ")");
                        for (; i < len; i++) {
                            comment = list[i];
                            template = commentTemplate(comment["id"],
                                    comment["user"]["user-name"],
                                    comment["user-info"]["nick-name"],
                                    comment["user-info"]["photo"],
                                    comment["create-time"],
                                    comment["comment"]);
                            totalTemplate += template;
                        }
                        $(".commend-comment ul").empty().append(totalTemplate);
//                        删除评论事件
                        delClick();
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                var query = "/site/activity-comment?activity-id=" + activityId + "&offset=" + offset + "&count=10000";
                xhr.open("GET", query);
                xhr.send();
            }, 
            //<a style='float: right;' id='" + id + "' data-id='delComment' href='javascript:;' >删除</a>（删除事件）
            commentTemplate = function (id, userName, nickname, photo, time, content) {
                var util = layui.util;
                return "<li>" +
                        "<div class='layui-row comment-div' style='margin-bottom: 1%;'>" +
                        "<div class='layui-col-md1 comment-h'>" +
                        "<div class='grid-demo grid-demo-bg1' >" +
                        "<img src='" + photo + "' class='comment-img'style='height: auto;width: 100%;border-radius: 50px;'/>" +
                        "</div>" +
                        "</div>" +
                        "<div class='layui-col-md9'>" +
                        "<div class='grid-demo'>" +
                        "<p>&nbsp;&nbsp;&nbsp;<strong><span  style='color:black;'>" + ((nickname && nickname.length > 0) ? nickname : userName) + "</span></strong>&nbsp;&nbsp;&nbsp;" + util.timeAgo(time, false) + "</p>" +
                        "<p class='comment-p'>" + content + "</p>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</li>";
            }, deleteComment = function (id) {
                $.ajax({
                    url: "/site/activity-comment/" + id,
                    type: "delete",

                    success: function (msg) {
                        callback(msg);
                    },
                    error: function (xhr, textstatus, thrown) {

                    }
                });
            }, delClick = function () {
                $(".commend-comment ul a[data-id='delComment']").each(function () {
                    $(this).click(function () {
                        var id = $(this).attr("id");
                        SELF.getUser(function (user) {
                            if (user === 401 || user["type"] !== "admin") {
                                layer.msg("只有管理员才能删除评论");
                            } else {
                                layer.confirm('确认删除？', function (index) {
                                    deleteComment(id);
                                    //                                document.location.reload(); //当前页面 
                                    loadComment(0, "", activityId, 1);
                                    layer.close(index);
                                });
                            }
                        });
                    });
                });
            }, sendComment = function (activityId, userId, comment) {

                var xhr = new XMLHttpRequest();
                xhr.onloadstart = SELF.startLoadAnimation();
                xhr.onloadend = SELF.stopLoadAnimation();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        $("#self-comment").val("");
                        layer.msg("评论成功，请等待审核");
                        //                        document.location.reload(); //当前页面 
                        loadComment(0, "", activityId, 1);
                    } else {
                        SELF.errorHandler(xhr.status);
                    }
                };
                xhr.onerror = function () {
                    SELF.errorHandler("error");
                };
                xhr.open("POST", "/site/activity-comment/");
                xhr.setRequestHeader("Content-Type", "application/json");
                var obj = {
                    "user": {
                        "id": userId
                    },
                    "activity": {
                        "id": activityId
                    },
                    "comment": comment
                };
                xhr.send(JSON.stringify(obj));
            },
                    /*报名提交信息*/
                    submit = function (userId, ticketId, num, name, mobile, totalFee, email) {
                        var obj = {
                            "user": {
                                "id": userId
                            },
                            "ticket": {
                                "id": ticketId
                            },

                            "num": num,
                            "name": name,
                            "mobile": mobile,
                            "vcode": "test2222",
                            "total-fee": totalFee,
                            "email": email
                        };
                        var xhr = new window.XMLHttpRequest();
                        xhr.onloadstart = SELF.startLoadAnimation;
                        xhr.onloadend = SELF.stopLoadAnimation;
                        xhr.onerror = function () {
                            SELF.errorHandler("error");
                        };
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                var json = JSON.parse(xhr.response),
                                        return_code = json["return_code"];
                                if (return_code === "FAIL") {
                                    layer.alert(
                                            "<img src='/site/activity-userTicket/qr-code?data=" + json["code_url"] + "' />"
                                            );
                                }
                            } else {
                                SELF.errorHandler(xhr.status);
                            }
                        };
                        xhr.open("POST", "/site/activity-userTicket/wxpay");
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.setRequestHeader("Accept", "application/json");
                        xhr.send(JSON.stringify(obj));

                    }, checkPhoneNumber = function (mobile) {
                        let objPrams = {
                                "mobile":mobile
                            };
                                    var xhr = new XMLHttpRequest();
                                    xhr.onloadstart = SELF.startLoadAnimation();
                                    xhr.onloadend = SELF.stopLoadAnimation();
                                    xhr.onload = function () {
                                        if (xhr.status === 200) {
                                            alert("短信发送成功");
                                        } else if (xhr.status === 404) {
                                            alert("短信发送失败");
                                        } else {
//                                            SELF.errorHandler(xhr.status);
                                        }
                                    };
                                    xhr.onerror = function () {
                                        SELF.errorHandler("error");
                                    };
                                    xhr.open("POST", "/site/user/check3?");
                                    xhr.setRequestHeader("Content-Type", "application/json");
                                    xhr.send(JSON.stringify(objPrams));
                                },
            $(document).ready(function () {
            	 /*发送倒计时*/
            	 var wait = 60;
                 function time(o) {
                     if (wait == 0) {
                         o.removeAttribute("disabled");
                         o.value = "免费获取验证码";
                         wait = 60;
                     } else {

                         o.setAttribute("disabled", true);
                         o.value = "重新发送(" + wait + ")";
                         wait--;
                         setTimeout(function () {
                             time(o);
                         },
                                 1000);
                     }
                 }
                 
                 //票种数量
                $(".thumbnails").click(function () {
                     $("#event_ticket_order_number").show();
                });
                 
                $("#smsCode").attr('disabled', true);//设置disabled属性为false，禁用
                $("#mobileCode").attr('disabled', true);//设置disabled属性为false，禁用
                $("#validate").click(function () {
                    validate();
                });
                //设置此处的原因是每次进入界面展示一个随机的验证码，不设置则为空
                window.onload = function () {
                    createCode();
                };
                //报名按钮点击事件
                $(".active-sig-up").click(function () {
                    $(".sign-up").show();
                    createCode();
                    $(".active-ticket-species").hide();
                });
                //取消按钮点击事件
                $(".ticket-btn-group__cancel").click(function () {
                    $(".sign-up").hide();
                    $(".active-ticket-species").show();

                });
                $("#t").click(function () {
                    $(".thumbnail").removeClass("et_selected");
                    $(this).toggleClass("et_selected");
                });
                loadActivity(activityId, function (json) {
                    var show = function () {
                        var date = new Date(json["start-time"]); //日期对象
                        var now = "";
                        now = date.getFullYear(json["start-time"]) + "年"; //读英文就行了
                        now = now + (date.getMonth(json["start-time"]) + 1) + "月"; //取月的时候取的是当前月-1如果想取当前月+1就可以了
                        now = now + date.getDate(json["start-time"]) + "日";
                        now = now + date.getHours(json["start-time"]) + "时";
                        now = now + date.getMinutes(json["start-time"]) + "分";
                        now = now + date.getSeconds(json["start-time"]) + "秒";
                        setTimeout("show()", 1000); //设置过1000毫秒就是1秒，调用show方法
                    }
                    var nowTime = new Date().getTime(),
                            endTime = new Date(json["end-time"]).getTime(),
                            joinEnd = new Date(json["join-endtime"]).getTime();
                    if (endTime <= nowTime) {
                        sameTimeVideo(activityId);
                    } else {
                        $("#sign a").html("报名已结束！");
                        $("#sign a").attr("style", "border-style: solid;background-color: black;color: white;");
                    }
                    if (joinEnd <= nowTime) {
                        sameTimeVideo(activityId);
                    } else {
                        $("#sign a").attr("href", "site-activity-join.html?id=" + activityId);
                    }
                });
                /*加载活动票种*/
                loadTicket(activityId, function (json) {
                    $("#ticketType .thumbnail").each(function () {
                        $(this).click(function () {
                            var status = $(this).attr("status");
                            if (status === "joinning") {
                                $(".thumbnail").removeClass("et_selected");
                                $(this).toggleClass("et_selected");
                                var fee = $(this).attr("fee"),
                                        ticketId = $(this).attr("id");
                                $("#submit-join").click(function () {
                                    SELF.getUser(function (user) {
                                        if (user === 401) {
                                            var index = layer.open({
                                                title: '登陆',
                                                type: 2,
                                                area: ["1000px", "720px"],
                                                content: "/login/login.html?redirect_url=/module/activity/site-activity-detail.html?id=" + activityId
                                            });
                                        } else {
                                            var userId = user["id"],
                                                    ticketNum = $("#ticketNum").val(),
                                                    totalFee = fee * ticketNum;
                                            $("totalFee").attr("totalFee", totalFee);
                                            var ticketName = $("#ticketName").val(),
                                                    ticketMobile = $("#ticketMobile").val(),
                                                    ticketEmail = $("#ticketEmail").val();
                                            if (ticketName === "") {
                                                alert("请填写姓名");
                                                return;
                                            }
                                            if (ticketMobile === "") {
                                                alert("请填写电话号");
                                                return;
                                            }
                                            if (ticketEmail === "") {
                                                alert("请填写邮箱");
                                                return;
                                            }
                                            if (ticketNum === "") {
                                                alert("请填写购买张数");
                                                return;
                                            }
                                            var select = $("#xieyi").is(':checked');
                                            if (select === false) {
                                                alert("请阅读并同意用户协议");
                                            } else {
                                                var mobileCode = $("#mobileCode").val();
                                                checkCode(ticketMobile, mobileCode, function (checkCode) {
                                                    if (checkCode === true || checkCode === "true") {
                                                        submit(userId, ticketId, ticketNum, ticketName, ticketMobile, totalFee, ticketEmail);
                                                    } else {
                                                        alert("验证失败");
                                                    }
                                                });
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    });
                });
                $(function () {
                    $(".thumbnail").click(function () {
                        $(".thumbnail").removeClass("et_selected");
                        $(this).toggleClass("et_selected");
                    });
                });
                /* 加载评论 */
                loadComment(0,"",activityId,1);
                $("#top").load("/top.html", function () {
                    var head = document.getElementsByTagName("head").item(0);
                    var script = document.createElement("script");
                    script.src = "/top.js";
                    script.type = "text/javascript";
                    script.onload = function () {
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
            });
            /* 发布评论 1*/
            $("input[type=submit]").click(function () {
                var content = $("#self-comment").val();
                SELF.getUser(function (user) {
                    if (user === 401) {
                        var index = layer.open({
                            title: "登录",
                            type: 2,
                            area: ["1000px", "720px"],
                            content: "/login/login.html?redirect_url=/module/activity/site-activity-detail.html?id=" + activityId
                        });
                    } else if (content.trim() === "") {
                        layer.msg("不能发布空评论");
                    } else {
                        sendComment(activityId, user.id, content);
                    }
                });
            });
        })(window, $, layer, SELF);
