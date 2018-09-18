package cn.kepu.self.video.dao;

import cn.kepu.self.video.entity.VideoLikes;

/**
 * 视频点赞
 *
 * @author 马亚星
 */
public interface VideoLikesDAO {

    void insertVideoLikes(VideoLikes videoLikes);

    VideoLikes selectByUserAndVideo(VideoLikes videoLikes);
}
