package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import java.sql.Date;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "publicity")
public class Publicity extends BaseEntity {
    
    /**
     * 活动名称
     */
    @XmlElement(name = "activity-name")
    private String activity_name;
    /**
     * 合作单位名称
     */
    @XmlElement(name = "cooperation-name")
    private String cooperation_name;
    /**
     * 内容
     */
    @XmlElement(name = "content")
    private String content;
    /**
     * 发布日期
     */
    @XmlElement(name = "publish-date")
    private Date publish_date;

    public String getActivity_name() {
        return activity_name;
    }

    public void setActivity_name(String activity_name) {
        this.activity_name = activity_name;
    }

    public String getCooperation_name() {
        return cooperation_name;
    }

    public void setCooperation_name(String cooperation_name) {
        this.cooperation_name = cooperation_name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getPublish_date() {
        return publish_date;
    }

    public void setPublish_date(Date publish_date) {
        this.publish_date = publish_date;
    }
}
