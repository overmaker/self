package cn.kepu.self.shop.mybatis.mapper;

import cn.kepu.self.shop.entity.ProductType;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ProductTypeMapper {
    /**
     * 新增商品分类
     * @param name 活动分类名称
     */
    void insertProductType(String name);
    
    /**
     * 修改商品分类
     * @param name 活动分类名称
     * @param id 活动分类id
     */
    void updateProductType(String name, Long id);
    
    /**
     * 删除商品分类
     * @param id 活动id
     */
    void deleteProductType(Long id);
    
    /**
     * 查询所有的商品分类
     * @return 
     */
    List<ProductType> findProductType(ProductType productType);
}
