package cn.kepu.self.commons.entity;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 劉一童
 */
@XmlRootElement(name = "module")
public final class Module extends BaseEntity {

    @XmlElement(name = "name")
    private String name;

    @XmlElement(name = "display-name")
    private String displayName;

    @XmlElement(name = "group")
    private String group;

    @XmlElement(name = "grant")
    private Integer grant;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public Integer getGrant() {
        return grant;
    }

    public void setGrant(Integer grant) {
        this.grant = grant;
    }

}
