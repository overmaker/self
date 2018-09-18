package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 劉一童
 */
@XmlRootElement(name = "activity-info")
public final class ActivityInfo extends BaseEntity {

    /**
     * 已报名人数
     */
    @XmlElement(name = "roll-num")
    private Integer rollNum;
    
    /**
     * 评论数
     */
    @XmlElement(name = "comment-num")
    private Integer commentNum;

    public Integer getRollNum() {
        return rollNum;
    }

    public void setRollNum(Integer rollNum) {
        this.rollNum = rollNum;
    }

    public Integer getCommentNum() {
        return commentNum;
    }

    public void setCommentNum(Integer commentNum) {
        this.commentNum = commentNum;
    }

}
