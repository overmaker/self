package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.ActivityType;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 李成志
 */
public interface ActivityTypeMapper {

    /**
     * 新增活动分类
     *
     * @param name 活动分类名称
     */
    void insertActivityType(@Param("name") String name);

    /**
     * 修改活动分类
     *
     * @param name 活动分类名称
     * @param id 活动分类id
     */
    void updateActivityType(@Param("name") String name, @Param("id") Long id);

    /**
     * 删除活动分类
     *
     * @param id 活动id
     */
    void deleteActivityType(@Param("id") Long id);

    /**
     * 查询所有的活动分类
     *
     * @return
     */
    List<ActivityType> findActivityType(ActivityType activityType);

    List<ActivityType> selectAll(@Param("name") String name);
}
