package cn.kepu.self.video.service;

import cn.kepu.self.commons.entity.EchartData;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoCommentDAO;
import cn.kepu.self.video.entity.Video;
import cn.kepu.self.video.entity.VideoComment;
import java.util.List;

/**
 * 视频评论
 *
 * @author 马亚星
 */
public enum VideoCommentService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private VideoCommentService() {
    }

    public static VideoCommentService getInstance() {
        return INSTANCE;
    }

    private VideoCommentDAO videoCommentDAO;

    public void setVideoCommentDAO(VideoCommentDAO videoCommentDAO) {
        this.videoCommentDAO = videoCommentDAO;
    }

    /**
     * 新增视频评论
     *
     * @param videoComment
     */
    public void addVideComment(VideoComment videoComment) {
        videoCommentDAO.addVideoComment(videoComment);
    }

    /**
     * 查询视频评论
     */
    public BinaryPair<List<VideoComment>, Long> selectVideoComment(int offset, int pageSize, Long userId, Long videoId, String videoTitle, String comment) {
        VideoComment videoComment = new VideoComment();
        User user = new User();
        if (userId != null) {
            user.setId(userId);
        }
        videoComment.setUser(user);
        Video video = new Video();
        if (videoId != null) {
            video.setId(videoId);
        }
        if (videoTitle != null) {
            video.setTitle(videoTitle);
        }
        videoComment.setVideo(video);
        if (comment != null) {
            videoComment.setComment(comment);
        }

        return videoCommentDAO.selectVideoComment(offset, pageSize, videoComment);
    }

    /**
     * 统计视频的评论数量
     *
     * @param videoId
     * @return 评论数量
     */
    public Long selVideoCommentCount(Long videoId) {
        return videoCommentDAO.selVideoCommentCount(videoId);
    }

    /**
     * 删除视频弹幕
     *
     * @param id 主键
     * @return 删除结果。0：成功，2：其他错误
     */
    public int delVideoComment(Long id) {
        return videoCommentDAO.delVideoComment(id);
    }

//    后台审核
    public BinaryPair<List<VideoComment>, Long> adminVideoComment(int offset, int pageSize, Long userId, Long videoId, String videoTitle, String comment) {
        VideoComment videoComment = new VideoComment();
        User user = new User();
        if (userId != null) {
            user.setId(userId);
        }
        videoComment.setUser(user);
        Video video = new Video();
        if (videoId != null) {
            video.setId(videoId);
        }
        if (videoTitle != null) {
            video.setTitle(videoTitle);
        }
        videoComment.setVideo(video);
        if (comment != null) {
            videoComment.setComment(comment);
        }

        return videoCommentDAO.adminVideoComment(offset, pageSize, videoComment);
    }

    public BinaryPair<List<VideoComment>, Long> adminComment(int offset, int pageSize, VideoComment videoComment) {

        return videoCommentDAO.adminComment(offset, pageSize, videoComment);
    }

    public int adminChangeComment(Long id) {
        return videoCommentDAO.adminChangeComment(id);
    }

    //    参与情况统计2
    public BinaryPair<List<VideoComment>, Long> count2() {
        return videoCommentDAO.count2();
    }

    //    参与情况统计2-柱状图
    public EchartData count20() {

        return videoCommentDAO.count20();
    }

    //    视屏评论详情页
    public BinaryPair<List<VideoComment>, Long> adminCommentView(Long id) {

        return videoCommentDAO.adminCommentView(id);
    }
    //    视屏评论详情页1

    public BinaryPair<List<VideoComment>, Long> adminCommentView1(Long id) {

        return videoCommentDAO.adminCommentView1(id);
    }
    //    视屏评论详情页2

    public BinaryPair<List<VideoComment>, Long> adminCommentView2(Long id) {

        return videoCommentDAO.adminCommentView2(id);
    }
}
