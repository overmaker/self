package cn.kepu.self.shop.service;

import cn.kepu.self.shop.dao.ShippingMethodDao;
import cn.kepu.self.shop.entity.ShippingMethod;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum ShippingMethodService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ShippingMethodService() {}

    public static ShippingMethodService getInstance() {
        return INSTANCE;
    }

    private ShippingMethodDao shippingMethodDao;

    public void setShippingMethodDao(ShippingMethodDao shippingMethodDao) {
        this.shippingMethodDao = shippingMethodDao;
    }

    public int addShippingMethod(String name, String logistics_company, int first_weight, int continue_weight, Double first_price, Double continue_price){
        return shippingMethodDao.addShippingMethod(name, logistics_company, first_weight, continue_weight, first_price, continue_price);
    }
    
    public int updateShippingMethod(String name, String logistics_company, int first_weight, int continue_weight, Double first_price, Double continue_price, Long id) {
        return shippingMethodDao.updateShippingMethod(name, logistics_company, first_weight, continue_weight, first_price, continue_price, id);
    }
    
    public void deleteShippingMethod(Long id) {
        shippingMethodDao.deleteShippingMethod(id);
    }
    
    public ShippingMethod findById(Long id) {
        return shippingMethodDao.findById(id);
    }
    
    public BinaryPair<List<ShippingMethod>, Long> selectShippingMethod(String name, int offset, int pageSize) {
        return shippingMethodDao.selectShippingMethod(name, offset, pageSize);
    }
}
