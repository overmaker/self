package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.VideoScore;
import java.util.List;

/**
 * 视频评分
 *
 * @author 马亚星
 */
public interface VideoScoreDAO {

    /**
     * 新增视频评分
     *
     * @param user 用户id
     * @param video 视频id
     * @param score 得分
     * @return 新增结果。0：成功，2：其他错误
     */
   void addVideoScore(Long user, Long video, int score);

    /**
     * 删除视频评分
     *
     * @param id 主键
     * @return 删除结果。0:成功，2：其他错误
     */
    int delVideoScore(Long id);

    /**
     * 修改视频专辑评分
     *
     * @param user 用户id
     * @param video 视频id
     * @param score 得分
     * @return 修改结果。0：成功，2：其他错误
     */
    int upVideoScore(Long user, Long video, int score);

    /**
     * 通过条件查询视评分
     *
     * @param video 视频id
     * @return
     */
    BinaryPair<List<VideoScore>, Long> selTJVideoScore(int offset, int count, Long video);

    Integer searVideoScore(Long user, Long video);
}
