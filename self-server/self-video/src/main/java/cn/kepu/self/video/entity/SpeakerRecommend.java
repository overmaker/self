package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "speaker-recommend")
public class SpeakerRecommend extends BaseEntity {
    
    @XmlElement(name = "speaker-name")
    private String speakerName;
    private String reason;
    private Long references;
    private Integer checked;
    
    private User user;
    private String mobile;
    private String unit;

    public String getSpeakerName() {
        return speakerName;
    }

    public void setSpeakerName(String speakerName) {
        this.speakerName = speakerName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Long getReferences() {
        return references;
    }

    public void setReferences(Long references) {
        this.references = references;
    }

    public Integer getChecked() {
        return checked;
    }

    public void setChecked(Integer checked) {
        this.checked = checked;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
