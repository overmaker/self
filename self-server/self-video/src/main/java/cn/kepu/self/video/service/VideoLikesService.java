package cn.kepu.self.video.service;

import cn.kepu.self.video.dao.VideoLikesDAO;
import cn.kepu.self.video.entity.VideoLikes;

/**
 * 视频点赞
 *
 * @author 马亚星
 */
public enum VideoLikesService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private VideoLikesService() {}

    public static VideoLikesService getInstance() {
        return INSTANCE;
    }

    private VideoLikesDAO videoLikesDAO;

    public void setVideoLikesDAO(VideoLikesDAO videoLikesDAO) {
        this.videoLikesDAO = videoLikesDAO;
    }
    
    public void setVideoLikes(Long user, Long video) {
        VideoLikes videoLikes = new VideoLikes();
        videoLikes.setUser(user);
        videoLikes.setVideo(video);
        videoLikesDAO.insertVideoLikes(videoLikes);
    }
    
    public VideoLikes getVideoLikes(Long user, Long video) {
        VideoLikes videoLikes = new VideoLikes();
        videoLikes.setUser(user);
        videoLikes.setVideo(video);
        return videoLikesDAO.selectByUserAndVideo(videoLikes);
    }
}
