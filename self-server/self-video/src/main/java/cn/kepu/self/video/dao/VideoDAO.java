package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.Video;
import cn.kepu.self.video.entity.VideoSearch;
import java.util.List;

/**
 *
 * @author 马亚星
 */
public interface VideoDAO {

    /**
     * 新增视频
     *
     * @param video 视频
     */
    void addVideo(Video video);

    /**
     * 修改视频
     *
     * @param id
     */
    void copyVideo(Long id);

    void upVideo(Video video);

    void updateVideoCheck(Video video);

    /**
     * 查询视频
     *
     * @param offset
     * @param pageSize
     * @param title
     * @param isVip
     * @param isRecommend
     * @param isEnable
     * @param type
     * @param album
     * @return
     */
    BinaryPair<List<Video>, Long> selVideo(int offset, int pageSize, String title, Boolean isVip, Boolean isRecommend, Boolean isEnable, Long type, Long album);

    /*微纪录*/
    BinaryPair<List<Video>, Long> selectMicro(int offset, int pageSize, Video video);

    /*煮酒论道*/
    BinaryPair<List<Video>, Long> selectDao(int offset, int pageSize, Video video);

    /**
     * 查询视频信息
     *
     * @param id
     * @return
     */
    Video selByIdVideo(Long id);

    BinaryPair<List<Video>, Long> complexSearch(VideoSearch videoSearch);

    BinaryPair<List<Video>, Long> advanceSearch(VideoSearch videoSearch);

    BinaryPair<List<Video>, Long> TimeSearch(int offset, int pageSize);

    BinaryPair<List<Video>, Long> FeeSearch(int offset, int pageSize);

    BinaryPair<List<Video>, Long> SameTimeSearch(Long id, int offset, int pageSize);

    BinaryPair<List<Video>, Long> selectBySpeaker(Long id);

    BinaryPair<List<Video>, Long> selectByActivity(Long id);

    //后台视频审核
    BinaryPair<List<Video>, Long> selectByAdmin(Video video);

    //    后台视频审核从新到旧排序
    BinaryPair<List<Video>, Long> selectByTime0();

    //     后台视频管理排序1-6
    BinaryPair<List<Video>, Long> selectByAdmin1();

    BinaryPair<List<Video>, Long> selectByAdmin2();

    BinaryPair<List<Video>, Long> selectByAdmin3();

    BinaryPair<List<Video>, Long> selectByAdmin4();

    BinaryPair<List<Video>, Long> selectByAdmin5();

    BinaryPair<List<Video>, Long> selectByAdmin6();

    //    删除视频关系表1-10
    void delVideo(Long id);
}
