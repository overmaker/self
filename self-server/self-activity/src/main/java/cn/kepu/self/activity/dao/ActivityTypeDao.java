package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.ActivityType;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ActivityTypeDao {

    /**
     * 新增活动分类
     *
     * @param name 活动分类名称
     * @return
     */
    boolean addActivityType(String name);

    /**
     * 修改活动分类
     *
     * @param name 活动分类名称
     * @param id 活动分类id
     * @return
     */
    boolean updateActivityType(String name, Long id);

    /**
     * 删除活动分类
     *
     * @param id 活动id
     */
    boolean deleteActivityType(Long id);

    /**
     * 查询所有的活动分类
     *
     * @param name
     * @param offset
     * @param pageSize
     * @return
     */
    BinaryPair<List<ActivityType>, Long> selectActivityType(ActivityType activityType, int offset, int pageSize);
    
    BinaryPair<List<ActivityType>, Long> getList(String name, int offset, int pageSize);
}
