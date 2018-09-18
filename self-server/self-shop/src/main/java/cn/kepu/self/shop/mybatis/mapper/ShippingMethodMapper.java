package cn.kepu.self.shop.mybatis.mapper;

import cn.kepu.self.shop.entity.ShippingMethod;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ShippingMethodMapper {
    /**
     * 新增配送方式
     * @param name 配送方式名称
     */
    void insertShippingMethod(ShippingMethod shippingMethod);
    
    /**
     * 修改配送方式
     * @param name 配送方式名称
     * @param id 配送方式id
     */
    void updateShippingMethod(ShippingMethod shippingMethod);
    
    /**
     * 删除配送方式
     * @param id 活动id
     */
    void deleteShippingMethod(Long id);
    
    /**
     * 通过id查看配送方式
     * @param id 商品id
     * 
     * @return 
     */
    ShippingMethod findById(Long id);
    
    /**
     * 查询所有的配送方式
     * @return 
     */
    List<ShippingMethod> findShippingMethod(ShippingMethod shippingMethod);
}
