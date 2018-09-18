package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 * 视频信息
 *
 * @author 马亚星
 */
public class VideoInfo extends BaseEntity {
    
    /**
     * 视频点击数
     */
    private int hitsNum;

    /**
     * 视频点赞数
     */
    private int likesNum;
    /**
     * 视频评论数
     */
    private int commentNum;
    /**
     * 视频平均分
     */
    private int score;

    public int getHitsNum() {
        return hitsNum;
    }

    public void setHitsNum(int hitsNum) {
        this.hitsNum = hitsNum;
    }

    public int getLikesNum() {
        return likesNum;
    }

    public void setLikesNum(int likesNum) {
        this.likesNum = likesNum;
    }

    public int getCommentNum() {
        return commentNum;
    }

    public void setCommentNum(int commentNum) {
        this.commentNum = commentNum;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

}
