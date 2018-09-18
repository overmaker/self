package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import java.sql.Timestamp;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 视频管理
 *
 * @author 马亚星
 */
@XmlRootElement(name = "video")
public final class Video extends BaseEntity {

    /**
     * 视频主题
     */
    @XmlElement(name = "themes")
    private VideoTheme[] themes;

    /**
     * 视频演讲者
     */
    @XmlElement(name = "speakers")
    private Speaker[] speakers;

    /**
     * 视频标题
     */
    @XmlElement(name = "title")
    private String title;
    /**
     * 视频介绍
     */
    @XmlElement(name = "introduction")
    private String introduction;
    /**
     * 视频缩略图
     */
    @XmlElement(name = "thumbnail")
    private String thumbnail;
    /**
     * 是否VIP视频
     */
    @XmlElement(name = "vip")
    private Boolean vip;
    /**
     * 是否被推荐到首页
     */
    @XmlElement(name = "recommend")
    private Boolean recommend;
    /**
     * 是否是可用的
     */
    @XmlElement(name = "enable")
    private Boolean enable;

    @XmlElement(name = "publish-time")
    private Timestamp publishTime;

    /**
     * 申请状态。0：待审批；1：通过；2：不通过
     */
    @XmlElement(name = "status")
    private Integer status;
    /**
     * 视频文件存放相对路径
     */
    @XmlElement(name = "path")
    private String path;
    /**
     * 英文字幕文件存放路径
     */
    @XmlElement(name = "en-subtitle")
    private String enSubtitle;
    /**
     * 中文字幕文件存放路径
     */
    @XmlElement(name = "zh-subtitle")
    private String zhSubtitle;
    /**
     * 西班牙文字幕文件存放路径
     */
    @XmlElement(name = "es-subtitle")
    private String esSubtitle;
    /**
     * 演讲全文
     */
    @XmlElement(name = "full-text")
    private String fullText;
    /**
     * 视频所属分类
     */
    @XmlElement(name = "type")
    private VideoType type;
    /**
     * 视频所属专辑
     */
    @XmlElement(name = "album")
    private VideoAlbum album;
    /**
     * 视频所属年龄段
     */
    @XmlElement(name = "age")
    private int age;//视频所属年龄段：0-4     
//0： 0-6岁   1： 6-12岁  2：12-18岁 3： 18-30岁  4： 30岁以上
    /**
     * 点赞数量
     */
    @XmlElement(name = "likes-num")
    private int likesNum;
    /**
     * 评论数量
     */
    @XmlElement(name = "comment-num")
    private int commentNum;

    /**
     * 点击量
     */
    @XmlElement(name = "hits-num")
    private int hitsNum;
    /**
     * 评分
     */
    @XmlElement(name = "score")
    private int Score;

    /**
     * 所属活动ID
     */
    @XmlElement(name = "activity-id")
    private Integer activityId;

    /**
     * 所属活动名称
     */
    @XmlElement(name = "activity-name")
    private String activityName;

    public VideoTheme[] getThemes() {
        return themes;
    }

    public void setThemes(VideoTheme[] themes) {
        this.themes = themes;
    }

    public Speaker[] getSpeakers() {
        return speakers;
    }

    public void setSpeakers(Speaker[] speakers) {
        this.speakers = speakers;
    }

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

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Boolean getVip() {
        return vip;
    }

    public void setVip(Boolean vip) {
        this.vip = vip;
    }

    public Boolean getRecommend() {
        return recommend;
    }

    public void setRecommend(Boolean recommend) {
        this.recommend = recommend;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

    public Timestamp getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Timestamp publishTime) {
        this.publishTime = publishTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getEnSubtitle() {
        return enSubtitle;
    }

    public void setEnSubtitle(String enSubtitle) {
        this.enSubtitle = enSubtitle;
    }

    public String getZhSubtitle() {
        return zhSubtitle;
    }

    public void setZhSubtitle(String zhSubtitle) {
        this.zhSubtitle = zhSubtitle;
    }

    public String getEsSubtitle() {
        return esSubtitle;
    }

    public void setEsSubtitle(String esSubtitle) {
        this.esSubtitle = esSubtitle;
    }

    public String getFullText() {
        return fullText;
    }

    public void setFullText(String fullText) {
        this.fullText = fullText;
    }

    public VideoType getType() {
        return type;
    }

    public void setType(VideoType type) {
        this.type = type;
    }

    public VideoAlbum getAlbum() {
        return album;
    }

    public void setAlbum(VideoAlbum album) {
        this.album = album;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getLikesNum() {
        return likesNum;
    }

    public void setLikesNum(int likesNum) {
        this.likesNum = likesNum;
    }

    public int getCommentNum() {
        return commentNum;
    }

    public void setCommentNum(int commentNum) {
        this.commentNum = commentNum;
    }

    public int getHitsNum() {
        return hitsNum;
    }

    public void setHitsNum(int hitsNum) {
        this.hitsNum = hitsNum;
    }

    public int getScore() {
        return Score;
    }

    public void setScore(int Score) {
        this.Score = Score;
    }

    public Integer getActivityId() {
        return activityId;
    }

    public void setActivityId(Integer activityId) {
        this.activityId = activityId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

}
