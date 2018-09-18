package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import java.sql.Timestamp;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 劉一童
 */
@XmlRootElement(name = "activity")
public final class Activity extends BaseEntity {

    /**
     * 活动标题
     */
    @XmlElement(name = "title")
    private String title;

    /**
     * 缩略图
     */
    @XmlElement(name = "thumbnail")
    private String thumbnail;

    /**
     * 海报图
     */
    @XmlElement(name = "image")
    private String image;

    /**
     * 活动类型
     */
    @XmlElement(name = "type")
    private ActivityType type;

    /**
     * 活动主题一览
     */
    @XmlElement(name = "themes")
    private ActivityTheme[] themes;

    /**
     * 活动开始时间
     */
    @XmlElement(name = "start-time")
    private Timestamp startTime;

    /**
     * 活动结束时间
     */
    @XmlElement(name = "end-time")
    private Timestamp endTime;

    /**
     * 活动序列号
     */
    @XmlElement(name = "sn")
    private String sn;

    /**
     * 活动省市
     */
    @XmlElement(name = "province")
    private String province;

    /**
     * 活动主办城市
     */
    @XmlElement(name = "city")
    private String city;

    /**
     * 活动主办地区
     */
    @XmlElement(name = "area")
    private String area;

    /**
     * 活动地点
     */
    @XmlElement(name = "place")
    private String place;

    /**
     * 活动主办方
     */
    @XmlElement(name = "sponsor")
    private String sponsor;

    /**
     * 活动联系电话
     */
    @XmlElement(name = "tel")
    private String tel;

    /**
     * 活动简介
     */
    @XmlElement(name = "introduction")
    private String introduction;

    /**
     * 活动详细内容
     */
    @XmlElement(name = "full-text")
    private String fullText;

    /**
     * 活动是否直播
     */
    @XmlElement(name = "live")
    private Boolean live;

    /**
     * 直播活动地址
     */
    @XmlElement(name = "live-url")
    private String url;

    /**
     * 活动人数限制
     */
    @XmlElement(name = "max-num")
    private Integer maxnum;

    /**
     * 是否发布
     */
    @XmlElement(name = "publish")
    private Boolean publish;

    /**
     * 发布时间
     */
    @XmlElement(name = "publish-time")
    private Timestamp publishTime;

    /**
     * 活动信息
     */
    @XmlElement(name = "info")
    private ActivityInfo info;

    /**
     * 活动票种一览
     */
    @XmlElement(name = "tickets")
    private Ticket[] tickets;
    
    private UserTicket userTicket;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public ActivityType getType() {
        return type;
    }

    public void setType(ActivityType type) {
        this.type = type;
    }

    public ActivityTheme[] getThemes() {
        return themes;
    }

    public void setThemes(ActivityTheme[] themes) {
        this.themes = themes;
    }

    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
        this.endTime = endTime;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String getSponsor() {
        return sponsor;
    }

    public void setSponsor(String sponsor) {
        this.sponsor = sponsor;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public String getFullText() {
        return fullText;
    }

    public void setFullText(String fullText) {
        this.fullText = fullText;
    }

    public Boolean getLive() {
        return live;
    }

    public void setLive(Boolean live) {
        this.live = live;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getMaxnum() {
        return maxnum;
    }

    public void setMaxnum(Integer maxnum) {
        this.maxnum = maxnum;
    }

    public Boolean getPublish() {
        return publish;
    }

    public void setPublish(Boolean publish) {
        this.publish = publish;
    }

    public Timestamp getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Timestamp publishTime) {
        this.publishTime = publishTime;
    }

    public ActivityInfo getInfo() {
        return info;
    }

    public void setInfo(ActivityInfo info) {
        this.info = info;
    }

    public Ticket[] getTickets() {
        return tickets;
    }

    public void setTickets(Ticket[] tickets) {
        this.tickets = tickets;
    }

    public UserTicket getUserTicket() {
        return userTicket;
    }

    public void setUserTicket(UserTicket userTicket) {
        this.userTicket = userTicket;
    }

}
