package cn.kepu.self.shop.daoimpl;

import cn.kepu.self.shop.dao.ProductDao;
import cn.kepu.self.shop.entity.Product;
import cn.kepu.self.shop.entity.ProductInfo;
import cn.kepu.self.shop.entity.ProductType;
import cn.kepu.self.shop.mybatis.mapper.ProductInfoMapper;
import cn.kepu.self.shop.mybatis.mapper.ProductMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 *
 * @author 李成志
 */
public class ProductDaoImpl implements ProductDao {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private final ProductMapper productMapper;
    private final ProductInfoMapper productInfoMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public ProductDaoImpl(ProductMapper productMapper, ProductInfoMapper productInfoMapper, JdbcTemplate jdbcTemplate, TransactionTemplate transactionTemplate) {
        this.productMapper = productMapper;
        this.productInfoMapper = productInfoMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public int addProduct(Product product, Integer stock) {
        return transactionTemplate.execute(status -> {
            try {
                productMapper.addProduct(product);
                productInfoMapper.insertProductInfo(product.getId(), stock);
                return 0;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public void copyProcuct(Long id, String sn) {
        final Product product = new Product();
        product.setId(id);
        product.setSn(sn);
        transactionTemplate.execute(status -> {
            try {
                productMapper.copyProduct(product);
                jdbcTemplate.update("INSERT INTO kepu_self_product_info(id) VALUES(?)", product.getId());
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public int updateProduct(Product product, Integer stock) {

        ProductInfo productInfo = productInfoMapper.findById(product.getId());
        productInfo.setId(product.getId());
        productInfo.setStock((productInfo.getStock() + stock));
        return transactionTemplate.execute(status -> {
            try {
                productMapper.updateProduct(product);
                productInfoMapper.updateProductInfo(productInfo);
                return 0;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public BinaryPair<List<Product>, Long> findByType(int offset, int pageSize, Long type) {
        PageHelper.offsetPage(offset, pageSize);
        ProductType productType = new ProductType();
        productType.setId(type);

        Product product = new Product();
        product.setType(productType);
        List<Product> list = productMapper.findByType(product);
        PageInfo<Product> pageInfo = new PageInfo(list);
        BinaryPair<List<Product>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public Product findById(Long id) {
        return productMapper.findById(id);
    }

    @Override
    public BinaryPair<List<Product>, Long> selectProduct(String name, int offset, int pageSize) {
        Product product = new Product();
        product.setName(name);

        PageHelper.offsetPage(offset, pageSize);
        List<Product> list = productMapper.selectProduct(product);
        PageInfo<Product> pageInfo = new PageInfo(list);
        BinaryPair<List<Product>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
}
