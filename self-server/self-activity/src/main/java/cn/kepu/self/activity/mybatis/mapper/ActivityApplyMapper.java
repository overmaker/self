package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.ActivityApply;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ActivityApplyMapper {
    /**
     * 新增活动申请
     * @param activityApply 活动申请
     * @return 新增结果。0：成功，1：失败
     */
    int insertActivityApply(ActivityApply activityApply);
    
    /**
     * 修改活动申请
     * @param id 活动申请id
     * @param status 活动申请状态
     * @return 新增结果。0：成功，1：失败
     */
    int updateActivityApply(Long id, Integer status);
    
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
    List<ActivityApply> selectActivityApplyAll(ActivityApply activityApply);
}
