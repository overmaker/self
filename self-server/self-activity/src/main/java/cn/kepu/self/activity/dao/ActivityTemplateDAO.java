package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.ActivityTemplate;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public interface ActivityTemplateDAO {

    void insertActivityTemplate(ActivityTemplate activityTemplate);

    void deleteActivityTemplate(Long id);

    ActivityTemplate findById(Long id);

    void updateActivityTemplate(ActivityTemplate activityTemplate);

//    List searchActivityTemplate(ActivityTemplate activityTemplate);
    BinaryPair<List<ActivityTemplate>, Long> searchActivityTemplate(String name, int offset, int pageSize);
}
