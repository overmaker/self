package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import javax.xml.bind.annotation.XmlElement;

/**
 * 活动评论
 *
 * @author 李成志
 */
public final class ActivityComment extends BaseEntity {

    /**
     * 用户
     */
    @XmlElement(name = "user")
    private User user;

    @XmlElement(name = "user-info")
    private UserInfo userInfo;
    /**
     * 活动
     */
    @XmlElement(name = "activity")
    private Activity activity;

    /**
     * 评论内容
     */
    @XmlElement(name = "comment")
    private String comment;

    /**
     * 是否是可用的
     */
    @XmlElement(name = "enable")
    private Boolean enable;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }



}
