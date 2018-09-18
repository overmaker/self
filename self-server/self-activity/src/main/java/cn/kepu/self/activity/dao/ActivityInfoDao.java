package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.ActivityInfo;

/**
 *
 * @author 李成志
 */
public interface ActivityInfoDao {
    
    /**
     * 更新活动报名数
     * @param id 活动id
     * @param num
     */
    void updateRollNum(Long id, Long num);
    
    ActivityInfo getActivityInfo(Long id);
}
