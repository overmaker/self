package cn.kepu.self.video.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoScoreDAO;
import cn.kepu.self.video.entity.VideoScore;
import java.util.List;

/**
 * 视频评分
 *
 * @author 马亚星
 */
public enum VideoScoreService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private VideoScoreService() {
    }

    public static VideoScoreService getInstance() {
        return INSTANCE;
    }

    private VideoScoreDAO videoScoreDAO;

    public void setVideoScoreDAO(VideoScoreDAO videoScoreDAO) {
        this.videoScoreDAO = videoScoreDAO;
    }

    /**
     * 新增视频评分
     *
     * @param user 用户id
     * @param video 视频id
     * @param score 视频评分
     * @return 新增结果。0：成功，2：其他错误
     */
    public void addVideoScore(Long user, Long video, int score) {
        videoScoreDAO.addVideoScore(user, video, score);
    }

    /**
     * 删除视频评分
     *
     * @param id 主键
     * @return 删除结果。0：成功，2：其他错误
     */
    public int delVideoScore(Long id) {
        return videoScoreDAO.delVideoScore(id);
    }

    /**
     * 修改视频评分
     *
     * @param user 用户id
     * @param video 视频id
     * @param score 视频评分
     * @return 修改结果。0：成功，2：其他错误
     */
    public int upVideoScore(Long user, Long video, int score) {
        return videoScoreDAO.upVideoScore(user, video, score);
    }

    /**
     * 通过条件查询视频评分
     *
     * @param video 视频id
     * @return
     */
    public BinaryPair<List<VideoScore>, Long> selTJVideoScore(int offset, int count, Long video) {
        return videoScoreDAO.selTJVideoScore(offset, count, video);
    }

    /**
     * 通过用户和视频查询视频评分
     *
     * @param video 视频id
     * @return
     */
    public Integer searVideoScore(Long user, Long video) {
        return videoScoreDAO.searVideoScore(user, video);
    }
}
