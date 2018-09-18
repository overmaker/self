package cn.kepu.self.commons.entity;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 劉一童
 */
@XmlRootElement(name = "role")
public final class Role extends BaseEntity {

    @XmlElement(name = "name")
    private String name;
    
    @XmlElement(name = "modules")
    private Module[] modules;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Module[] getModules() {
        return modules;
    }

    public void setModules(Module[] modules) {
        this.modules = modules;
    }

}
