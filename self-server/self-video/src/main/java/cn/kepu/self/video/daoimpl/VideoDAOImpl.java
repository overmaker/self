package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoDAO;
import cn.kepu.self.video.entity.Speaker;
import cn.kepu.self.video.entity.Video;
import cn.kepu.self.video.entity.VideoAlbum;
import cn.kepu.self.video.entity.VideoSearch;
import cn.kepu.self.video.entity.VideoTheme;
import cn.kepu.self.video.entity.VideoType;
import cn.kepu.self.video.mybatis.mapper.VideoInfoMapper;
import cn.kepu.self.video.mybatis.mapper.VideoMapper;
import cn.kepu.self.video.mybatis.mapper.VideoSpeakerRelationMapper;
import cn.kepu.self.video.mybatis.mapper.VideoThemeRelationMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * 视频管理
 *
 * @author 马亚星
 */
public class VideoDAOImpl implements VideoDAO {

    private final VideoMapper videoMapper;
    private final VideoInfoMapper videoInfoMapper;
    private final VideoThemeRelationMapper videoThemeRelationMapper;
    private final VideoSpeakerRelationMapper videoSpeakerRelationMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public VideoDAOImpl(VideoMapper videoMapper,
            VideoInfoMapper videoInfoMapper,
            VideoThemeRelationMapper videoThemeRelationMapper,
            VideoSpeakerRelationMapper videoSpeakerRelationMapper,
            JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.videoMapper = videoMapper;
        this.videoInfoMapper = videoInfoMapper;
        this.videoThemeRelationMapper = videoThemeRelationMapper;
        this.videoSpeakerRelationMapper = videoSpeakerRelationMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public void addVideo(Video video) {
        transactionTemplate.execute(status -> {
            try {
                videoMapper.insertVideo(video);
                videoInfoMapper.insertVideoInfo(video.getId());

                if (video.getThemes() != null) {
                    for (VideoTheme theme : video.getThemes()) {
                        videoMapper.insertVideoTheme(video, theme);
                    }
                }

                if (video.getSpeakers() != null) {
                    for (Speaker speaker : video.getSpeakers()) {
                        videoMapper.insertVideoSpeaker(video, speaker);
                    }
                }

                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public void copyVideo(Long id) {

        transactionTemplate.execute(status -> {
            final Video video = new Video();
            video.setId(id);
            try {
                videoMapper.copyVideo(video);
                jdbcTemplate.update("INSERT INTO kepu_self_video_info(id) VALUES(?)", video.getId());
                return (Void) null;
            } catch (final DataAccessException err) {
                status.setRollbackOnly();
                throw err;
            }
        });

    }

    @Override
    public void upVideo(Video video) {
        transactionTemplate.execute(status -> {
            try {
                videoMapper.updateVideo(video);

                if (video.getThemes() != null) {
                    videoMapper.clearVideoTheme(video);
                    for (VideoTheme theme : video.getThemes()) {
                        videoMapper.insertVideoTheme(video, theme);
                    }
                }

                if (video.getSpeakers() != null) {
                    videoMapper.clearVideoSpeaker(video);
                    for (Speaker speaker : video.getSpeakers()) {
                        videoMapper.insertVideoSpeaker(video, speaker);
                    }
                }

                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public void updateVideoCheck(Video video) {
        videoMapper.updateVideoCheck(video);
    }
//添加事物后台方便复制

    @Override
    public BinaryPair<List<Video>, Long> selVideo(int offset, int pageSize, String title, Boolean isVip, Boolean isRecommend, Boolean isEnable, Long type, Long album) {
        PageHelper.offsetPage(offset, pageSize);

        VideoAlbum va = new VideoAlbum();
        VideoType vt = new VideoType();

        va.setId(album);
        vt.setId(type);

        Video video = new Video();
        video.setTitle(title);
        if (isVip != null) {
            video.setVip(true);
        }
        if (isRecommend != null) {
            video.setRecommend(true);
        }
        if (isEnable != null) {
            video.setEnable(true);
        }
        video.setAlbum(va);
        video.setType(vt);

        List<Video> list = videoMapper.searchVideo(video);
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    /*微纪录*/
    @Override
    public BinaryPair<List<Video>, Long> selectMicro(int offset, int pageSize, Video video) {
        PageHelper.offsetPage(offset, pageSize);
        List<Video> list = videoMapper.selectMicro(video);
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    /*煮酒论道*/
    @Override
    public BinaryPair<List<Video>, Long> selectDao(int offset, int pageSize, Video video) {
        PageHelper.offsetPage(offset, pageSize);
        List<Video> list = videoMapper.selectDao(video);
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public Video selByIdVideo(Long id) {
        Video video = null;
        video = videoMapper.selectById(id);
        if (video.getActivityId() != null) {
            video = videoMapper.selectVideo(id);
        } else {
            video = videoMapper.selectByIdVideo(id);
        }
        List<VideoTheme> themes = videoThemeRelationMapper.selectByVideoId(id);
        video.setThemes(themes.toArray(new VideoTheme[0]));
        List<Speaker> speakers = videoSpeakerRelationMapper.selectByVideoId(id);
        video.setSpeakers(speakers.toArray(new Speaker[0]));
        return video;
    }

    @Override
    public BinaryPair<List<Video>, Long> complexSearch(VideoSearch videoSearch) {
        PageHelper.offsetPage(videoSearch.getOffset(), videoSearch.getCount());

        List<Video> list = videoMapper.complexSearch(videoSearch);

        PageInfo<Video> pageInfo = new PageInfo(list);
        long total = pageInfo.getTotal();

        list = list.stream().map(video -> {
            List<Speaker> speakers = videoSpeakerRelationMapper.selectByVideoId(video.getId());
            video.setSpeakers(speakers.toArray(new Speaker[0]));
            return video;
        }).collect(Collectors.toList());

        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(total);
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> advanceSearch(VideoSearch videoSearch) {
        PageHelper.offsetPage(videoSearch.getOffset(), videoSearch.getCount());
        
        List<Video> list = videoMapper.advanceSearch(videoSearch);

        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> TimeSearch(int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        
        List<Video> list = videoMapper.selectByTime();

        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> FeeSearch(int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        
        List<Video> list = videoMapper.selectByFee();

        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override

    public BinaryPair<List<Video>, Long> SameTimeSearch(Long id, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<Video> list = videoMapper.selectBySameTime(id);
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> selectBySpeaker(Long id) {
        List<Video> list = videoMapper.selectBySpeaker(id);
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> selectByActivity(Long id) {
        List<Video> list = videoMapper.selectByActivity(id);
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
    //后台视频审核

    @Override
    public BinaryPair<List<Video>, Long> selectByAdmin(Video video) {
        List<Video> list = videoMapper.selectByAdmin(video);
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

//    后台视频审核从新到旧排序
    @Override
    public BinaryPair<List<Video>, Long> selectByTime0() {
        List<Video> list = videoMapper.selectByTime0();
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    //     后台视频管理排序1-6
    @Override
    public BinaryPair<List<Video>, Long> selectByAdmin1() {
        List<Video> list = videoMapper.selectByAdmin1();
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> selectByAdmin2() {
        List<Video> list = videoMapper.selectByAdmin2();
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> selectByAdmin3() {
        List<Video> list = videoMapper.selectByAdmin3();
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> selectByAdmin4() {
        List<Video> list = videoMapper.selectByAdmin4();
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> selectByAdmin5() {
        List<Video> list = videoMapper.selectByAdmin5();
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Video>, Long> selectByAdmin6() {
        List<Video> list = videoMapper.selectByAdmin6();
        PageInfo<Video> pageInfo = new PageInfo(list);
        BinaryPair<List<Video>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    //    删除视频关系表1-10
    @Override
    public void delVideo(Long id) {
        transactionTemplate.execute(status -> {
            try {
                videoMapper.clearVideoTheme1(id);
                videoMapper.clearVideoSpeaker1(id);
                videoMapper.clearVideoComment(id);
                videoMapper.clearVideoDonation(id);
                videoMapper.clearVideoDanmu(id);
                videoMapper.clearVideoLikes(id);
                videoMapper.clearVideoHits(id);
                videoMapper.clearVideoScore(id);
                videoMapper.clearVideoInfo(id);
                videoMapper.clearVideo(id);
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }
}
