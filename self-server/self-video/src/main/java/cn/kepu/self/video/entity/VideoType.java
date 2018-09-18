package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 视频分类
 *
 * @author 劉一童
 */
@XmlRootElement(name = "video-type")
public final class VideoType extends BaseEntity {

    /**
     * 视频分类名称
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
