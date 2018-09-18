package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.ActivityTemplate;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public interface ActivityTemplateMapper {

    /**
     * 新增活动模板
     *
     * @param activityTemplate
     */
    void insertActivityTemplate(ActivityTemplate activityTemplate);

    /**
     * 删除活动模板
     *
     * @param id
     */
    void deleteActivityTemplate(Long id);

    /**
     * 修改活动模板
     *
     * @param activityTemplate
     */
    void updateActivityTemplate(ActivityTemplate activityTemplate);

    /**
     * 查找活动模板
     *
     * @param activityTemplate
     * @return
     */
    List<ActivityTemplate> searchActivityTemplate(ActivityTemplate activityTemplate);

    /**
     * 通过id查找活动模板
     *
     * @param id
     * @return
     */
    ActivityTemplate findById(Long id);
}
