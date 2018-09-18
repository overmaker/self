package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.ActivityComment;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ActivityCommentDao {

    /**
     * 新增活动评论
     *
     * @param user 用户
     * @param activity 活动
     * @param comment 活动评论
     * @return 新增结果。0：成功，1：失败
     */
    void addActivityComment(ActivityComment activityComment);

    /**
     * 删除活动评论
     *
     * @param id 活动评论id
     * @return 删除结果。0:成功，2：其他错误
     */
    int deleteActivityComment(Long id);

    /**
     * 查询所有的活动分类
     *
     * @param activityTitle
     * @param offset
     * @param pageSize
     * @return
     */
    BinaryPair<List<ActivityComment>, Long> selectActivityComment(int offset, int pageSize, ActivityComment activityComment);

    //    后台审核
    BinaryPair<List<ActivityComment>, Long> adminLiveComment(int offset, int pageSize, ActivityComment activityComment);

    int adminChangeComment(Long id);

    BinaryPair<List<ActivityComment>, Long> adminComment(int offset, int pageSize, ActivityComment activityComment);
}
