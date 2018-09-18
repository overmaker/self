package cn.kepu.self.shop.mybatis.mapper;

import cn.kepu.self.shop.entity.Product;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ProductMapper {

    /**
     * 新增商品
     *
     * @param product 商品
     * @return 新增结果。0：成功，1：活动标题已存在，2：其他错误
     */
    int addProduct(Product product);

    /**
     * 修改商品
     *
     * @param product
     */
    void copyProduct(Product product);

    int updateProduct(Product product);

    /**
     * 通过类别查看商品
     *
     * @param type 商品类别
     *
     * @return
     */
    List<Product> findByType(Product product);

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
    List<Product> selectProduct(Product product);

}
