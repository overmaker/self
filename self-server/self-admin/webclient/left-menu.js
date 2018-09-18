((window, $, layer, layuiElement, SELF) => {
    $("#left-menu-role").bind("click", () => {
        SELF.nav("system-role");
    });
    $("#left-menu-system-user").bind("click", () => {
        SELF.nav("system-admin");
    });
    $("#left-menu-video-publish").bind("click", () => {
        SELF.nav("video-upload");
    });
    $("#left-menu-video").bind("click", () => {
        SELF.nav("video");
    });
    $("#left-menu-user-count").bind("click", () => {
        SELF.nav("user-count");
    });
    $("#left-menu-video-type").bind("click", () => {
        SELF.nav("video-type");
    });
    $("#left-menu-video-comment-check").bind("click", () => {
        SELF.nav("video-comment-check");
    });
    $("#left-menu-video-comment-check").bind("click", () => {
        SELF.nav("video-comment-check");
    });
    $("#left-menu-activity-comment-check").bind("click", () => {
        SELF.nav("activity-comment-check");
    });
    $("#left-menu-live-comment-check").bind("click", () => {
        SELF.nav("live-comment-check");
    });
    $("#left-menu-video-danmu-check").bind("click", () => {
        SELF.nav("video-danmu-check");
    });
    $("#left-menu-sensitive-words").bind("click", () => {
        SELF.nav("sensitive-words");
    });
    $("#left-menu-video-theme").bind("click", () => {
        SELF.nav("video-theme");
    });
    $("#left-menu-video-album").bind("click", () => {
        SELF.nav("video-album");
    });
    $("#left-menu-video-comment").bind("click", () => {
        SELF.nav("video-comment");
    });
    $("#left-menu-video-check").bind("click", () => {
        SELF.nav("video-check");
    });
    $("#left-menu-video-check-view").bind("click", () => {
        SELF.nav("video-check-view");
    });
    $("#left-menu-speaker").bind("click", () => {
        SELF.nav("speaker");
    });
    $("#left-menu-admin-speaker").bind("click", () => {
        SELF.nav("admin-speaker");
    });
    $("#left-menu-guest").bind("click", () => {
        SELF.nav("guest");
    });
    $("#left-menu-activity-template").bind("click", () => {
        SELF.nav("activity-template");
    });
    $("#left-menu-activity-publish").bind("click", () => {
        SELF.nav("activity-publish");
    });
    $("#left-menu-activity-type").bind("click", () => {
        SELF.nav("activity-type");
    });
    $("#left-menu-activity-theme").bind("click", () => {
        SELF.nav("activity-theme");
    });
    $("#left-menu-activity-apply").bind("click", () => {
        SELF.nav("activity-apply");
    });
    $("#left-menu-live").bind("click", () => {
        SELF.nav("live");
    });
    $("#left-menu-activity").bind("click", () => {
        SELF.nav("activity");
    });
    $("#left-menu-activity-join").bind("click", () => {
        SELF.nav("activity-join");
    });
    $("#left-menu-activity-comment").bind("click", () => {
        SELF.publish("activity-comment");
    });
    $("#left-menu-activity-report").bind("click", () => {
        SELF.nav("activity-report");
    });
    $("#left-menu-product-type").bind("click", () => {
        SELF.nav("product-type");
    });
    $("#left-menu-product").bind("click", () => {
        SELF.nav("product");
    });
    $("#left-menu-order").bind("click", () => {
        SELF.nav("order");
    });
    $("#left-menu-shipping-method").bind("click", () => {
        SELF.nav("shipping-method");
    });
    $("#left-menu-user-info").bind("click", () => {
        SELF.nav("user-info");
    });
    $("#left-menu-task-type").bind("click", () => {
        SELF.nav("task-type");
    });
    $("#left-menu-task").bind("click", () => {
        SELF.nav("task");
    });
    $("#left-menu-task-join").bind("click", () => {
        SELF.nav("task-join");
    });
    $("#left-menu-advertisement").bind("click", () => {
        SELF.nav("advertisement");
    });
    $("#left-menu-cooperation").bind("click", () => {
        SELF.nav("cooperation");
    });
    $("#left-menu-knowhow").bind("click", () => {
        SELF.nav("knowhow");
    });
    $("#left-menu-friendship-link").bind("click", () => {
        SELF.nav("friendship-link");
    });
    $("#left-menu-about").bind("click", () => {
        SELF.nav("about");
    });
    $("#left-menu-donation").bind("click", () => {
        SELF.nav("donation");
    });
    $("#left-menu-policy").bind("click", () => {
        SELF.nav("policy");
    });
    $("#left-menu-QuestionAndAnswer").bind("click", () => {
        SELF.nav("QuestionAndAnswer");
    });
    $("#left-menu-video-donation-statistics").bind("click", () => {
        SELF.nav("video-donation");
    });
    $("#left-menu-actity-join-statistics").bind("click", () => {
        SELF.nav("actity-join-statistics");
    });
    $("#left-menu-publicity").bind("click", () => {
        SELF.nav("publicity");
    });
    $("#left-menu-score-config").bind("click", () => {
        SELF.nav("score-config");
    });
    
//    const getModuleByName = (modules, name) => {
//        const len = modules.length;
//        for (let i = 0; i < len; i++) {
//            let module = modules[i];
//            if (module["name"] === name) {
//                return module;
//            }
//        }
//        return null;
//    }, createModules = (modules) => {
//        const videoTypeModule = getModuleByName(modules, "video-type"),
//                videoAlbumModule = getModuleByName(modules, "video-album"),
//                videoThemeModule = getModuleByName(modules, "video-theme"),
//                activityTypeModule = getModuleByName(modules, "activity-type"),
//                activityThemeModule = getModuleByName(modules, "activity-theme"),
//                avderModule = getModuleByName(modules, "advertisement"),
//                sensitiveWordsModule = getModuleByName(modules, "sensitive-words"),
//                knowhowModule = getModuleByName(modules, "knowhow"),
//                systemUserModule = getModuleByName(modules, "system-user"),
//                roleModule = getModuleByName(modules, "role"),
//                scoreConfigModule = getModuleByName(modules, "score-config"),
//                activityPublishModule = getModuleByName(modules, "activity-publish"),
//                activiyListModule = getModuleByName(modules, "activity"),
//                activityJoinModule = getModuleByName(modules, "activity-join"),
//                activityJoinStatisticsModule = getModuleByName(modules, "actity-join-statistics"),
//                activityReportModule = getModuleByName(modules, "activity-report"),
//                activityCommentCheckModule = getModuleByName(modules, "activity-comment-check"),
//                videoPublishModule = getModuleByName(modules, "video-publish"),
//                videoModule = getModuleByName(modules, "video"),
//                videoCheckModule = getModuleByName(modules, "video-check"),
//                videoCommentCheckModule = getModuleByName(modules, "video-comment-check"),
//                userInfoModule = getModuleByName(modules, "user-info"),
//                userCountModule = getModuleByName(modules, "user-count"),
//                adminSpeakerModule = getModuleByName(modules, "admin-speaker"),
//                speakerModule = getModuleByName(modules, "speaker"),
//                activityApplyModule = getModuleByName(modules, "activity-apply"),
//                publicityModule = getModuleByName(modules, "publicity");
//        if (videoTypeModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-video-type">视频分类管理</a></dd>`);
//            $("#left-menu-video-type").bind("click", () => {
//                SELF.nav("video-type");
//            });
//        }
//        if (videoAlbumModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-video-album">视频专辑管理</a></dd>`);
//            $("#left-menu-video-album").bind("click", () => {
//                SELF.nav("video-album");
//            });
//        }
//        if (videoThemeModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-video-theme">视频主题管理</a></dd>`);
//            $("#left-menu-video-theme").bind("click", () => {
//                SELF.nav("video-theme");
//            });
//        }
//        if (activityTypeModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-activity-type">活动分类管理</a></dd>`);
//            $("#left-menu-activity-type").bind("click", () => {
//                SELF.nav("activity-type");
//            });
//        }
//        if (activityThemeModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-activity-theme">活动主题管理</a></dd>`);
//            $("#left-menu-activity-theme").bind("click", () => {
//                SELF.nav("activity-theme");
//            });
//        }
//        if (avderModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-advertisement">轮播管理</a></dd>`);
//            $("#left-menu-advertisement").bind("click", () => {
//                SELF.nav("advertisement");
//            });
//        }
//        if (sensitiveWordsModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-sensitive-words">敏感词汇管理</a></dd>`);
//            $("#left-menu-sensitive-words").bind("click", () => {
//                SELF.nav("sensitive-words");
//            });
//        }
//        if (knowhowModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-knowhow">关于self</a></dd>`);
//            $("#left-menu-knowhow").bind("click", () => {
//                SELF.nav("knowhow");
//            });
//        }
//        if (systemUserModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-system-user">系统用户管理</a></dd>`);
//            $("#left-menu-system-user").bind("click", () => {
//                SELF.nav("system-admin");
//            });
//        }
//        if (roleModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-role">角色管理</a></dd>`);
//            $("#left-menu-role").bind("click", () => {
//                SELF.nav("system-role");
//            });
//        }
//        if (scoreConfigModule !== null) {
//            $("#left-menu-group-system > dl").append(`<dd><a href="javascript:;" id="left-menu-score-config">积分规则配置</a></dd>`);
//            $("#left-menu-score-config").bind("click", () => {
//                SELF.nav("score-config");
//            });
//        }
//        if (activityPublishModule !== null) {
//            $("#left-menu-group-activity > dl").append(`<dd><a href="javascript:;" id="left-menu-activity-publish">活动发布</a></dd>`);
//            $("#left-menu-activity-publish").bind("click", () => {
//                SELF.nav("activity-publish");
//            });
//        }
//        if (activiyListModule !== null) {
//            $("#left-menu-group-activity > dl").append(`<dd><a href="javascript:;" id="left-menu-activity">活动管理</a></dd>`);
//            $("#left-menu-activity").bind("click", () => {
//                SELF.nav("activity");
//            });
//        }
//        if (activityJoinModule !== null) {
//            $("#left-menu-group-activity > dl").append(`<dd><a href="javascript:;" id="left-menu-activity-join">报名管理</a></dd>`);
//            $("#left-menu-activity-join").bind("click", () => {
//                SELF.nav("activity-join");
//            });
//        }
//        if (activityJoinStatisticsModule !== null) {
//            $("#left-menu-group-activity > dl").append(`<dd><a href="javascript:;" id="left-menu-actity-join-statistics">报名人员统计</a></dd>`);
//            $("#left-menu-actity-join-statistics").bind("click", () => {
//                SELF.nav("actity-join-statistics");
//            });
//        }
//        if (activityReportModule !== null) {
//            $("#left-menu-group-activity > dl").append(`<dd><a href="javascript:;" id="left-menu-activity-report">活动报道管理</a></dd>`);
//            $("#left-menu-activity-report").bind("click", () => {
//                SELF.nav("activity-report");
//            });
//        }
//        if (activityCommentCheckModule !== null) {
//            $("#left-menu-group-activity > dl").append(`<dd><a href="javascript:;" id="left-menu-activity-comment-check">活动评论审核</a></dd>`);
//            $("#left-menu-activity-comment-check").bind("click", () => {
//                SELF.nav("activity-comment-check");
//            });
//        }
//        if (videoPublishModule !== null) {
//            $("#left-menu-group-video > dl").append(`<dd><a href="javascript:;" id="left-menu-video-publish">视频发布</a></dd>`);
//            $("#left-menu-video-publish").bind("click", () => {
//                SELF.nav("video-upload");
//            });
//        }
//        if (videoModule !== null) {
//            $("#left-menu-group-video > dl").append(`<dd><a href="javascript:;" id="left-menu-video">视频管理</a></dd>`);
//            $("#left-menu-video").bind("click", () => {
//                SELF.nav("video");
//            });
//        }
//        if (videoCheckModule !== null) {
//            $("#left-menu-group-video > dl").append(`<dd><a href="javascript:;" id="left-menu-video-check">视频审核</a></dd>`);
//            $("#left-menu-video-check").bind("click", () => {
//                SELF.nav("video-check");
//            });
//        }
//        if (videoCommentCheckModule !== null) {
//            $("#left-menu-group-video > dl").append(`<dd><a href="javascript:;" id="left-menu-video-comment-check">视频评论审核</a></dd>`);
//            $("#left-menu-video-comment-check").bind("click", () => {
//                SELF.nav("video-comment-check");
//            });
//        }
//        if (userInfoModule !== null) {
//            $("#left-menu-group-Audience > dl").append(`<dd><a href="javascript:;" id="left-menu-user-info">观众管理</a></dd>`);
//            $("#left-menu-user-info").bind("click", () => {
//                SELF.nav("user-info");
//            });
//        }
//        if (userCountModule !== null) {
//            $("#left-menu-group-Audience > dl").append(`<dd><a href="javascript:;" id="left-menu-user-count">参与情况统计</a></dd>`);
//            $("#left-menu-user-count").bind("click", () => {
//                SELF.nav("user-count");
//            });
//        }
//        if (adminSpeakerModule !== null) {
//            $("#left-menu-group-speaker > dl").append(`<dd><a href="javascript:;" id="left-menu-admin-speaker">演讲者管理</a></dd>`);
//            $("#left-menu-admin-speaker").bind("click", () => {
//                SELF.nav("admin-speaker");
//            });
//        }
//        if (speakerModule !== null) {
//            $("#left-menu-group-speaker > dl").append(`<dd><a href="javascript:;" id="left-menu-speaker">演讲者推荐管理</a></dd>`);
//            $("#left-menu-speaker").bind("click", () => {
//                SELF.nav("speaker");
//            });
//        }
//        if (activityApplyModule !== null) {
//            $("#left-menu-group-self > dl").append(`<dd><a href="javascript:;" id="left-menu-activity-apply">self+审核</a></dd>`);
//            $("#left-menu-activity-apply").bind("click", () => {
//                SELF.nav("activity-apply");
//            });
//        }
//        if (publicityModule !== null) {
//            $("#left-menu-group-self > dl").append(`<dd><a href="javascript:;" id="left-menu-publicity">SELF+公示</a></dd>`);
//            $("#left-menu-publicity").bind("click", () => {
//                SELF.nav("publicity");
//            });
//        }
//    }, requestModules = userId => {
//        return new window.Promise((resolve, reject) => {
//            const xhr = new window.XMLHttpRequest();
//            xhr.onloadstart = () => SELF.startLoadAnimation();
//            xhr.onloadend = () => SELF.stopLoadAnimation();
//            xhr.onload = () => {
//                if (xhr.status === 200) {
//                    resolve(xhr.response);
//                } else {
//                    reject(xhr.status);
//                }
//            };
//            xhr.onerror = (evt) => {
//                reject("error");
//            };
//            xhr.open("GET", `/admin/modules/users/${userId}`);
//            xhr.responseType = "json";
//            xhr.setRequestHeader("Accept", "application/json");
//            xhr.send();
//        });
//    }, loadModules = userId => {
//        requestModules(userId).then(modules => {
//            createModules(modules);
//            layuiElement.render("nav");
//        }, error => {
//            SELF.errorHandler(error);
//        });
//    };
//    
//    loadModules(5);
})(this, $, layer, layui.element, SELF);