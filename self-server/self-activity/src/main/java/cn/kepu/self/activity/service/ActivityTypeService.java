package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.ActivityTypeDao;
import cn.kepu.self.activity.entity.ActivityType;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum ActivityTypeService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ActivityTypeService() {}

    public static ActivityTypeService getInstance() {
        return INSTANCE;
    }

    private ActivityTypeDao activityTypeDao;

    public void setActivityTypeDao(ActivityTypeDao activityTypeDao) {
        this.activityTypeDao = activityTypeDao;
    }

    public int addActivityType(String name) {
        if (name == null || name.isEmpty()) {
            return 2;
        }
        if (activityTypeDao.addActivityType(name)) {
            return 0;
        }
        return 1;
    }

    public int updateActivityType(String name, Long id) {
        if (name == null || name.isEmpty()) {
            return 2;
        }
        if (activityTypeDao.updateActivityType(name, id)) {
            return 0;
        }
        return 1;
    }

    public boolean deleteActivityType(Long id) {
        return activityTypeDao.deleteActivityType(id);
    }

    public BinaryPair<List<ActivityType>, Long> selectActivityType(ActivityType activityType, int offset, int pageSize) {
        return activityTypeDao.selectActivityType(activityType, offset, pageSize);
    }

    public BinaryPair<List<ActivityType>, Long> getList(String name, int offset, int pageSize) {
        return activityTypeDao.getList(name, offset, pageSize);
    }
}
