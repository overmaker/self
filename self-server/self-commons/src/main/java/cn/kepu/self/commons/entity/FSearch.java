package cn.kepu.self.commons.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 全文检索
 *
 * @author 周林敏
 */
@XmlRootElement(name = "fSearch")
public final class FSearch extends BaseEntity {

    /**
     * 检索标题
     */
    @XmlElement(name = "title")
    private String title;
    /**
     * 检索类型
     */
    @XmlElement(name = "type")
    private int type;//0代表视频,1代表直播,2代表活动
    /**
     * 检索介绍
     */
    @XmlElement(name = "introduction")
    private String introduction;
    /**
     * 视频缩略图
     */
    @XmlElement(name = "thumbnail")
    private String thumbnail;
    /**
     * searchContent
     */
    @XmlElement(name = "searchContent")
    private String searchContent;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public String getSearchContent() {
        return searchContent;
    }

    public void setSearchContent(String searchContent) {
        this.searchContent = searchContent;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
