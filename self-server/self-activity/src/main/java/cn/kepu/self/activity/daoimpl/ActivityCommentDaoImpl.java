package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.ActivityCommentDao;
import cn.kepu.self.activity.entity.ActivityComment;
import cn.kepu.self.activity.mybatis.mapper.ActivityCommentMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 *
 * @author 李成志
 */
public class ActivityCommentDaoImpl implements ActivityCommentDao {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private ActivityCommentMapper activityCommentMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public ActivityCommentDaoImpl(
            ActivityCommentMapper activityCommentMapper,
            JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.activityCommentMapper = activityCommentMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    public void setActivityCommentMapper(ActivityCommentMapper activityCommentMapper) {
        this.activityCommentMapper = activityCommentMapper;
    }

    @Override
    public void addActivityComment(ActivityComment activityComment) {
        final Long activityId = activityComment.getActivity().getId();
        transactionTemplate.execute(status -> {
            try {
                activityCommentMapper.insertActivityComment(activityComment);
//                jdbcTemplate.update("UPDATE kepu_self_activity_info SET comment_num = (SELECT COUNT(*) FROM kepu_self_activity_comment WHERE live=?) WHERE id=?", activityId, activityId);
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public int deleteActivityComment(Long id) {
        try {
            activityCommentMapper.deleteActivityComment(id);
        } catch (final Exception e) {
            return 2;
        }
        return 0;
    }

    @Override
    public BinaryPair<List<ActivityComment>, Long> selectActivityComment(int offset, int pageSize, ActivityComment activityComment) {
        PageHelper.offsetPage(offset, pageSize);
        List<ActivityComment> list = activityCommentMapper.findActivityCommentAll(activityComment);
        PageInfo<ActivityComment> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityComment>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }

    //    后台审核
    @Override
    public BinaryPair<List<ActivityComment>, Long> adminLiveComment(int offset, int pageSize, ActivityComment activityComment) {
        PageHelper.offsetPage(offset, pageSize);
        List<ActivityComment> list = activityCommentMapper.adminLiveComment(activityComment);

        PageInfo<ActivityComment> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityComment>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }

    @Override
    public int adminChangeComment(Long id) {
        try {
            activityCommentMapper.adminChangeComment(id);
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public BinaryPair<List<ActivityComment>, Long> adminComment(int offset, int pageSize, ActivityComment activityComment) {
        PageHelper.offsetPage(offset, pageSize);
        List<ActivityComment> list = activityCommentMapper.adminComment(activityComment);
        PageInfo<ActivityComment> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityComment>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }
}
