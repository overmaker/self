package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;

/**
 * 视频点击量
 *
 * @author 
 */
public class VideoHits extends BaseEntity {

    /**
     * 用户id
     */
    private User user;
    /**
     * 视频id
     */
  private Video video; 

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }
    
}
