package cn.kepu.self.commons.entity;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 用户类
 *
 * @author 劉一童
 */
@XmlRootElement(name = "user")
public final class User extends BaseEntity {

    /**
     * 用户信息
     */
    @XmlElement(name = "user-info")
    private UserInfo userInfo;

    /**
     * 用户登录名
     */
    @XmlElement(name = "user-name")
    private String userName;

    private String token;

    private String uid;

    @XmlElement(name = "type")
    private String type;

    private String password;

    private Role role;

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

   
}
