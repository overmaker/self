package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.ActivityJoinDAO;
import cn.kepu.self.activity.entity.ActivityJoin;
import cn.kepu.self.activity.mybatis.mapper.ActivityJoinMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public class ActivityJoinDAOImpl implements ActivityJoinDAO {

    private final ActivityJoinMapper activityJoinMapper;

    public ActivityJoinDAOImpl(ActivityJoinMapper activityJoinMapper) {
        this.activityJoinMapper = activityJoinMapper;
    }

    /* 我参加过的活动*/
    @Override
    public BinaryPair<List<ActivityJoin>, Long> myActivity(Long activityId, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<ActivityJoin> list = activityJoinMapper.myActivity(activityId);
        PageInfo<ActivityJoin> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityJoin>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
}
