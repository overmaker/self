package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.ActivityTypeDao;
import cn.kepu.self.activity.entity.ActivityType;
import cn.kepu.self.activity.mybatis.mapper.ActivityTypeMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 李成志
 */
public class ActivityTypeDaoImpl implements ActivityTypeDao {

    private ActivityTypeMapper activityTypeMapper;

    public void setActivityTypeMapper(ActivityTypeMapper activityTypeMapper) {
        this.activityTypeMapper = activityTypeMapper;
    }

    @Override
    public boolean addActivityType(String name) {
        try {
            activityTypeMapper.insertActivityType(name);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean updateActivityType(String name, Long id) {
        try {
            activityTypeMapper.updateActivityType(name, id);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean deleteActivityType(Long id) {
        try {
            activityTypeMapper.deleteActivityType(id);
        } catch (final DataIntegrityViolationException e) {
            return false;
        }
        return true;
    }

    @Override
    public BinaryPair<List<ActivityType>, Long> selectActivityType(ActivityType activityType, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<ActivityType> list = activityTypeMapper.findActivityType(activityType);
        PageInfo<ActivityType> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityType>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<ActivityType>, Long> getList(String name, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<ActivityType> list = activityTypeMapper.selectAll(name);
        PageInfo<ActivityType> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityType>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
