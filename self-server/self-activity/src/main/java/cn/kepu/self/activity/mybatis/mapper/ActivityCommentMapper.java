package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.ActivityComment;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ActivityCommentMapper {

    /**
     * 新增活动评论
     *
     * @param activityComment 活动评论
     */
    void insertActivityComment(ActivityComment activityComment);

    /**
     * 删除活动评论
     *
     * @param id 活动评论id
     * @return 删除结果。0:成功，2：其他错误
     */
    int deleteActivityComment(Long id);

    /**
     * 查询所有的活动评论
     *
     * @param activityComment
     * @return
     */
    List<ActivityComment> findActivityCommentAll(ActivityComment activityComment);

    //    后台审核
    List<ActivityComment> adminLiveComment(ActivityComment activityComment);
    List<ActivityComment> adminComment(ActivityComment activityComment);

    int adminChangeComment(Long id);
}
