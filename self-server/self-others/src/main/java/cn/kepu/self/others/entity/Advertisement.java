package cn.kepu.self.others.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 劉一童
 */
@XmlRootElement(name = "advertisement")
public final class Advertisement extends BaseEntity {

    /**
     * 广告标题
     */
    @XmlElement(name = "title")
    private String title;

    /**
     * 广告海报路径
     */
    @XmlElement(name = "image")
    private String image;

    /**
     * 广告类型<br>
     * activity<br>
     * video<br>
     * product
     */
    @XmlElement(name = "type")
    private String type;

    @XmlElement(name = "target-id")
    private Long targetId;
    
    @XmlElement(name = "target-text")
    private String targetText;

    @XmlElement(name = "is-publish")
    private Boolean publish;

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public String getTargetText() {
        return targetText;
    }

    public void setTargetText(String targetText) {
        this.targetText = targetText;
    }

    public Boolean getPublish() {
        return publish;
    }

    public void setPublish(Boolean publish) {
        this.publish = publish;
    }

}
