package cn.kepu.self.video.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoInfoDAO;
import cn.kepu.self.video.entity.VideoInfo;
import java.util.List;

/**
 * 视频信息
 *
 * @author 马亚星
 */
public enum VideoInfoService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private VideoInfoService() {
    }

    public static VideoInfoService getInstance() {
        return INSTANCE;
    }

    private VideoInfoDAO videoInfoDAO;

    public void setVideoInfoDAO(VideoInfoDAO videoInfoDAO) {
        this.videoInfoDAO = videoInfoDAO;
    }

    /**
     * 新增视频评论
     *
     * @param likesNum 视频点赞数量
     * @param commentNum 视频评论数量
     * @param score 视频平均分
     * @return 新增结果。 0：成功，2：其他错误。
     */
    public int addVideInfo(Long id,int likesNum, int commentNum, int score) {
        if (id < 0 || likesNum < 0 || commentNum < 0 || score < 0) {
            return 2;
        }
        return videoInfoDAO.addVideoInfo(id,likesNum, commentNum, score);
    }

    /**
     * 删除视频评论
     *
     * @param id 主键
     * @return 删除结果。0：成功，2：其他错误
     */
    public int delVideoInfo(Long id) {
        return videoInfoDAO.delVideoInfo(id);
    }
    
    public int upVideoInfo(int likesNum, int commentNum, int score, Long id) {
        if (likesNum < 0 || commentNum < 0 || score < 0) {
            return 2;
        }
        return videoInfoDAO.upVideoInfo(likesNum, commentNum, score, id);
    }

    public VideoInfo selByIdVideoInfo(Long id) {
        return videoInfoDAO.selByIdVideoInfo(id);
    }
    
    /**
     * 通过条件查询视频评论
     *
     * @return
     */
    public BinaryPair<List<VideoInfo>, Long> selVideoInfo(int offset, int pageSize) {
        return videoInfoDAO.selVideoInfo(offset, offset);
    }

}
