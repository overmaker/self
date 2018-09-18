package cn.kepu.self.video.service;

import cn.kepu.self.commons.entity.EchartData;
import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoHitsDAO;
import cn.kepu.self.video.entity.Video;
import cn.kepu.self.video.entity.VideoHits;
import java.util.List;

/**
 * 视频点击量
 *
 * @author
 */
public enum VideoHitsService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private VideoHitsService() {
    }

    public static VideoHitsService getInstance() {
        return INSTANCE;
    }

    private VideoHitsDAO videoHitsDAO;

    public void setVideoHitsDAO(VideoHitsDAO videoHitsDAO) {
        this.videoHitsDAO = videoHitsDAO;
    }

    /**
     * 新增视频点击量
     *
     */
    public void addVideHits(VideoHits videoHits) {
        videoHitsDAO.addVideoHits(videoHits);
    }

    /**
     * 统计视频的点击数量
     *
     * @param videoId
     * @return 点击数量
     */
    public Long selVideoHitsCount(Long videoId) {
        return videoHitsDAO.selVideoHitsCount(videoId);
    }

    //    参与情况统计1-点击量
    public BinaryPair<List<VideoHits>, Long> count1() {
        return videoHitsDAO.count1();
    }
    //    参与情况统计1-柱状图

    public EchartData count10() {

        return videoHitsDAO.count10();
    }

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
        return videoHitsDAO.selectMyHits(userId, offset, pageSize);
    }
}
