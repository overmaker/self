package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.ActivityTheme;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface ActivityThemeDao {

    boolean addActivityTheme(ActivityTheme activityTheme);

    boolean deleteActivityTheme(Long id);

    boolean updateActivityTheme(ActivityTheme activityTheme);

    BinaryPair<List<ActivityTheme>, Long> getActivityThemeList(int offset, int pageSize, String name);

    ActivityTheme getActivityTheme(Long id);
}
