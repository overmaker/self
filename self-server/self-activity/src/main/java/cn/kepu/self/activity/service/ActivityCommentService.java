package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.ActivityCommentDao;
import cn.kepu.self.activity.entity.Activity;
import cn.kepu.self.activity.entity.ActivityComment;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum ActivityCommentService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ActivityCommentService() {
    }

    public static ActivityCommentService getInstance() {
        return INSTANCE;
    }

    private ActivityCommentDao activityCommentDao;

    public void setActivityCommentDao(ActivityCommentDao activityCommentDao) {
        this.activityCommentDao = activityCommentDao;
    }

    public void addActivityComment(ActivityComment activityComment) {
        activityCommentDao.addActivityComment(activityComment);
    }

    public int deleteActivityComment(Long id) {
        return activityCommentDao.deleteActivityComment(id);
    }

    public BinaryPair<List<ActivityComment>, Long> selectActivityComment(int offset, int pageSize, Long userId, Long activityId, String activityTitle, String comment) {
        ActivityComment activityComment = new ActivityComment();
        User user = new User();
        if (userId != null) {
            user.setId(userId);
        }
        activityComment.setUser(user);
        Activity activity = new Activity();
        if (activityId != null) {
            activity.setId(activityId);
        }
        if (activityTitle != null) {
            activity.setTitle(activityTitle);
        }
        activityComment.setActivity(activity);
        if (comment != null) {
            activityComment.setComment(comment);
        }
        return activityCommentDao.selectActivityComment(offset, pageSize, activityComment);
    }

    //    后台审核
    public BinaryPair<List<ActivityComment>, Long> adminLiveComment(int offset, int pageSize, Long userId, Long liveId, String liveTitle, String comment) {
        ActivityComment activityComment = new ActivityComment();
        User user = new User();
        if (userId != null) {
            user.setId(userId);
        }
        activityComment.setUser(user);
        Activity live = new Activity();
        if (liveId != null) {
            live.setId(liveId);
        }
        if (liveTitle != null) {
            live.setTitle(liveTitle);
        }
        activityComment.setComment(comment);
        if (comment != null) {
            activityComment.setComment(comment);
        }

        return activityCommentDao.adminLiveComment(offset, pageSize, activityComment);
    }

    public int adminChangeComment(Long id) {
        return activityCommentDao.adminChangeComment(id);
    }

    public BinaryPair<List<ActivityComment>, Long> adminComment(int offset, int pageSize, ActivityComment activityComment) {
        return activityCommentDao.adminComment(offset, pageSize, activityComment);
    }
}
