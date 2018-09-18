(function (window, $, layer, SELF) {
    loadVideo = function (searchContent) {
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = SELF.startLoadAnimation();
        xhr.onloadend = SELF.stopLoadAnimation();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var json3 = window.JSON.parse(xhr.response);
                processVideo(json3);
            } else {
                SELF.errorHandler(xhr.status);
            }
        };
        xhr.onerror = function () {
            SELF.errorHandler("error");
        };
        xhr.open("GET", "/site/fSearch?offset=0&count=10000&searchContent=" + searchContent);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }, processVideo = function (json3) {
        var i3 = 0,
                tr = "";
        for (; i3 < json3["v1"].length; i3++) {

            if (json3["v1"][i3].type === 0) {//视频
//                if (json3["v1"][i3].enable === true) {
                    if (json3["v1"][i3].vip === true) {
                        tr += "<a href='/module/video/video-info.html?id=" + json3["v1"][i3].id + "'> ";
                        tr += "<div><dl style='height: 100%;margin: 1%;'>";
                        tr += "<dt style='float: left;'><img src='" + json3["v1"][i3].thumbnail + "'style='width: 250px; height: 128px;'/>";
                        tr += "</dt><dd>" + json3["v1"][i3].title + "</dd><dd>简介:" + json3["v1"][i3].introduction + "</dd>";
                        tr += " </dl></div> </a> ";
                    } else {
                        tr += "<a href='/module/video/video-info.html?id=" + json3["v1"][i3].id + "'> ";
                        tr += "<div><dl style='height: 100%;margin: 1%;'>";
                        tr += "<dt style='float: left;'><img src='" + json3["v1"][i3].thumbnail + "'style='width: 250px; height: 128px;'/>";
                        tr += "</dt><dd>" + json3["v1"][i3].title + "</dd><dd>简介:" + json3["v1"][i3].introduction + "</dd>";
                        tr += " </dl></div> </a> ";
                    }
//                }
            } 
//            else if (json3["v1"][i3].type === 1) {//直播
//                tr += "<a href='/module/video/live-info.html?id=" + json3["v1"][i3].id + "'> ";
//                tr += "<div><dl style='height: 100%;margin: 1%;'>";
//                tr += "<dt style='float: left;'><img src='" + json3["v1"][i3].thumbnail + "'style='width: 250px; height: 128px;'/>";
//                tr += "</dt><dd>" + json3["v1"][i3].title + "</dd><dd>简介:" + json3["v1"][i3].introduction + "</dd>";
//                tr += " </dl></div> </a> ";
//            } 
            else {//活动
                tr += "<a href='/module/activity/site-activity-detail.html?id=" + json3["v1"][i3].id + "'> ";
                tr += "<div><dl style='height: 100%;margin: 1%;'>";
                tr += "<dt style='float: left;'><img src='" + json3["v1"][i3].thumbnail + "'style='width:250px;height: 128px;'/>";
                tr += "</dt><dd>" + json3["v1"][i3].title + "</dd><dd>简介:" + json3["v1"][i3].introduction + "</dd>";
                tr += " </dl></div> </a> ";
            }
        }
        $("#div1").html(tr);
    };
    $(document).ready(function () {
    	//获取跳转URL带的参数
    	var prams=GetRequest();
    	//var id = request.getParameter("title"); 
    	
        $("#top").load("/top.html", function () {

            var head = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.src = "/top.js";
            script.type = "text/javascript";
            script.onload = function () {
                Video();
            };
            head.appendChild(script);
            //把参数放入搜索框中
            $(".inp1").val(prams);
            //页面加载时查询数据
            loadVideo(prams);
          //回车事件查询数据 用原生JS的能覆盖掉前一个回车事件
            document.getElementById('top-searchtext').onkeyup = function(event){
            	var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e &&e.keyCode === 13) {
                    var searchContent = $("#top-searchtext").val();
                    loadVideo(searchContent);
                }
            };
            
            //点击事件查询数据 用原生JS的能覆盖掉前一个点击事件
/*        	document.getElementById('top-searchbox').onclick = function(){
                var searchContent = $(".inp1").val();
                loadVideo(searchContent);
        		}*/
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
    //找到跳转URL里带过来的参数
    function GetRequest() {
    	var url = location.search; //获取url中"?"符后的字串
    	var theRequest = new Object();
    	if (url.indexOf("?") !== -1) {
    	    var str = url.substr(1),
    	    strs = str.split("&");
    	    for (var i = 0; i < strs.length; i++) {
    	        theRequest = decodeURIComponent(strs[i].split("=")[1]);
    	    }
    	}
    	return theRequest;
    }
})(window, $, layer, SELF);
