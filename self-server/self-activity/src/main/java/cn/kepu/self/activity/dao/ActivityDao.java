package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.Activity;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ActivityDao {

    /*活动首页625*/
    BinaryPair<List<Activity>, Long> complexSearch(int offset, int pageSize, Activity activity);

    /**
     * 新增活动
     *
     * @param activity 活动
     */
    void addActivity(Activity activity);

    /**
     * 从页面上修改活动，通过 {@link Activity#id} 来更新
     *
     * @param activity 活动
     */
    void updateActivityById(Activity activity);

    void copyActivity(Long id, String sn);

    /**
     * 通过id查看活动
     *
     * @param id 活动id
     *
     * @return
     */
    Activity findById(Long id);

    BinaryPair<List<Activity>, Long> findByAll();

    /**
     * 查询所有的活动
     *
     * @param title
     * @param offset
     * @param pageSize
     * @return
     */
    BinaryPair<List<Activity>, Long> selectActivity(Activity activity, int offset, int pageSize);

    BinaryPair<List<Activity>, Long> selectActivity(String title, int offset, int pageSize);

    List<Activity> newestActivity();

    List<Activity> pastActivity();

//    最新和最热
    List<Activity> TimeSearch();

    List<Activity> FeeSearch();

//    直播活动首页123
    BinaryPair<List<Activity>, Long> selectFutureLive();

    BinaryPair<List<Activity>, Long> selectLiving();

    BinaryPair<List<Activity>, Long> selectPastLive();

//   通过id查询直播活动
    Activity selectLiveById(Long id);

    /*  self+往期活动*/
    BinaryPair<List<Activity>, Long> selectPastSelf(Activity activity, int offset, int pageSize);

    BinaryPair<List<Activity>, Long> getActivityList(Activity activity, Boolean joinning, Boolean over, int offset, int pageSize);
    
}
