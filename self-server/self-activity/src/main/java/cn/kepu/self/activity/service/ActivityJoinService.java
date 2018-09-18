package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.ActivityDao;
import cn.kepu.self.activity.dao.ActivityJoinDAO;
import cn.kepu.self.activity.entity.ActivityJoin;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public enum ActivityJoinService {
    INSTANCE;

    private ActivityJoinService() {}

    public static ActivityJoinService getInstance() {
        return INSTANCE;
    }

    private ActivityDao activityDao;
    private ActivityJoinDAO activityJoinDAO;

    public void setActivityJoinDAO(ActivityJoinDAO activityJoinDAO) {
        this.activityJoinDAO = activityJoinDAO;
    }

    public void setActivityDao(ActivityDao activityDao) {
        this.activityDao = activityDao;
    }

    /* 我参加过的活动*/
    public BinaryPair<List<ActivityJoin>, Long> myActivity(Long activityId, int offset, int pageSize) {
        return activityJoinDAO.myActivity(activityId, offset, pageSize);
    }

}
