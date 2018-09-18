package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.ActivityThemeDao;
import cn.kepu.self.activity.entity.ActivityTheme;
import cn.kepu.self.activity.mybatis.mapper.ActivityThemeMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 劉一童
 */
public class ActivityThemeDaoImpl implements ActivityThemeDao {

    private final ActivityThemeMapper activityThemeMapper;

    public ActivityThemeDaoImpl(ActivityThemeMapper activityThemeMapper) {
        this.activityThemeMapper = activityThemeMapper;
    }

    @Override
    public boolean addActivityTheme(ActivityTheme activityTheme) {
        try {
            activityThemeMapper.insertActivityTheme(activityTheme);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean deleteActivityTheme(Long id) {
        try {
            activityThemeMapper.deleteActivityTheme(id);
        } catch (final DataIntegrityViolationException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean updateActivityTheme(ActivityTheme activityTheme) {
        try {
            activityThemeMapper.updateActivityTheme(activityTheme);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public BinaryPair<List<ActivityTheme>, Long> getActivityThemeList(int offset, int pageSize, String name) {
        PageHelper.offsetPage(offset, pageSize);

        List<ActivityTheme> list = activityThemeMapper.selectActivityTheme(name);

        PageInfo<ActivityTheme> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityTheme>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public ActivityTheme getActivityTheme(Long id) {
        return activityThemeMapper.selectById(id);
    }

}
