package cn.kepu.self.activity.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import java.sql.Timestamp;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 劉一童
 */
@XmlRootElement(name = "ticket")
public final class Ticket extends BaseEntity {

    /**
     * 票种名称
     */
    @XmlElement(name = "name")
    private String name;

    /**
     * 发行数量
     */
    @XmlElement(name = "stock")
    private Integer stock;

    /**
     * 是否免费
     */
    @XmlElement(name = "free")
    private Boolean free;

    /**
     * 费用
     */
    @XmlElement(name = "fee")
    private Double fee;

    /**
     * 票种说明
     */
    @XmlElement(name = "intro")
    private String introduction;

    /**
     * 单张票能携带人数
     */
    @XmlElement(name = "person-num")
    private Integer personNum;

    /**
     * 单人最少买多少张
     */
    @XmlElement(name = "purchase-min")
    private Integer purchaseMin;

    /**
     * 单人最多买多少张
     */
    @XmlElement(name = "purchase-max")
    private Integer purchaseMax;

    /**
     * 开售时间
     */
    @XmlElement(name = "start")
    private Timestamp startTime;

    /**
     * 截至时间
     */
    @XmlElement(name = "end")
    private Timestamp endTime;

    /**
     * 关联活动
     */
    @XmlElement(name = "activity")
    private Activity activity;

    /**
     * 当前时间是否在开售/截至范围内，还是未开售，还是已超过截止日期。 状态分别为joinning、not_open、over
     */
    @XmlElement(name = "status")
    private String status;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Boolean getFree() {
        return free;
    }

    public void setFree(Boolean free) {
        this.free = free;
    }

    public Double getFee() {
        return fee;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public Integer getPersonNum() {
        return personNum;
    }

    public void setPersonNum(Integer personNum) {
        this.personNum = personNum;
    }

    public Integer getPurchaseMin() {
        return purchaseMin;
    }

    public void setPurchaseMin(Integer purchaseMin) {
        this.purchaseMin = purchaseMin;
    }

    public Integer getPurchaseMax() {
        return purchaseMax;
    }

    public void setPurchaseMax(Integer purchaseMax) {
        this.purchaseMax = purchaseMax;
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

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
