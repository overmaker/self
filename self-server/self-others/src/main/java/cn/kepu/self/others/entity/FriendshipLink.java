package cn.kepu.self.others.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "friendship-link")
public class FriendshipLink extends BaseEntity {
    
    /**
     * 媒体合作图片
     */
    @XmlElement(name = "image")
    private String image;
    
    /**
     * 媒体合作文字
     */
    @XmlElement(name = "tooltip")
    private String tooltip;
    
    /**
     * 媒体合作路径
     */
    @XmlElement(name = "link-url")
    private String linkUrl;

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTooltip() {
        return tooltip;
    }

    public void setTooltip(String tooltip) {
        this.tooltip = tooltip;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }
}
