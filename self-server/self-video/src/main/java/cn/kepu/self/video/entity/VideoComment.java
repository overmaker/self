package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 视频评论
 *
 * @author 马亚星
 */
@XmlRootElement(name = "video-comment")
public final class VideoComment extends BaseEntity {

    @XmlElement(name = "user")
    private User user;

    @XmlElement(name = "user-info")
    private UserInfo userInfo;

    /**
     * * 视频id
     */
    @XmlElement(name = "video")
    private Video video;

    /**
     * * 评论内容
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

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
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
