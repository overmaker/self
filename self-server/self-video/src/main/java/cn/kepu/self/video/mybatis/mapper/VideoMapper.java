package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.Speaker;
import cn.kepu.self.video.entity.Video;
import cn.kepu.self.video.entity.VideoSearch;
import cn.kepu.self.video.entity.VideoTheme;
import java.util.List;

/**
 * 视频管理
 *
 * @author 马亚星
 */
public interface VideoMapper {

    /**
     * 新增视频
     *
     * @param video 视频
     */
    void insertVideo(Video video);

    void copyVideo(Video video);

    void insertVideoTheme(Video video, VideoTheme videoTheme);

    void insertVideoSpeaker(Video video, Speaker videoSpeaker);

    void clearVideoTheme(Video video);

    void clearVideoSpeaker(Video video);

    /**
     * 修改视频
     *
     * @param video 视频表
     * @return 修改结果。0：成功， 2：其他错误
     */
    int updateVideo(Video video);

    int updateVideoCheck(Video video);

    /**
     * 查询视频
     *
     * @param video
     * @return
     */
    List<Video> searchVideo(Video video);

    /*微纪录*/
    List<Video> selectMicro(Video video);

    /*煮酒论道*/
    List<Video> selectDao(Video video);

    List<Video> selectByTime();

    List<Video> selectBySameTime(Long id);

    List<Video> selectBySpeaker(Long id);

    List<Video> selectByFee();

    Video selectById(Long id);
    Video selectByIdVideo(Long id);
    Video selectVideo(Long id);

    List<Video> complexSearch(VideoSearch videoSearch);

    List<Video> advanceSearch(VideoSearch videoSearch);

    List<Video> selectByActivity(Long id);

//后台视频审核
    List<Video> selectByAdmin(Video video);

//    后台视频审核从新到旧排序
    List<Video> selectByTime0();

//     后台视频管理排序1-6
    List<Video> selectByAdmin1();

    List<Video> selectByAdmin2();

    List<Video> selectByAdmin3();

    List<Video> selectByAdmin4();

    List<Video> selectByAdmin5();

    List<Video> selectByAdmin6();

//    删除视频关系表1-10
    int clearVideoTheme1(Long id);

    int clearVideoSpeaker1(Long id);

    int clearVideoComment(Long id);

    int clearVideoDanmu(Long id);

    int clearVideoDonation(Long id);

    int clearVideoHits(Long id);

    int clearVideoLikes(Long id);

    int clearVideoScore(Long id);

    int clearVideoInfo(Long id);

    int clearVideo(Long id);
}
