package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.ActivityInfoDao;
import cn.kepu.self.activity.entity.ActivityInfo;

/**
 *
 * @author 李成志
 */
public enum ActivityInfoService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ActivityInfoService() {}

    public static ActivityInfoService getInstance() {
        return INSTANCE;
    }

    private ActivityInfoDao activityInfoDao;

    public void setActivityInfoDao(ActivityInfoDao activityInfoDao) {
        this.activityInfoDao = activityInfoDao;
    }
    
    public ActivityInfo getActivityInfo(Long id) {
        return activityInfoDao.getActivityInfo(id);
    }
    
}
