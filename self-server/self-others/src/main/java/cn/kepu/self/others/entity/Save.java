package cn.kepu.self.others.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 周林敏
 */
@XmlRootElement(name = "save")
public class Save extends BaseEntity {

    /**
     * 类型id
     */
    @XmlElement(name = "target-id")
    private Long targetId;
    /**
     * 类型
     */
    @XmlElement(name = "type")
    private String type;

    /**
     * 标题
     */
    @XmlElement(name = "title")
    private String title;
    /**
     * 缩略图
     */
    @XmlElement(name = "image")
    private String image;
    /**
     * 用户
     */
    @XmlElement(name = "user")
    private User user;

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    

}
