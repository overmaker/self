package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import java.sql.Timestamp;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 劉一童
 */
@XmlRootElement(name = "activity-join")
public final class ActivityJoin extends BaseEntity {

    @XmlElement(name = "join-time")
    private Timestamp joinTime;

    @XmlElement(name = "check")
    private Boolean check;

    @XmlElement(name = "check-time")
    private Timestamp checkTime;

    @XmlElement(name = "sn")
    private String sn;

    @XmlElement(name = "code-url")
    private String codeUrl;

    @XmlElement(name = "pay")
    private Boolean pay;

    @XmlElement(name = "sign")
    private Boolean sign;

    @XmlElement(name = "sign-time")
    private Timestamp signTime;

    @XmlElement(name = "confirm")
    private Boolean confirm;

    @XmlElement(name = "num")
    private Integer num;

    /**
     * 报名时填写的姓名
     */
    @XmlElement(name = "j-name")
    private String jname;

    /**
     * 报名时填写的手机号
     */
    @XmlElement(name = "j-mobile")
    private String jmobile;

    /**
     * 报名时填写的邮箱
     */
    @XmlElement(name = "j-email")
    private String jemail;

    /**
     * 报名时填写的单位
     */
    @XmlElement(name = "j-org")
    private String jorg;

    /**
     * 报名时填写的职务
     */
    @XmlElement(name = "j-post")
    private String jpost;

    /**
     * 报名时填写的评论
     */
    @XmlElement(name = "j-comment")
    private String jcomment;

    @XmlElement(name = "user")
    private User user;

    @XmlElement(name = "user-info")
    private UserInfo userInfo;

    @XmlElement(name = "activity")
    private Activity activity;

    public Timestamp getJoinTime() {
        return joinTime;
    }

    public void setJoinTime(Timestamp joinTime) {
        this.joinTime = joinTime;
    }

    public Boolean getCheck() {
        return check;
    }

    public void setCheck(Boolean check) {
        this.check = check;
    }

    public Timestamp getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(Timestamp checkTime) {
        this.checkTime = checkTime;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public String getCodeUrl() {
        return codeUrl;
    }

    public void setCodeUrl(String codeUrl) {
        this.codeUrl = codeUrl;
    }

    public Boolean getPay() {
        return pay;
    }

    public void setPay(Boolean pay) {
        this.pay = pay;
    }

    public Boolean getSign() {
        return sign;
    }

    public void setSign(Boolean sign) {
        this.sign = sign;
    }

    public Timestamp getSignTime() {
        return signTime;
    }

    public void setSignTime(Timestamp signTime) {
        this.signTime = signTime;
    }

    public Boolean getConfirm() {
        return confirm;
    }

    public void setConfirm(Boolean confirm) {
        this.confirm = confirm;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public String getJname() {
        return jname;
    }

    public void setJname(String jname) {
        this.jname = jname;
    }

    public String getJmobile() {
        return jmobile;
    }

    public void setJmobile(String jmobile) {
        this.jmobile = jmobile;
    }

    public String getJemail() {
        return jemail;
    }

    public void setJemail(String jemail) {
        this.jemail = jemail;
    }

    public String getJorg() {
        return jorg;
    }

    public void setJorg(String jorg) {
        this.jorg = jorg;
    }

    public String getJpost() {
        return jpost;
    }

    public void setJpost(String jpost) {
        this.jpost = jpost;
    }

    public String getJcomment() {
        return jcomment;
    }

    public void setJcomment(String jcomment) {
        this.jcomment = jcomment;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

}
