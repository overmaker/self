package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.ActivityJoin;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface ActivityJoinMapper {

    /* 我参加过的活动*/
    List<ActivityJoin> myActivity(Long activityId);
}
