package cn.kepu.self.shop.dao;

import cn.kepu.self.shop.entity.Product;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ProductDao {

    /**
     * 新增商品
     *
     * @param product 商品
     * @param stock 商品库存
     * @return 新增结果。0：成功，1：活动标题已存在，2：其他错误
     */
    int addProduct(Product product, Integer stock);

    /**
     * 修改商品
     *
     * @param product 商品
     * @param stock 商品库存
     * @return 新增结果。0：成功，1：活动标题已存在，2：其他错误
     */
    int updateProduct(Product product, Integer stock);

    void copyProcuct(Long id, String sn);

    /**
     * 通过类别查看商品
     *
     * @param count
     * @param offset
     * @param type 商品类别
     *
     * @return
     */
    BinaryPair<List<Product>, Long> findByType(int offset, int count, Long type);

    /**
     * 通过id查看商品
     *
     * @param id 商品id
     *
     * @return
     */
    Product findById(Long id);

    /**
     * 查询所有的商品
     *
     * @return
     */
    BinaryPair<List<Product>, Long> selectProduct(String name, int offset, int pageSize);
}
