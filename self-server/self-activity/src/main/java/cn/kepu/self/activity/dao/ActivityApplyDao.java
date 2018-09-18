package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.ActivityApply;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ActivityApplyDao {

    void addActivityApply(ActivityApply activityApply);
    
    /**
     * 修改活动申请
     * @param id 活动申请id
     * @param status 活动申请状态
     */
    void updateActivityApply(Long id, Integer status);
    
    /**
     * 通过id查看活动申请
     * @param id 活动申请id
     * 
     * @return 
     */
    ActivityApply findById(Long id);
    
    /**
     * 查询所有的活动申请
     *
     * @return
     */
    BinaryPair<List<ActivityApply>, Long> selectActivityApply(String name, int offset, int pageSize);
}
