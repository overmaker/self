package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.VideoLikes;

/**
 *
 * @author 马亚星
 */
public interface VideoLikesMapper {

    void insertVideoLikes(VideoLikes videoLikes);

    VideoLikes selectByUserAndVideo(VideoLikes videoLikes);

}
