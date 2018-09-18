package cn.kepu.self.others.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "about")
public class About extends BaseEntity {
    
    /**
     * 类型
     */
    @XmlElement(name = "type")
    private String type;
    
    /**
     * 内容
     */
    @XmlElement(name = "introduction")
    private String introduction;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }
}
