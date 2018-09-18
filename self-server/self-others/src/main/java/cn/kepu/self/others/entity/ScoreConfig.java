package cn.kepu.self.others.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "score-config")
public class ScoreConfig extends BaseEntity {
    
    /**
     * 视频评论所得积分
     */
    @XmlElement(name = "video-comment-score")
    private int video_comment_score;
    
    /**
     * 视频观看所得积分
     */
    @XmlElement(name = "video-hit-score")
    private int video_hit_score;
    
    /**
     * 活动评论所得积分
     */
    @XmlElement(name = "activity-comment-score")
    private int activity_comment_score;
    
    /**
     * 参加活动所得积分
     */
    @XmlElement(name = "activity-join-score")
    private int activity_join_score;

    public int getVideo_comment_score() {
        return video_comment_score;
    }

    public void setVideo_comment_score(int video_comment_score) {
        this.video_comment_score = video_comment_score;
    }

    public int getVideo_hit_score() {
        return video_hit_score;
    }

    public void setVideo_hit_score(int video_hit_score) {
        this.video_hit_score = video_hit_score;
    }

    public int getActivity_comment_score() {
        return activity_comment_score;
    }

    public void setActivity_comment_score(int activity_comment_score) {
        this.activity_comment_score = activity_comment_score;
    }

    public int getActivity_join_score() {
        return activity_join_score;
    }

    public void setActivity_join_score(int activity_join_score) {
        this.activity_join_score = activity_join_score;
    }
}
