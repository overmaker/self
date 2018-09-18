package cn.kepu.self.shop.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import cn.kepu.self.commons.entity.User;
import java.sql.Timestamp;

/**
 *
 * @author 李成志
 */
public class Order extends BaseEntity {
    
    /**
     * 订单编号
     */
    private String sn;
    
    /**
     * 收货地址
     */
    private String address;
    
    /**
     * 邮编
     */
    private String zip_code;
    
    /**
     * 收货人
     */
    private String consignee;
    
    /**
     * 联系手机号
     */
    private String mobile;
    
    /**
     * 手续费
     */
    private Double fee;
    
    /**
     * 订单金额
     */
    private Double amount_price;
    
    /**
     * 订单积分
     */
    private Integer amount_score;
    
    /**
     * 支付方式
     */
    private Integer payment_method;
    
    /**
     * 配送方式
     */
    private ShippingMethod shipping_method;
    
    /**
     * 用户
     */
    private User user;
    
    /**
     * 订单状态
     */
    private Integer order_status;
    
    /**
     * 支付状态
     */
    private Integer payment_status;
    
    /**
     * 配送状态
     */
    private Integer shipping_status;
    
    /**
     * 订单完成时间
     */
    private Timestamp complete_date;
    
    private int quantity;
    
    private Product product;

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getZip_code() {
        return zip_code;
    }

    public void setZip_code(String zip_code) {
        this.zip_code = zip_code;
    }

    public String getConsignee() {
        return consignee;
    }

    public void setConsignee(String consignee) {
        this.consignee = consignee;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Double getFee() {
        return fee;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }

    public Double getAmount_price() {
        return amount_price;
    }

    public void setAmount_price(Double amount_price) {
        this.amount_price = amount_price;
    }

    public Integer getAmount_score() {
        return amount_score;
    }

    public void setAmount_score(Integer amount_score) {
        this.amount_score = amount_score;
    }

    public Integer getPayment_method() {
        return payment_method;
    }

    public void setPayment_method(Integer payment_method) {
        this.payment_method = payment_method;
    }

    public ShippingMethod getShipping_method() {
        return shipping_method;
    }

    public void setShipping_method(ShippingMethod shipping_method) {
        this.shipping_method = shipping_method;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getOrder_status() {
        return order_status;
    }

    public void setOrder_status(Integer order_status) {
        this.order_status = order_status;
    }

    public Integer getPayment_status() {
        return payment_status;
    }

    public void setPayment_status(Integer payment_status) {
        this.payment_status = payment_status;
    }

    public Integer getShipping_status() {
        return shipping_status;
    }

    public void setShipping_status(Integer shipping_status) {
        this.shipping_status = shipping_status;
    }

    public Timestamp getComplete_date() {
        return complete_date;
    }

    public void setComplete_date(Timestamp complete_date) {
        this.complete_date = complete_date;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    
}
