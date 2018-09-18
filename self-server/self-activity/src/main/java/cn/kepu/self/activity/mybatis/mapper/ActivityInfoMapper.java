package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.ActivityInfo;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 李成志
 */
public interface ActivityInfoMapper {
    /**
     * 新增活动信息
     * @param activityInfo 活动信息
     */
    void insertActivityInfo(ActivityInfo activityInfo);

    void updateRollNum(@Param("id") Long id, @Param("num") Long num);
    
    ActivityInfo selectById(@Param("id") Long id);
}
