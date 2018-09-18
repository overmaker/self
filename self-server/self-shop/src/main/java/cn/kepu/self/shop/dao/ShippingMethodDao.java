package cn.kepu.self.shop.dao;

import cn.kepu.self.shop.entity.ShippingMethod;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ShippingMethodDao {
    /**
     * 新增配送方式
     * @param name 配送方式名称
     * @param logistics_company 物流公司
     * @param first_weight 首重量
     * @param continue_weight 续重量
     * @param first_price 首重价格
     * @param continue_price 续重价格
     * @return 新增结果。0：成功，1：分类名已存在，2：其他错误
     */
    int addShippingMethod(String name, String logistics_company, int first_weight, int continue_weight, Double first_price, Double continue_price);
    
    /**
     * 修改配送方式
     * @param name 配送方式名称
     * @param logistics_company 物流公司
     * @param first_weight 首重量
     * @param continue_weight 续重量
     * @param first_price 首重价格
     * @param continue_price 续重价格
     * @param id 配送方式id
     * @return 修改结果。0：成功，1：分类名已存在，2：其他错误。
     */
    int updateShippingMethod(String name, String logistics_company, int first_weight, int continue_weight, Double first_price, Double continue_price, Long id);
    
    /**
     * 删除配送方式
     * @param id 配送方式id
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
     *
     * @return
     */
    BinaryPair<List<ShippingMethod>, Long> selectShippingMethod(String name, int offset, int pageSize);
}
