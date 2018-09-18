package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 * 视频评分
 *
 * @author 马亚星
 */
public class VideoScore extends BaseEntity {
    /**
     * 用户id
     */
    private Long user;
    
    /**
     * 视频id
     */
    private Long video;
    
    /**
     * 视频分数
     */
    private int score;

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

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

}
