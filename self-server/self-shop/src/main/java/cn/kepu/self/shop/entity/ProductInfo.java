package cn.kepu.self.shop.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 *
 * @author 李成志
 */
public class ProductInfo extends BaseEntity {
    
    /**
     * 商品库存
     */
    private Integer stock;
    
    /**
     * 已售出数量
     */
    private Integer sales_num;

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getSales_num() {
        return sales_num;
    }

    public void setSales_num(Integer sales_num) {
        this.sales_num = sales_num;
    }
    
}
