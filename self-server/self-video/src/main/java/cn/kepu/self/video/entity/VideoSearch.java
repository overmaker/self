package cn.kepu.self.video.entity;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 劉一童
 */
@XmlRootElement(name = "video-search")
public final class VideoSearch {

    @XmlElement(name = "offset")
    private int offset;

    @XmlElement(name = "count")
    private int count;

    @XmlElement(name = "title")
    private String title;
    /**
     * 是否是可用的
     */
    @XmlElement(name = "enable")
    private Boolean enable;

    @XmlElement(name = "album")
    private VideoAlbum videoAlbum;

    @XmlElement(name = "type")
    private VideoType videoType;

    @XmlElement(name = "themes")
    private VideoTheme[] videoThemes;

    @XmlElement(name = "age")
    private int age;

    @XmlElement(name = "recommend")
    private Boolean recommend;

    @XmlElement(name = "publish-time-order")
    private Integer publishTimeOrder;

    @XmlElement(name = "hite-order")
    private Integer hitsOrder;

    @XmlElement(name = "status")
    private Integer status;

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

    public VideoAlbum getVideoAlbum() {
        return videoAlbum;
    }

    public void setVideoAlbum(VideoAlbum videoAlbum) {
        this.videoAlbum = videoAlbum;
    }

    public VideoType getVideoType() {
        return videoType;
    }

    public void setVideoType(VideoType videoType) {
        this.videoType = videoType;
    }

    public VideoTheme[] getVideoThemes() {
        return videoThemes;
    }

    public void setVideoThemes(VideoTheme[] videoThemes) {
        this.videoThemes = videoThemes;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Boolean getRecommend() {
        return recommend;
    }

    public void setRecommend(Boolean recommend) {
        this.recommend = recommend;
    }

    public Integer getPublishTimeOrder() {
        return publishTimeOrder;
    }

    public void setPublishTimeOrder(Integer publishTimeOrder) {
        this.publishTimeOrder = publishTimeOrder;
    }

    public Integer getHitsOrder() {
        return hitsOrder;
    }

    public void setHitsOrder(Integer hitsOrder) {
        this.hitsOrder = hitsOrder;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

}
