package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.Activity;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 李成志
 */
public interface ActivityMapper {

    /*活动首页625*/
    List<Activity> complexSearch(Activity activity);

    /**
     * 新增活动
     *
     * @param activity 活动
     */
    void insertActivity(Activity activity);

    /**
     * 修改活动
     *
     * @param activity 活动
     */
    void updateActivityById(Activity activity);

    void copyActivity(Activity activity);

    /**
     * 通过id查看活动
     *
     * @param id 活动id
     *
     * @return
     */
    Activity findById(@Param("id") Long id);

    /**
     * 根据条件查询所符合条件的活动一览
     *
     * @param activity
     * @return
     */
    List<Activity> selectActivityList(@Param("activity") Activity activity, @Param("joinning") Boolean joinning, @Param("over") Boolean over);

    List<Activity> findByAll();

    /**
     * 查询所有的活动
     *
     * @return
     */
    List<Activity> findActivityAll(Activity activity);

    List<Activity> newestActivity();

    List<Activity> pastActivity();

//    最新和最热
    List<Activity> selectByTime();

    List<Activity> selectByFee();

//    直播活动首页123
    List<Activity> selectFutureLive();

    List<Activity> selectLiving();

    List<Activity> selectPastLive();

//    通过id查询直播活动
    Activity selectLiveById(Long id);

//    self+往期活动
    List<Activity> selectPastSelf(Activity activity);
    
}
