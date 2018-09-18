package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 活动分类
 *
 * @author 李成志
 */
@XmlRootElement(name = "activity-type")
public final class ActivityType extends BaseEntity {
    
    /**
     * 活动分类名称
     */
    @XmlElement(name = "name")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
