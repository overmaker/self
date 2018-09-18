package cn.kepu.self.site.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 周林敏
 */
@XmlRootElement(name = "become-vip")
public final class BecomeVip extends BaseEntity {

    /**
     * * 用户id
     */
    @XmlElement(name = "user")
    private User user;

    /**
     * * vip类型
     */
    @XmlElement(name = "vip-type")
    private int vip_type;
    /**
     * * 支付金额
     */
    @XmlElement(name = "total-fee")
    private Double total_fee;

    /**
     * * 支付订单号
     */
    @XmlElement(name = "sn")
    private String sn;

    /**
     * * 支付状态
     */
    @XmlElement(name = "pay-flag")
    private Boolean pay_flag;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getVip_type() {
        return vip_type;
    }

    public void setVip_type(int vip_type) {
        this.vip_type = vip_type;
    }

    public Double getTotal_fee() {
        return total_fee;
    }

    public void setTotal_fee(Double total_fee) {
        this.total_fee = total_fee;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public Boolean getPay_flag() {
        return pay_flag;
    }

    public void setPay_flag(Boolean pay_flag) {
        this.pay_flag = pay_flag;
    }

}
