package cn.kepu.self.shop.mybatis.mapper;

import cn.kepu.self.shop.entity.ProductInfo;

/**
 *
 * @author 李成志
 */
public interface ProductInfoMapper {
    /**
     * 新增商品信息
     * @param id 商品id
     * @param stock 商品库存
     * @return 新增结果。0：成功，1：活动标题已存在，2：其他错误
     */
    int insertProductInfo(Long id, int stock);
    
    /**
     * 修改商品信息
     * @param productInfo 商品信息
     * @return 新增结果。0：成功，1：活动标题已存在，2：其他错误
     */
    int updateProductInfo(ProductInfo productInfo);
    
    /**
     * 通过id查询商品信息
     * @param id 商品id
     * @return 新增结果。0：成功，1：活动标题已存在，2：其他错误
     */
    ProductInfo findById(Long id);
}
