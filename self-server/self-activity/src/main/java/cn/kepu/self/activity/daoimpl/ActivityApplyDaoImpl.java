package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.ActivityApplyDao;
import cn.kepu.self.activity.entity.ActivityApply;
import cn.kepu.self.activity.mybatis.mapper.ActivityApplyMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

/**
 *
 * @author 李成志
 */
public class ActivityApplyDaoImpl implements ActivityApplyDao {

    private ActivityApplyMapper activityApplyMapper;

    public void setActivityApplyMapper(ActivityApplyMapper activityApplyMapper) {
        this.activityApplyMapper = activityApplyMapper;
    }

    @Override
    public void addActivityApply(ActivityApply activityApply) {
        activityApplyMapper.insertActivityApply(activityApply);
    }

    @Override
    public void updateActivityApply(Long id, Integer status) {
        ActivityApply activityApply = new ActivityApply();
        activityApply.setStatus(status);
        activityApplyMapper.updateActivityApply(id, status);
    }

    @Override
    public ActivityApply findById(Long id) {
        return activityApplyMapper.findById(id);
    }

    @Override
    public BinaryPair<List<ActivityApply>, Long> selectActivityApply(String name, int offset, int pageSize) {
        ActivityApply activityApply = new ActivityApply();
        activityApply.setName(name);
        
        PageHelper.offsetPage(offset, pageSize);
        List<ActivityApply> list = activityApplyMapper.selectActivityApplyAll(activityApply);
        PageInfo<ActivityApply> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityApply>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
