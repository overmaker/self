package cn.kepu.self.shop.dao;

/**
 *
 * @author 李成志
 */
public interface ProductInfoDao {
    /**
     * 修改商品信息
     * @param id 商品id
     * @param stock 商品库存
     * @param sales_num 商品已售数量
     * @return 新增结果。0：成功，1：活动标题已存在，2：其他错误
     */
    int updateProductInfo(Long id, Integer sales_num, Integer stock);
}
