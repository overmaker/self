package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.ActivityThemeDao;
import cn.kepu.self.activity.entity.ActivityTheme;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public enum ActivityThemeService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ActivityThemeService() {}

    public static ActivityThemeService getInstance() {
        return INSTANCE;
    }

    private ActivityThemeDao activityThemeDao;

    public void setActivityThemeDao(ActivityThemeDao activityThemeDao) {
        this.activityThemeDao = activityThemeDao;
    }

    public int addActivityTheme(ActivityTheme activityTheme) {
        if (activityTheme == null || activityTheme.getName() == null || activityTheme.getName().trim().isEmpty()) {
            return 2;
        }
        if (activityThemeDao.addActivityTheme(activityTheme)) {
            return 0;
        }
        return 1;
    }

    public boolean deleteActivityTheme(Long id) {
        return activityThemeDao.deleteActivityTheme(id);
    }

    public int updateActivityTheme(ActivityTheme activityTheme) {
        if (activityTheme == null || activityTheme.getName() == null || activityTheme.getName().trim().isEmpty()) {
            return 2;
        }
        if (activityThemeDao.updateActivityTheme(activityTheme)) {
            return 0;
        }
        return 1;
    }

    public BinaryPair<List<ActivityTheme>, Long> getActivityThemeList(int offset, int pageSize, String name) {
        return activityThemeDao.getActivityThemeList(offset, pageSize, name);
    }

    public ActivityTheme getActivityTheme(Long id) {
        return activityThemeDao.getActivityTheme(id);
    }
}
