package cn.kepu.self.commons.entity;

import java.sql.Timestamp;
import java.util.Objects;
import javax.xml.bind.annotation.XmlElement;

/**
 * 数据库实体类的基类
 *
 * @author 劉一童
 */
public abstract class BaseEntity {

    /**
     * 数据库表主键id字段
     */
    @XmlElement(name = "id")
    private Long id;

    @XmlElement(name = "create-time")
    private Timestamp createTime;

    @XmlElement(name = "modified-time")
    private Timestamp modifiedTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Timestamp getModifiedTime() {
        return modifiedTime;
    }

    public void setModifiedTime(Timestamp modifiedTime) {
        this.modifiedTime = modifiedTime;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 13 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final BaseEntity other = (BaseEntity) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }

}
