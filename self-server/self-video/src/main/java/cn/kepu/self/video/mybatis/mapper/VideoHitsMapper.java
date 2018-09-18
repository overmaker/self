package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.VideoHits;
import java.util.List;

/**
 * 视频点击量
 *
 * @author
 */
public interface VideoHitsMapper {

    /**
     * 新增视频点击量
     *
     * @param videoHits
     */
    void insertVideoHits(VideoHits videoHits);

    /**
     * 统计视频的点击数量
     *
     * @param videoId
     * @return 点击数量
     */
    Long selectVideoHitsCount(Long videoId);

//    参与情况统计1-点击量
    List<VideoHits> count1();

    /**
     * 我观看过的视频
     *
     *
     * @param userId
     * @return
     */
    List<VideoHits> selectMyHits(Long userId);
}
