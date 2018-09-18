package cn.kepu.self.shop.dao;

import cn.kepu.self.shop.entity.ProductType;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ProductTypeDao {
    /**
     * 新增商品分类
     * @param name 活动分类名称
     * @return 新增结果。0：成功，1：分类名已存在，2：其他错误
     */
    int addProductType(String name);
    
    /**
     * 修改商品分类
     * @param name 活动分类名称
     * @param id 活动分类id
     * @return 修改结果。0：成功，1：分类名已存在，2：其他错误。
     */
    int updateProductType(String name, Long id);
    
    /**
     * 删除商品分类
     * @param id 活动id
     */
    void deleteProductType(Long id);
    
    /**
     * 查询所有的商品分类
     *
     * @return
     */
    BinaryPair<List<ProductType>, Long> selectProductType(String name, int offset, int pageSize);
}
