package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 视频主题
 *
 * @author 马亚星
 */
@XmlRootElement(name = "video-theme")
public final class VideoTheme extends BaseEntity {

    /**
     * 主题名称
     */
    @XmlElement(name = "name")
    private String name;
    /**
     * 视频缩略图
     */
    @XmlElement(name = "thumbnail")
    private String thumbnail;
    /**
     * 是否被推荐到首页
     */
    @XmlElement(name = "recommend")
    private Boolean recommend;
    /**
     * 推荐位置
     */
    @XmlElement(name = "order")
    private int order;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Boolean getRecommend() {
        return recommend;
    }

    public void setRecommend(Boolean recommend) {
        this.recommend = recommend;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

}
