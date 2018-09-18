package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 * 视频点赞
 *
 * @author 马亚星
 */
public class VideoLikes extends BaseEntity {

    /**
     * 用户id
     */
    private Long user;
    /**
     * 视频id
     */
    private Long video;
    /**
     * 是否点赞
     */
    private Boolean roll;

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public Long getVideo() {
        return video;
    }

    public void setVideo(Long video) {
        this.video = video;
    }

    public Boolean getRoll() {
        return roll;
    }

    public void setRoll(Boolean roll) {
        this.roll = roll;
    }
}
