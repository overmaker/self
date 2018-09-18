(function (window, $, layer, SELF) {
    layui.use("element", function () {
        var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
        element.render();
    });

    //回车检索
    $("#top-searchtext").keyup(function (e) {
        if (e.keyCode === 13) {
            var value = $("#top-searchtext").val();
            window.location.href="/fSearch.html?value="+value;
        }
    });
    
    $("#hide").click(function () {
        var title = $("#top-searchtext").val();
        window.location.href="fSearch.html?value="+title;
    });
    SELF.getUser(function (user) {
        if (user === 401) {
            $("#top-loginout").hide();
            $("#top-login").show();
        } else if (user) {
            $("#top-loginout").show();
            $("#top-login").hide();

            if (user["type"] === "admin") {
                $("#top-loginout > dl").prepend("<dd><a href='/admin-console'>管理控制台</a></dd>");
            }

            SELF.getUserInfo(user["id"], function (userinfo) {
                $("#top-loginout > a > img").attr("src", userinfo["photo"]);
                $("#top-loginout > a > span").text(userinfo["nick-name"]);
            });
        } else {
            /* 服务器错误，按未登录处理 */
            $("#top-loginout").hide();
            $("#top-login").show();
        }

        //全文搜索
        $(document).ready(function () {
        });
    });
})(window, $, layer, SELF);

function loader() {

}

function loginout() {
    var xhr = new XMLHttpRequest();
    xhr.onloadstart = SELF.startLoadAnimation();
    xhr.onloadend = SELF.stopLoadAnimation();
    xhr.onload = function () {
        window.location = "/";
    };
    xhr.onerror = function () {
        window.location = "/";
    };
    xhr.open("DELETE", "/site/auth");
    xhr.send();
}

function Home() {
    $("li").removeClass("layui-this");
    $("#top-home").toggleClass("layui-this");
}

function Video() {
    $("li").removeClass("layui-this");
    $("#top-video").addClass("layui-this");
}

function Activity() {
    $("li").removeClass("layui-this");
    $("#top-activity").addClass("layui-this");
}

function Speaker() {
    $("li").removeClass("layui-this");
    $("#top-speaker").addClass("layui-this");
}

function LiveActivity() {
    $("li").removeClass("layui-this");
    $("#top-live-activity").addClass("layui-this");
}

function Participation() {
    $("li").removeClass("layui-this");
    $("#top-participation").addClass("layui-this");
}

/*function Product() {
 $("li").removeClass("layui-this");
 $("#top-product").addClass("layui-this");
 }*/

function About() {
    $("li").removeClass("layui-this");
    $("#top-about").addClass("layui-this");
}

function UserInfo() {
    $("li").removeClass("layui-this");
    $("#top-userinfo").addClass("layui-this");
}
