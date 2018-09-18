package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "video-donation")
public final class VideoDonation extends BaseEntity {
    
    /**
     * * 用户id
     */
    @XmlElement(name = "user")
    private User user;
    
    /**
     * * 视频id
     */
    @XmlElement(name = "video")
    private Video video;
    
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
     * * 预支付id
     */
    @XmlElement(name = "prepay-id")
    private String prepay_id;
    
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

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
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

    public String getPrepay_id() {
        return prepay_id;
    }

    public void setPrepay_id(String prepay_id) {
        this.prepay_id = prepay_id;
    }

    public Boolean getPay_flag() {
        return pay_flag;
    }

    public void setPay_flag(Boolean pay_flag) {
        this.pay_flag = pay_flag;
    }
    
}
