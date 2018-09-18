package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 *
 * @author 马亚星
 */
public class VideoAlbum extends BaseEntity {
    /**
     * 视频专辑名称
     */
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
