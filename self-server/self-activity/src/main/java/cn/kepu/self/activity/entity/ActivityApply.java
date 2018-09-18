package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import javax.xml.bind.annotation.XmlElement;

/**
 *
 * @author 李成志
 */
public class ActivityApply extends BaseEntity {

    /**
     * 用户
     */
    @XmlElement(name = "user")
    private User user;

    /**
     * 企业名称
     */
    @XmlElement(name = "name")
    private String name;

    /**
     * 联系人
     */
    @XmlElement(name = "responsible")
    private String responsible;

    /**
     * 联系人
     */
    @XmlElement(name = "contact")
    private String contact;

    /**
     * 联系电话
     */
    @XmlElement(name = "tel")
    private String tel;

    /**
     * 联系邮箱
     */
    @XmlElement(name = "email")
    private String email;

    /**
     * 活动方案文件存放相对路径
     */
    @XmlElement(name = "activity_plan_file")
    private String activity_plan_file;

    /**
     * 申请理由
     */
    @XmlElement(name = "comment")
    private String comment;

    /**
     * 申请状态。0：待审批；1：通过；2：不通过
     */
    @XmlElement(name = "status")
    private Integer status;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getResponsible() {
        return responsible;
    }

    public void setResponsible(String responsible) {
        this.responsible = responsible;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getActivity_plan_file() {
        return activity_plan_file;
    }

    public void setActivity_plan_file(String activity_plan_file) {
        this.activity_plan_file = activity_plan_file;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

}
