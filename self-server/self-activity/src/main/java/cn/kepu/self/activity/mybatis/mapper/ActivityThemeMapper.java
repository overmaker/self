package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.ActivityTheme;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 劉一童
 */
public interface ActivityThemeMapper {

    void insertActivityTheme(ActivityTheme activityTheme);

    void deleteActivityTheme(@Param("id") Long id);

    void updateActivityTheme(ActivityTheme activityTheme);

    List<ActivityTheme> selectActivityTheme(@Param("name") String name);
    
    ActivityTheme selectById(@Param("id") Long id);
}
