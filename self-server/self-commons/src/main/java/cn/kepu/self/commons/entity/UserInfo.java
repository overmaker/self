package cn.kepu.self.commons.entity;

import java.util.Date;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 劉一童
 */
@XmlRootElement(name = "user-info")
public final class UserInfo extends BaseEntity {

    /**
     * 志愿者
     */
    @XmlElement(name = "volunteer")
    private Boolean volunteer;

    @XmlElement(name = "vip")
    private Boolean vip;

    /**
     * 真实姓名
     */
    @XmlElement(name = "name")
    private String name;

    @XmlElement(name = "gender")
    private Boolean gender;

    @XmlElement(name = "photo")
    private String photo;

    @XmlElement(name = "birth-date")
    private Date birthDate;

    /**
     * 昵称
     */
    @XmlElement(name = "nick-name")
    private String nickName;

    @XmlElement(name = "mobile")
    private String mobile;

    @XmlElement(name = "email")
    private String email;

    @XmlElement(name = "qq")
    private String qq;

    /**
     * 籍贯
     */
    @XmlElement(name = "native-place")
    private String nativePlace;

    /**
     * 居住地
     */
    @XmlElement(name = "address")
    private String address;

    /**
     * 积分
     */
    @XmlElement(name = "score")
    private Integer score;

    public Boolean getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(Boolean volunteer) {
        this.volunteer = volunteer;
    }

    public Boolean getVip() {
        return vip;
    }

    public void setVip(Boolean vip) {
        this.vip = vip;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getGender() {
        return gender;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getQq() {
        return qq;
    }

    public void setQq(String qq) {
        this.qq = qq;
    }

    public String getNativePlace() {
        return nativePlace;
    }

    public void setNativePlace(String nativePlace) {
        this.nativePlace = nativePlace;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

}
