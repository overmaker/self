package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.ActivityTemplateDAO;
import cn.kepu.self.activity.entity.ActivityTemplate;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 * 活动模板
 *
 * @author 周林敏
 */
public enum ActivityTemplateService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ActivityTemplateService() {
    }

    public static ActivityTemplateService getInstance() {
        return INSTANCE;
    }

    private ActivityTemplateDAO activityTemplateDAO;

    public void setActivityTemplateDAO(ActivityTemplateDAO activityTemplateDAO) {
        this.activityTemplateDAO = activityTemplateDAO;
    }

    /**
     * 新增活动模板
     *
     * @param activityTemplate
     */
    public void insertActivityTemplate(ActivityTemplate activityTemplate) {
        activityTemplateDAO.insertActivityTemplate(activityTemplate);
    }

    /**
     * 删除活动模板
     *
     * @param id 主键
     */
    public int deleteActivityTemplate(Long id) {
        activityTemplateDAO.deleteActivityTemplate(id);
        return 0;
    }
     /**
     * 通过id查找活动模板
     *
     * @param id 主键
     * @return 
     */
    public ActivityTemplate findById(Long id) {
       return  activityTemplateDAO.findById(id);
    }

    /**
     * 修改活动模板
     *
     * @param activityTemplate
     */
    public void updateActivityTemplate(ActivityTemplate activityTemplate) {
        activityTemplateDAO.updateActivityTemplate(activityTemplate);
    }

    /**
     * 查询活动模板
     *
     * @return
     */
    public BinaryPair<List<ActivityTemplate>, Long> searchActivityTemplate(String name, int offset, int pageSize) {
        return activityTemplateDAO.searchActivityTemplate(name, offset, pageSize);
    }
}
