package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 用户购票表
 *
 * @author 劉一童
 */
@XmlRootElement(name = "user-ticket")
public final class UserTicket extends BaseEntity {

    @XmlElement(name = "user")
    private User user;

    @XmlElement(name = "user-info")
    private UserInfo userInfo;

    @XmlElement(name = "ticket")
    private Ticket ticket;
    
    /**
     * 购买数量
     */
    @XmlElement(name = "num")
    private Integer num;

    /**
     * 购票时填写的姓名
     */
    @XmlElement(name = "name")
    private String name;

    /**
     * 购票时填写的手机号
     */
    @XmlElement(name = "mobile")
    private String mobile;

    /**
     * 收到的短信验证码
     */
    @XmlElement(name = "vcode")
    private String vcode;

    @XmlElement(name = "total-fee")
    private Float totalFee;

    /**
     * * 支付订单号
     */
    @XmlElement(name = "sn")
    private String sn;

    @XmlElement(name = "enable")
    private Boolean enable;
    
    private Activity activity;
    
    private String email;
    @XmlElement(name = "status")
    private Boolean status;
    
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

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getVcode() {
        return vcode;
    }

    public void setVcode(String vcode) {
        this.vcode = vcode;
    }

    public Float getTotalFee() {
        return totalFee;
    }

    public void setTotalFee(Float totalFee) {
        this.totalFee = totalFee;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

}
