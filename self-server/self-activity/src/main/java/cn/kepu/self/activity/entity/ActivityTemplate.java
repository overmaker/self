package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 活动模板
 *
 * @author 周林敏
 */
@XmlRootElement(name = "activity-template")
public final class ActivityTemplate extends BaseEntity {

    /**
     * 活动模板名称
     */
    @XmlElement(name = "name")
    private String name;
    /**
     * 活动模板内容
     */
    @XmlElement(name = "content")
    private String content;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    
}
