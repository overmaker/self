package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.ActivityApplyDao;
import cn.kepu.self.activity.entity.ActivityApply;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum ActivityApplyService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ActivityApplyService() {}

    public static ActivityApplyService getInstance() {
        return INSTANCE;
    }

    private ActivityApplyDao activityApplyDao;

    public void setActivityApplyDao(ActivityApplyDao activityApplyDao) {
        this.activityApplyDao = activityApplyDao;
    }

    public void addActivityApply(ActivityApply activityApply) {
        activityApplyDao.addActivityApply(activityApply);
    }
    
    public void updateActivityApply(Long id, Integer status) {
        activityApplyDao.updateActivityApply(id, status);
    }
    
    public ActivityApply findById(Long id) {
        return activityApplyDao.findById(id);
    }
    
    public BinaryPair<List<ActivityApply>, Long> selectActivityApply(String name, int offset, int pageSize){
        return activityApplyDao.selectActivityApply(name, offset, pageSize);
    }
}
