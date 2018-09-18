package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import java.sql.Timestamp;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "activity-report")
public class ActivityReport extends BaseEntity {
    
    /**
     * 活动报道标题
     */
    @XmlElement(name = "title")
    private String title;
    
    /**
     * 活动报道日期
     */
    @XmlElement(name = "report-time")
    private Timestamp reportTime;
    
    /**
     * 活动报道介绍
     */
    @XmlElement(name = "introduction")
    private String introduction;
    
    /**
     * 活动报道内容
     */
    @XmlElement(name = "content")
    private String content;
    
    /**
     * 活动报道的活动
     */
    @XmlElement(name = "activity")
    private Activity activity;
    
    /**
     * 报道图片
     */
    @XmlElement(name = "thumbnail")
    private String thumbnail;
    
    /**
     * 报道媒体
     */
    @XmlElement(name = "media")
    private String media;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Timestamp getReportTime() {
        return reportTime;
    }

    public void setReportTime(Timestamp reportTime) {
        this.reportTime = reportTime;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getMedia() {
        return media;
    }

    public void setMedia(String media) {
        this.media = media;
    }
}
