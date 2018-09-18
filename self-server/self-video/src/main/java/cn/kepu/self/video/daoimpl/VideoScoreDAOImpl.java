package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoScoreDAO;
import cn.kepu.self.video.entity.VideoScore;
import cn.kepu.self.video.mybatis.mapper.VideoScoreMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * 视频评分
 *
 * @author 马亚星
 */
public class VideoScoreDAOImpl implements VideoScoreDAO {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private VideoScoreMapper videoScoreMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public VideoScoreDAOImpl(VideoScoreMapper videoScoreMapper, JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.videoScoreMapper = videoScoreMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    public void setVideoScoreMapper(VideoScoreMapper videoScoreMapper) {
        this.videoScoreMapper = videoScoreMapper;
    }

    @Override
    public void addVideoScore(Long user, Long video, int score) {
        transactionTemplate.execute(status -> {
            try {

                videoScoreMapper.insertVideoScore(user, video, score);
                jdbcTemplate.update("UPDATE kepu_self_video_info SET score=(SELECT avg(score)FROM kepu_self.kepu_self_video_score where video=" + video + ") where id=" + video + ";");
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public int delVideoScore(Long id) {
        try {
            videoScoreMapper.deleteVideoScore(id);
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public int upVideoScore(Long user, Long video, int score) {
        try {
            videoScoreMapper.updateVideoScore(user, video, score);
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public BinaryPair<List<VideoScore>, Long> selTJVideoScore(int offset, int pageSize, Long video) {
        PageHelper.offsetPage(offset, pageSize);
        List<VideoScore> list = videoScoreMapper.searchTJVideoScore(video);
        PageInfo<VideoScore> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoScore>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public Integer searVideoScore(Long user, Long video) {

        return videoScoreMapper.searVideoScore(user, video);
    }

}
