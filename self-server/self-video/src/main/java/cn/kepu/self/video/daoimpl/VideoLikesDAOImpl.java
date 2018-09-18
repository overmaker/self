package cn.kepu.self.video.daoimpl;

import cn.kepu.self.video.dao.VideoLikesDAO;
import cn.kepu.self.video.entity.VideoLikes;
import cn.kepu.self.video.mybatis.mapper.VideoLikesMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * 视频点赞
 *
 * @author 马亚星
 */
public class VideoLikesDAOImpl implements VideoLikesDAO {

    private final VideoLikesMapper videoLikesMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public VideoLikesDAOImpl(
            VideoLikesMapper videoLikesMapper,
            JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.videoLikesMapper = videoLikesMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public void insertVideoLikes(VideoLikes videoLikes) {
        final Long videoId = videoLikes.getVideo();
        transactionTemplate.execute(status -> {
            try {
                videoLikesMapper.insertVideoLikes(videoLikes);
                
                jdbcTemplate.update("UPDATE kepu_self_video_info SET likes_num = (SELECT COUNT(*) FROM kepu_self_video_likes WHERE video=? AND roll=1) WHERE id=?", videoId, videoId);
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public VideoLikes selectByUserAndVideo(VideoLikes videoLikes) {
        return videoLikesMapper.selectByUserAndVideo(videoLikes);
    }
}
