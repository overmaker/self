package cn.kepu.self.video.dao;

import cn.kepu.self.commons.entity.EchartData;
import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.VideoHits;
import java.util.List;

/**
 * 视频点击量
 *
 * @author
 */
public interface VideoHitsDAO {

    /**
     * 新增视频点击量
     */
    void addVideoHits(VideoHits videoHits);

    /**
     * 统计视频的点击量
     *
     * @param videoId
     * @return 点击数量
     */
    Long selVideoHitsCount(Long videoId);

    //    参与情况统计1-点击量
    BinaryPair<List<VideoHits>, Long> count1();

    //    参与情况统计1-柱状图
    EchartData count10();

    /**
     * 我观看过的视频
     *
     *
     * @param userId
     * @param offset
     * @param pageSize
     * @return
     */
    BinaryPair<List<VideoHits>, Long> selectMyHits(Long userId, int offset, int pageSize);
}
