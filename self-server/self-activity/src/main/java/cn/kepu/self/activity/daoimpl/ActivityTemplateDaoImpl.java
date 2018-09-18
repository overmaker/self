package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.ActivityTemplateDAO;
import cn.kepu.self.activity.entity.ActivityTemplate;
import cn.kepu.self.activity.mybatis.mapper.ActivityTemplateMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 *
 * @author 周林敏
 */
public class ActivityTemplateDaoImpl implements ActivityTemplateDAO {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private ActivityTemplateMapper activityTemplateMapper;

    public void setActivityTemplateMapper(ActivityTemplateMapper activityTemplateMapper) {
        this.activityTemplateMapper = activityTemplateMapper;
    }

    @Override
    public void insertActivityTemplate(ActivityTemplate activityTemplate) {
        activityTemplateMapper.insertActivityTemplate(activityTemplate);
    }

    @Override
    public void deleteActivityTemplate(Long id) {
        activityTemplateMapper.deleteActivityTemplate(id);
    }

    @Override
    public ActivityTemplate findById(Long id) {
        return activityTemplateMapper.findById(id);
    }

    @Override
    public void updateActivityTemplate(ActivityTemplate activityTemplate) {
        activityTemplateMapper.updateActivityTemplate(activityTemplate);
    }

    @Override
    public BinaryPair<List<ActivityTemplate>, Long> searchActivityTemplate(String name, int offset, int pageSize) {
        ActivityTemplate activityTemplate = new ActivityTemplate();
        activityTemplate.setName(name);

        PageHelper.offsetPage(offset, pageSize);
        List<ActivityTemplate> list = activityTemplateMapper.searchActivityTemplate(activityTemplate);
        PageInfo<ActivityTemplate> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityTemplate>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
