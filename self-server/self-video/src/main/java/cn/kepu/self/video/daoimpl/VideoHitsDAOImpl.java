package cn.kepu.self.video.daoimpl;

import cn.kepu.self.commons.entity.EchartData;
import cn.kepu.self.commons.entity.Series;
import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoHitsDAO;
import cn.kepu.self.video.entity.VideoHits;
import cn.kepu.self.video.mybatis.mapper.VideoHitsMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * 视频评论
 *
 * @author 马亚星
 */
public class VideoHitsDAOImpl implements VideoHitsDAO {

    private final VideoHitsMapper videoHitsMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public VideoHitsDAOImpl(
            VideoHitsMapper videoHitsMapper,
            JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.videoHitsMapper = videoHitsMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public void addVideoHits(VideoHits videoHits) {
        final Long videoId = videoHits.getVideo().getId();
        transactionTemplate.execute(status -> {
            try {
                videoHitsMapper.insertVideoHits(videoHits);
                jdbcTemplate.update("UPDATE kepu_self_video_info SET hits_num = (SELECT COUNT(*) FROM kepu_self_video_hits WHERE video=?),gmt_modified=now() WHERE id=?", videoId, videoId);
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });

    }

    @Override
    public Long selVideoHitsCount(Long videoId) {
        return videoHitsMapper.selectVideoHitsCount(videoId);
    }

    //    参与情况统计1-点击量
    public BinaryPair<List<VideoHits>, Long> count1() {
        List<VideoHits> list = videoHitsMapper.count1();
        PageInfo<VideoHits> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoHits>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    //    参与情况统计1-柱状图
    @Override
    public EchartData count10() {
        List<String> category = new ArrayList<String>();
        List<Integer> serisData = new ArrayList<Integer>();
        List<VideoHits> list = videoHitsMapper.count1();
        for (VideoHits videoHits1 : list) {
            category.add(videoHits1.getUser().getUserName());
            serisData.add(videoHits1.getVideo().getHitsNum());
        }
        List<String> legend = new ArrayList<String>(Arrays.asList(new String[]{"费用比较"}));// 数据分组
        List<Series> series = new ArrayList<Series>();// 纵坐标
        series.add(new Series("活动参与统计", "bar", serisData));
        EchartData data = new EchartData(legend, category, series);

        return data;
    }

    @Override
    /**
     * 我观看过的视频
     *
     *
     * @param userId
     * @param offset
     * @param pageSize
     * @return
     */
    public BinaryPair<List<VideoHits>, Long> selectMyHits(Long userId, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<VideoHits> list = videoHitsMapper.selectMyHits(userId);
        PageInfo<VideoHits> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoHits>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
}
