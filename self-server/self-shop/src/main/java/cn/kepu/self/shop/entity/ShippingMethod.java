package cn.kepu.self.shop.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 *
 * @author 李成志
 */
public class ShippingMethod extends BaseEntity {
    
    /**
     * 配送方式名称
     */
    private String name;
    
    /**
     * 物流公司
     */
    private String logistics_company;
    
    /**
     * 首重量
     */
    private Integer first_weight;
    
    /**
     * 续重量
     */
    private Integer continue_weight;
    
    /**
     * 首重价格
     */
    private Double first_price;
    
    /**
     * 续重价格
     */
    private Double continue_price;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogistics_company() {
        return logistics_company;
    }

    public void setLogistics_company(String logistics_company) {
        this.logistics_company = logistics_company;
    }

    public Integer getFirst_weight() {
        return first_weight;
    }

    public void setFirst_weight(Integer first_weight) {
        this.first_weight = first_weight;
    }

    public Integer getContinue_weight() {
        return continue_weight;
    }

    public void setContinue_weight(Integer continue_weight) {
        this.continue_weight = continue_weight;
    }

    public Double getFirst_price() {
        return first_price;
    }

    public void setFirst_price(Double first_price) {
        this.first_price = first_price;
    }

    public Double getContinue_price() {
        return continue_price;
    }

    public void setContinue_price(Double continue_price) {
        this.continue_price = continue_price;
    }
    
}
