package cn.kepu.self.shop.service;

import cn.kepu.self.shop.dao.ProductInfoDao;

/**
 *
 * @author 李成志
 */
public enum ProductInfoService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ProductInfoService() {}

    public static ProductInfoService getInstance() {
        return INSTANCE;
    }

    private ProductInfoDao productInfoDao;

    public void setProductInfoDao(ProductInfoDao productInfoDao) {
        this.productInfoDao = productInfoDao;
    }
    
    public int updateProductInfo(Long id, Integer sales_num, Integer stock) {
        return productInfoDao.updateProductInfo(id, sales_num, stock);
    }
}
