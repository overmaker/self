package cn.kepu.self.shop.daoimpl;

import cn.kepu.self.shop.dao.ProductInfoDao;
import cn.kepu.self.shop.entity.ProductInfo;
import cn.kepu.self.shop.mybatis.mapper.ProductInfoMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 *
 * @author 李成志
 */
public class ProductInfoDaoImpl implements ProductInfoDao {
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private ProductInfoMapper productInfoMapper;

    public void setProductInfoMapper(ProductInfoMapper productInfoMapper) {
        this.productInfoMapper = productInfoMapper;
    }

    @Override
    public int updateProductInfo(Long id, Integer sales_num, Integer stock) {
        ProductInfo productInfo = new ProductInfo();
        productInfo.setId(id);
        productInfo.setStock(stock);
        productInfo.setSales_num(sales_num);
        
        return productInfoMapper.updateProductInfo(productInfo);
    }
    
}
