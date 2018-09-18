package cn.kepu.self.shop.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 *
 * @author 李成志
 */
public class Shipping extends BaseEntity {
    
    /**
     * 订单
     */
    private Order order;
    
    /**
     * 快递单号
     */
    private String tracking_no;
    
    /**
     * 发货方式
     */
    private ShippingMethod shipping_method;

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getTracking_no() {
        return tracking_no;
    }

    public void setTracking_no(String tracking_no) {
        this.tracking_no = tracking_no;
    }

    public ShippingMethod getShipping_method() {
        return shipping_method;
    }

    public void setShipping_method(ShippingMethod shipping_method) {
        this.shipping_method = shipping_method;
    }
    
}
