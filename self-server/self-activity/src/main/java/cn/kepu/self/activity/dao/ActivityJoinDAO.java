package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.ActivityJoin;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface ActivityJoinDAO {


    /* 我参加过的活动*/
    BinaryPair<List<ActivityJoin>, Long> myActivity(Long activityId, int offset, int pageSize);
}
