package cn.kepu.self.shop.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 *
 * @author 李成志
 */
public class ProductType extends BaseEntity {
    
    /**
     * 商品分类名称
     */
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
