package cn.kepu.self.commons.entity;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 嘉宾类
 *
 * @author 劉一童
 */
@XmlRootElement(name = "guest")
public final class Guest extends BaseEntity {

    @XmlElement(name = "name")
    private String name;
    
    @XmlElement(name = "photo")
    private String photo;
    
    @XmlElement(name = "mobile")
    private String mobile;
    
    @XmlElement(name = "introduction")
    private String introduction;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

}
