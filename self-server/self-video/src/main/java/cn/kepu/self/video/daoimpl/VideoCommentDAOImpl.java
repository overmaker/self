package cn.kepu.self.video.daoimpl;

import cn.kepu.self.commons.entity.EchartData;
import cn.kepu.self.commons.entity.Series;
import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoCommentDAO;
import cn.kepu.self.video.entity.VideoComment;
import cn.kepu.self.video.mybatis.mapper.VideoCommentMapper;
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
public class VideoCommentDAOImpl implements VideoCommentDAO {

    private final VideoCommentMapper videoCommentMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public VideoCommentDAOImpl(
            VideoCommentMapper videoCommentMapper,
            JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.videoCommentMapper = videoCommentMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public void addVideoComment(VideoComment videoComment) {
        final Long videoId = videoComment.getVideo().getId();
        transactionTemplate.execute(status -> {
            try {
                videoCommentMapper.insertVideoComment(videoComment);
                jdbcTemplate.update("UPDATE kepu_self_video_info SET comment_num = (SELECT COUNT(*) FROM kepu_self_video_comment WHERE video=?) WHERE id=?", videoId, videoId);
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });

    }

    @Override
    public int delVideoComment(Long id) {
        try {
            videoCommentMapper.deleteVideoComment(id);
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public BinaryPair<List<VideoComment>, Long> selectVideoComment(int offset, int pageSize, VideoComment videoComment) {
        PageHelper.offsetPage(offset, pageSize);
        List<VideoComment> list = videoCommentMapper.selectVideoComment(videoComment);

        PageInfo<VideoComment> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoComment>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }

    @Override
    public Long selVideoCommentCount(Long videoId) {
        return videoCommentMapper.selectVideoCommentCount(videoId);
    }

//    后台审核
    @Override
    public BinaryPair<List<VideoComment>, Long> adminVideoComment(int offset, int pageSize, VideoComment videoComment) {
        PageHelper.offsetPage(offset, pageSize);
        List<VideoComment> list = videoCommentMapper.adminVideoComment(videoComment);

        PageInfo<VideoComment> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoComment>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }

    @Override
    public BinaryPair<List<VideoComment>, Long> adminComment(int offset, int pageSize, VideoComment videoComment) {
        PageHelper.offsetPage(offset, pageSize);
        List<VideoComment> list = videoCommentMapper.adminComment(videoComment);

        PageInfo<VideoComment> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoComment>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }

    @Override
    public int adminChangeComment(Long id) {
        try {
            videoCommentMapper.adminChangeComment(id);
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    //    参与情况统计1-点击量
    public BinaryPair<List<VideoComment>, Long> count2() {
        List<VideoComment> list = videoCommentMapper.count2();
        PageInfo<VideoComment> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoComment>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    //    参与情况统计3-柱状图
    @Override
    public EchartData count20() {
        List<String> category = new ArrayList<String>();
        List<Integer> serisData = new ArrayList<Integer>();
        List<VideoComment> list = videoCommentMapper.count2();
        for (VideoComment videoComment1 : list) {
            category.add(videoComment1.getUser().getUserName());
            serisData.add(videoComment1.getVideo().getCommentNum());
        }
        List<String> legend = new ArrayList<String>(Arrays.asList(new String[]{"费用比较"}));// 数据分组
        List<Series> series = new ArrayList<Series>();// 纵坐标
        series.add(new Series("活动参与统计", "bar", serisData));
        EchartData data = new EchartData(legend, category, series);

        return data;
    }

    //    视屏评论详情页
    @Override
    public BinaryPair<List<VideoComment>, Long> adminCommentView(Long id) {
        List<VideoComment> list = videoCommentMapper.adminCommentView(id);

        PageInfo<VideoComment> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoComment>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }
    //    视屏评论详情页1

    @Override
    public BinaryPair<List<VideoComment>, Long> adminCommentView1(Long id) {
        List<VideoComment> list = videoCommentMapper.adminCommentView1(id);

        PageInfo<VideoComment> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoComment>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }
    //    视屏评论详情页2

    @Override
    public BinaryPair<List<VideoComment>, Long> adminCommentView2(Long id) {
        List<VideoComment> list = videoCommentMapper.adminCommentView2(id);

        PageInfo<VideoComment> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoComment>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }
}
