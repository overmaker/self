package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 视频弹幕
 *
 * @author 周
 */
@XmlRootElement(name = "danmu")
public final class Danmu extends BaseEntity {

    /**
     * *用户
     */
    @XmlElement(name = "user")
    private User user;
    /**
     * *用户昵称
     */
    @XmlElement(name = "user-info")
    private UserInfo userInfo;
    /**
     * * 视频id
     */
    @XmlElement(name = "video")
    private Video video;
    /**
     * * 弹幕发送时间
     */
    @XmlElement(name = "during-time")
    private Double duringTime;

    @XmlElement(name = "during-time-start")
    private Double duringTimeStart;

    @XmlElement(name = "during-time-end")
    private Double duringTimeEnd;
    /**
     * * 视频内容
     */
    @XmlElement(name = "content")
    private String content;

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

    public Double getDuringTime() {
        return duringTime;
    }

    public void setDuringTime(Double duringTime) {
        this.duringTime = duringTime;
    }

    public Double getDuringTimeStart() {
        return duringTimeStart;
    }

    public void setDuringTimeStart(Double duringTimeStart) {
        this.duringTimeStart = duringTimeStart;
    }

    public Double getDuringTimeEnd() {
        return duringTimeEnd;
    }

    public void setDuringTimeEnd(Double duringTimeEnd) {
        this.duringTimeEnd = duringTimeEnd;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

   
}
