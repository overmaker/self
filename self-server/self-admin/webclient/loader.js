((Promise, document, require, window) => {
    const loadCSS = uri => new Promise((resolve, reject) => {
            const node = document.createElement("link");
            node.rel = "stylesheet";
            node.type = "text/css";
            node.href = uri;
            node.onload = () => resolve(uri);
            node.onerror = () => reject(uri);
            document.getElementsByTagName("head")[0].appendChild(node);
        }), loadHtml = uri => new Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    localStorage[uri] = xhr.responseText;
                    resolve(uri);
                } else {
                    reject(uri);
                }
            };
            xhr.onerror = () => reject(uri);
            xhr.open("GET", uri);
            xhr.send();
        }), loadJS = new Promise((resolve, reject) => {
        require(["layui", "wang-editor", "video-js"], (xxxxxxxx, wangEditor, videojs) => {
            window.wangEditor = wangEditor;
            window.videojs = videojs;
            layui.use(["element", "form", "layer", "upload"], () => {
                require(
                        [
                            "top",
                            "left-menu",
                            "system-role",
                            "role-upload",
                            "role-update",
                            "system-admin",
                            "admin-upload",
                            "admin-update",
                            "video",
                            "video-publish",
                            "video-upload",
                            "video-update",
                            "video-type",
                            "user-count",
                            "video-comment-check",
                            "video-comment-view",
                            "video-danmu-check",
                            "activity-comment-check",
                            "sensitive-words",
                            "video-theme",
                            "video-theme-upload",
                            "video-theme-update",
                            "video-album",
                            "video-comment",
                            "video-check",
                            "video-check-view",
                            "speaker",
                            "speaker-add",
                            "speaker-update",
                            "admin-speaker",
                            "admin-speaker-add",
                            "admin-speaker-update",
                            "guest",
                            "guest-add",
                            "guest-update",
                            "baidu-map",
                            "activity-type",
                            "activity-theme",
                            "activity-template",
                            "activity-template-update",
                            "activity-apply",
                            "activity-apply-view",
                            "activity-join",
                            "activity-join-view",
                            "activity-comment",
                            "activity-list-management",
                            "activity-report",
                            "activity-report-upload",
                            "activity-report-update",
                            "activity-upload",
                            "activity-update",
                            "activity-ticket",
                            "activity-draft",
                            "activity-over",
                            "activity-joining",
                            "product-type",
                            "product",
                            "product-add",
                            "product-update",
                            "order",
                            "order-view",
                            "shipping-method",
                            "shipping-method-add",
                            "shipping-method-update",
                            "user-info",
                            "user-info-particulars",
                            "task-type",
                            "task",
                            "task-add",
                            "task-update",
                            "task-join",
                            "advertisement-upload",
                            "advertisement-update",
                            "cooperation",
                            "cooperation-add",
                            "cooperation-update",
                            "knowhow",
                            "knowhow-add",
                            "knowhow-update",
                            "friendship-link",
                            "friendship-link-add",
                            "friendship-link-update",
                            "about",
                            "about-update",
                            "donation",
                            "donation-add",
                            "donation-update",
                            "policy",
                            "QuestionAndAnswer",
                            "QuestionAndAnswer-update",
                            "policy-update",
                            "video-donation",
                            "actity-join-statistics",
                            "publicity",
                            "publicity-upload",
                            "publicity-update",
                            "score-config",
                            "activity-view",
                            "activity-detail"
                        ],
                        () => resolve(),
                        err => reject(err)
                );
            });
        }, err => reject(err));
    });
    require.config({
        paths: {
            "jquery": "lib/jquery/jquery-3.3.1.min",
            "echart": "lib/echart/echarts",
            "jquery-easyui": "lib/jquery/easyui/jquery.easyui.min",
            "easyui-lang-zh_CN": "lib/jquery/easyui/locale/easyui-lang-zh_CN",
            "datagrid-detailview": "lib/jquery/easyui/datagrid-detailview",
            "layui": "lib/layui/layui",
            "base": "lib/base",
            "wang-editor": "lib/wang-editor/wangEditor.min",
            "video-js": "lib/video-js/video.min",
            "util": "util",
            "baidu-map": "module/baidu-map/baidu-map",
            "top": "top",
            "left-menu": "left-menu",
            "system-role": "module/system/role",
            "role-upload": "module/system/role-upload",
            "role-update": "module/system/role-update",
            "system-admin": "module/system/admin",
            "admin-upload": "module/system/admin-upload",
            "admin-update": "module/system/admin-update",
            "video": "module/video/video",
            "video-publish": "module/video/video-publish",
            "video-upload": "module/video/video-upload",
            "video-update": "module/video/video-update",
            "video-type": "module/video/video-type",
            "user-count": "module/commons/user-count",
            "video-comment-check": "module/video/video-comment-check",
            "video-comment-view": "module/video/video-comment-view",
            "video-danmu-check": "module/video/video-danmu-check",
            "activity-comment-check": "module/activity/activity-comment-check",
            "sensitive-words": "module/video/sensitive-words",
            "video-theme": "module/video/video-theme",
            "video-theme-upload": "module/video/video-theme-upload",
            "video-theme-update": "module/video/video-theme-update",
            "video-album": "module/video/video-album",
            "video-comment": "module/video/video-comment",
            "video-check": "module/video/video-check",
            "video-check-view": "module/video/video-check-view",
            "speaker": "module/video/speaker",
            "speaker-add": "module/video/speaker-add",
            "speaker-update": "module/video/speaker-update",
            "admin-speaker": "module/video/admin-speaker",
            "admin-speaker-add": "module/video/admin-speaker-add",
            "admin-speaker-update": "module/video/admin-speaker-update",
            "guest": "module/video/guest",
            "guest-add": "module/video/guest-add",
            "guest-update": "module/video/guest-update",
            "activity-type": "module/activity/activity-type",
            "activity-theme": "module/activity/activity-theme",
            "activity-template": "module/activity/activity-template",
            "activity-template-update": "module/activity/activity-template-update",
            "activity-apply": "module/activity/activity-apply",
            "activity-apply-view": "module/activity/activity-apply-view",
            "activity-join": "module/activity/activity-join",
            "activity-join-view": "module/activity/activity-join-view",
            "activity-comment": "module/activity/activity-comment",
            "activity-list-management": "module/activity/activity-list-management",
            "activity-report": "module/activity/activity-report",
            "activity-report-upload": "module/activity/activity-report-upload",
            "activity-report-update": "module/activity/activity-report-update",
            "activity": "module/activity/activity",
            "activity-draft": "module/activity/activity-draft",
            "activity-over": "module/activity/activity-over",
            "activity-joining": "module/activity/activity-joining",
            "activity-upload": "module/activity/activity-upload",
            "activity-ticket": "module/activity/activity-ticket",
            "activity-update": "module/activity/activity-update",
            "product-type": "module/shop/product-type",
            "product": "module/shop/product",
            "product-add": "module/shop/product-add",
            "product-update": "module/shop/product-update",
            "order": "module/shop/order",
            "order-view": "module/shop/order-view",
            "shipping-method": "module/shop/shipping-method",
            "shipping-method-add": "module/shop/shipping-method-add",
            "shipping-method-update": "module/shop/shipping-method-update",
            "user-info": "module/commons/user-info",
            "user-info-particulars": "module/commons/user-info-particulars",
            "task-type": "module/task/task-type",
            "task": "module/task/task",
            "task-add": "module/task/task-add",
            "task-update": "module/task/task-update",
            "task-join": "module/task/left-menu-task-join",
            "advertisement": "module/advertisement/advertisement",
            "advertisement-upload": "module/advertisement/advertisement-upload",
            "advertisement-update": "module/advertisement/advertisement-update",
            "cooperation": "module/advertisement/cooperation",
            "cooperation-add": "module/advertisement/cooperation-add",
            "cooperation-update": "module/advertisement/cooperation-update",
            "knowhow": "module/advertisement/knowhow",
            "knowhow-add": "module/advertisement/knowhow-add",
            "knowhow-update": "module/advertisement/knowhow-update",
            "friendship-link": "module/advertisement/friendship-link",
            "friendship-link-add": "module/advertisement/friendship-link-add",
            "friendship-link-update": "module/advertisement/friendship-link-update",
            "about": "module/advertisement/about",
            "about-update": "module/advertisement/about-update",
            "donation": "module/advertisement/donation",
            "donation-add": "module/advertisement/donation-add",
            "donation-update": "module/advertisement/donation-update",
            "policy": "module/advertisement/policy",
            "QuestionAndAnswer": "module/advertisement/QuestionAndAnswer",
            "QuestionAndAnswer-update": "module/advertisement/QuestionAndAnswer-update",
            "policy-update": "module/advertisement/policy-update",
            "video-donation": "module/statistics/video-donation",
            "actity-join-statistics": "module/statistics/user-donation",
            "publicity": "module/activity/publicity",
            "publicity-upload": "module/activity/publicity-upload",
            "publicity-update": "module/activity/publicity-update",
            "score-config": "module/commons/integral-rule",
            "activity-view": "module/activity/activity-view",
            "activity-detail": "module/activity/site-activity-detail"
        }, shim: {
            "jquery-easyui": {
                deps: ["jquery"]
            },
            "easyui-lang-zh_CN": {
                deps: ["jquery-easyui"]
            },
            "datagrid-detailview": {
                deps: ["jquery-easyui"]
            },
            "echart": {
                deps: ["jquery"]
            },
            "util": {
                deps: ["base", "easyui-lang-zh_CN"]
            },
            "top": {
                deps: ["base", "easyui-lang-zh_CN"]
            },
            "left-menu": {
                deps: ["util"]
            },
            "baidu-map": {
                deps: ["util"]
            },
            "system-role": {
                deps: ["util"]
            },
            "role-upload": {
                deps: ["util"]
            },
            "role-update": {
                deps: ["util"]
            },
            "system-admin": {
                deps: ["util"]
            },
            "admin-upload": {
                deps: ["util"]
            },
            "admin-update": {
                deps: ["util"]
            },
            "video": {
                deps: ["util", "datagrid-detailview"]
            },
            "video-upload": {
                deps: ["video"]
            },
            "video-publish": {
                deps: ["video"]
            },
            "video-update": {
                deps: ["video"]
            },
            "video-comment-check": {
                deps: ["util"]
            },
            "video-comment-view": {
                deps: ["util"]
            },
            "video-danmu-check": {
                deps: ["util"]
            },
            "activity-comment-check": {
                deps: ["util"]
            },
            "video-type": {
                deps: ["util"]
            },
            "user-count": {
                deps: ["util", "echart"]
            },
            "sensitive-words": {
                deps: ["util"]
            },
            "video-theme": {
                deps: ["util"]
            },
            "video-theme-upload": {
                deps: ["util"]
            },
            "video-theme-update": {
                deps: ["util"]
            },
            "video-album": {
                deps: ["util"]
            },
            "video-comment": {
                deps: ["util"]
            },
            "video-check": {
                deps: ["util"]
            },
            "video-check-view": {
                deps: ["util"]
            },
            "speaker": {
                deps: ["util"]
            },
            "speaker-add": {
                deps: ["util"]
            },
            "speaker-update": {
                deps: ["util"]
            },
            "admin-speaker": {
                deps: ["util"]
            },
            "admin-speaker-add": {
                deps: ["util"]
            },
            "admin-speaker-update": {
                deps: ["util"]
            },
            "guest": {
                deps: ["util"]
            },
            "guest-add": {
                deps: ["util"]
            },
            "guest-update": {
                deps: ["util"]
            },
            "activity-type": {
                deps: ["util"]
            },
            "activity-theme": {
                deps: ["util"]
            },
            "activity-template": {
                deps: ["util"]
            },
            "activity-template-update": {
                deps: ["util"]
            },
            "activity-apply": {
                deps: ["util"]
            },
            "activity-apply-view": {
                deps: ["util"]
            },
            "activity-upload": {
                deps: ["activity", "datagrid-detailview"]
            },
            "activity-update": {
                deps: ["activity", "datagrid-detailview"]
            },
            "activity-ticket": {
                deps: ["activity-upload", "activity-update"]
            },
            "activity-join": {
                deps: ["util"]
            },
            "activity-join-view": {
                deps: ["util"]
            },
            "activity-comment": {
                deps: ["util"]
            },
            "activity-list-management": {
                deps: ["util"]
            },
            "activity-report": {
                deps: ["util"]
            },
            "activity-report-upload": {
                deps: ["util"]
            },
            "activity-report-update": {
                deps: ["util"]
            },
            "activity": {
                deps: ["util"]
            },
            "activity-draft": {
                deps: ["util"]
            },
            "activity-over": {
                deps: ["util"]
            },
            "activity-joining": {
                deps: ["util"]
            },
            "product-type": {
                deps: ["util"]
            },
            "product": {
                deps: ["util"]
            },
            "product-add": {
                deps: ["util"]
            },
            "product-update": {
                deps: ["util"]
            },
            "order": {
                deps: ["util"]
            },
            "order-view": {
                deps: ["util"]
            },
            "shipping-method": {
                deps: ["util"]
            },
            "shipping-method-add": {
                deps: ["util"]
            },
            "shipping-method-update": {
                deps: ["util"]
            },
            "user-info": {
                deps: ["util"]
            },
            "user-info-particulars": {
                deps: ["util"]
            },
            "task-type": {
                deps: ["util"]
            },
            "task": {
                deps: ["util"]
            },
            "task-add": {
                deps: ["util"]
            },
            "task-update": {
                deps: ["util"]
            },
            "task-join": {
                deps: ["util"]
            },
            "advertisement": {
                deps: ["util"]
            },
            "advertisement-upload": {
                deps: ["advertisement"]
            },
            "advertisement-update": {
                deps: ["advertisement"]
            },
            "cooperation": {
                deps: ["util"]
            },
            "cooperation-add": {
                deps: ["util"]
            },
            "cooperation-update": {
                deps: ["util"]
            },
            "knowhow": {
                deps: ["util"]
            },
            "knowhow-add": {
                deps: ["util"]
            },
            "knowhow-update": {
                deps: ["util"]
            },
            "friendship-link": {
                deps: ["util"]
            },
            "friendship-link-add": {
                deps: ["util"]
            },
            "friendship-link-update": {
                deps: ["util"]
            },
            "about": {
                deps: ["util"]
            },
            "about-update": {
                deps: ["util"]
            },
            "donation": {
                deps: ["util"]
            },
            "donation-add": {
                deps: ["util"]
            },
            "donation-update": {
                deps: ["util"]
            },
            "policy": {
                deps: ["util"]
            },
            "QuestionAndAnswer": {
                deps: ["util"]
            },
            "QuestionAndAnswer-update": {
                deps: ["util"]
            },
            "policy-update": {
                deps: ["util"]
            },
            "video-donation": {
                deps: ["util"]
            },
            "actity-join-statistics": {
                deps: ["util", "echart"]
            },
            "publicity": {
                deps: ["util"]
            },
            "publicity-upload": {
                deps: ["util"]
            },
            "publicity-update": {
                deps: ["util"]
            },
            "score-config": {
                deps: ["util"]
            },
            "activity-view": {
                deps: ["util"]
            },
            "activity-detail": {
                deps: ["util"]
            }
        }
    });
    Promise.all(
            [
                loadJS,
                loadCSS("lib/jquery/easyui/themes/metro-blue/easyui.css"),
                loadCSS("lib/jquery/easyui/themes/icon.css"),
                loadCSS("lib/jquery/easyui/themes/color.css"),
                loadCSS("lib/layui/css/layui.css"),
                loadCSS("lib/video-js/video-js.min.css"),
                loadCSS("lib/wang-editor/wangEditor.min.css"),
                loadCSS("index.css"),
                loadCSS("module/commons/user.css"),
                loadCSS("module/shop/shop.css"),
                loadCSS("module/activity/activity.css"),
                loadCSS("module/advertisement/advertisement.css"),
                loadCSS("module/activity/site-activity-detail.css"),
                loadHtml("module/video/video.html"),
                loadHtml("module/video/video-publish.html"),
                loadHtml("module/video/video-upload.html"),
                loadHtml("module/video/video-type.html"),
                loadHtml("module/commons/user-count.html"),
                loadHtml("module/video/video-comment-check.html"),
                loadHtml("module/video/video-comment-view.html"),
                loadHtml("module/video/video-danmu-check.html"),
                loadHtml("module/activity/activity-comment-check.html"),
                loadHtml("module/video/sensitive-words.html"),
                loadHtml("module/video/video-theme.html"),
                loadHtml("module/video/video-theme-upload.html"),
                loadHtml("module/video/video-album.html"),
                loadHtml("module/video/video-comment.html"),
                loadHtml("module/video/video-check.html"),
                loadHtml("module/video/video-check-view.html"),
                loadHtml("module/video/speaker.html"),

                loadHtml("module/video/speaker-add.html"),
                loadHtml("module/video/admin-speaker.html"),
                loadHtml("module/video/admin-speaker-add.html"),
                loadHtml("module/video/guest.html"),
                loadHtml("module/video/guest-add.html"),
                loadHtml("module/activity/activity-type.html"),
                loadHtml("module/activity/activity-theme.html"),
                loadHtml("module/activity/activity-template.html"),
                loadHtml("module/activity/activity-template-update.html"),
                loadHtml("module/activity/activity-apply.html"),
                loadHtml("module/activity/activity-apply-view.html"),
                loadHtml("module/activity/activity-join.html"),
                loadHtml("module/activity/activity-join-view.html"),
                loadHtml("module/activity/activity-comment.html"),
                loadHtml("module/activity/activity-list-management.html"),
                loadHtml("module/activity/activity-report.html"),
                loadHtml("module/activity/activity-report-upload.html"),
                loadHtml("module/baidu-map/baidu-map.html"),
                loadHtml("module/activity/activity.html"),
                loadHtml("module/activity/activity-upload.html"),
                loadHtml("module/activity/activity-ticket.html"),
                loadHtml("module/shop/product-type.html"),
                loadHtml("module/shop/product.html"),
                loadHtml("module/shop/product-add.html"),
                loadHtml("module/shop/order.html"),
                loadHtml("module/shop/order-view.html"),
                loadHtml("module/shop/shipping-method.html"),
                loadHtml("module/shop/shipping-method-add.html"),
                loadHtml("module/commons/user-info.html"),
                loadHtml("module/commons/user-info-particulars.html"),
                loadHtml("module/task/task-type.html"),
                loadHtml("module/task/task.html"),
                loadHtml("module/task/task-add.html"),
                loadHtml("module/task/left-menu-task-join.html"),
                loadHtml("module/advertisement/advertisement.html"),
                loadHtml("module/advertisement/advertisement-upload.html"),
                loadHtml("module/advertisement/cooperation.html"),
                loadHtml("module/advertisement/cooperation-add.html"),
                loadHtml("module/advertisement/knowhow.html"),
                loadHtml("module/advertisement/knowhow-add.html"),
                loadHtml("module/advertisement/friendship-link.html"),
                loadHtml("module/advertisement/friendship-link-add.html"),
                loadHtml("module/advertisement/about.html"),
                loadHtml("module/advertisement/about-upload.html"),
                loadHtml("module/advertisement/donation.html"),
                loadHtml("module/advertisement/donation-add.html"),
                loadHtml("module/advertisement/policy.html"),
                loadHtml("module/advertisement/QuestionAndAnswer.html"),
                loadHtml("module/advertisement/QuestionAndAnswer-update.html"),
                loadHtml("module/advertisement/policy-update.html"),
                loadHtml("module/statistics/video-donation.html"),
                loadHtml("module/statistics/user-donation.html"),
                loadHtml("module/system/role.html"),
                loadHtml("module/system/role-upload.html"),
                loadHtml("module/system/admin.html"),
                loadHtml("module/system/admin-upload.html"),
                loadHtml("module/activity/publicity.html"),
                loadHtml("module/activity/publicity-upload.html"),
                loadHtml("module/commons/integral-rule.html"),
                loadHtml("module/activity/activity-view.html"),
                loadHtml("module/activity/site-activity-detail.html")
            ])
            .then(() => {
                $(document).ready(() => {
                    SELF.publish("load-complete", undefined, undefined, () => {
                        $("#self-preloader").remove();
                        SELF.nav("activity"); // 加载完毕后，导航到用户管理
                    });
                });
            },
                    errorUri => console.error(`${errorUri} load failed.`)
            );
})(this.Promise, this.document, this.require, this);
