package cn.kepu.self.shop.service;

import cn.kepu.self.shop.dao.ProductTypeDao;
import cn.kepu.self.shop.entity.ProductType;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum ProductTypeService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ProductTypeService() {}

    public static ProductTypeService getInstance() {
        return INSTANCE;
    }

    private ProductTypeDao productTypeDao;

    public void setProductTypeDao(ProductTypeDao productTypeDao) {
        this.productTypeDao = productTypeDao;
    }

    public int addProductType(String name) {
        if (name == null || name.isEmpty()) {
            return 2;
        }
        return productTypeDao.addProductType(name);
    }
    
    public int updateProductType(String name, Long id) {
        if (name == null || name.isEmpty()) {
            return 2;
        }
        return productTypeDao.updateProductType(name, id);
    }
    
    public void deleteProductType(Long id) {
        productTypeDao.deleteProductType(id);
    }
    
    public BinaryPair<List<ProductType>, Long> selectProductType(String name, int offset, int pageSize) {
        return productTypeDao.selectProductType(name, offset, pageSize);
    }
}
