package cn.kepu.self.shop.daoimpl;

import cn.kepu.self.shop.dao.ProductTypeDao;
import cn.kepu.self.shop.entity.ProductType;
import cn.kepu.self.shop.mybatis.mapper.ProductTypeMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 李成志
 */
public class ProductTypeDaoImpl implements ProductTypeDao {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private ProductTypeMapper productTypeMapper;

    public void setProductTypeMapper(ProductTypeMapper productTypeMapper) {
        this.productTypeMapper = productTypeMapper;
    }

    @Override
    public int addProductType(String name) {
        try {
            productTypeMapper.insertProductType(name);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            logger.error("添加商品类型时异常", e);
            return 2;
        }
        return 0;
    }

    @Override
    public int updateProductType(String name, Long id) {
        try {
            productTypeMapper.updateProductType(name, id);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            logger.error("修改商品类型时异常", e);
            return 2;
        }
        return 0;
    }

    @Override
    public void deleteProductType(Long id) {
        try {
            productTypeMapper.deleteProductType(id);
        } catch (final Exception e) {
            logger.error("删除商品类型时异常", e);
        }
    }
    
    @Override
    public BinaryPair<List<ProductType>, Long> selectProductType(String name, int offset, int pageSize) {
        ProductType productType = new ProductType();
        productType.setName(name);
        
        PageHelper.offsetPage(offset, pageSize);
        List<ProductType> list = productTypeMapper.findProductType(productType);
        PageInfo<ProductType> pageInfo = new PageInfo(list);
        BinaryPair<List<ProductType>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
    
}
