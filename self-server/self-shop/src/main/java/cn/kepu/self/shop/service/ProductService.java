package cn.kepu.self.shop.service;

import cn.kepu.self.shop.dao.ProductDao;
import cn.kepu.self.shop.entity.Product;
import cn.kepu.self.shop.entity.ProductType;
import cn.kepu.self.util.BinaryPair;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 *
 * @author 李成志
 */
public enum ProductService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ProductService() {
    }

    public static ProductService getInstance() {
        return INSTANCE;
    }

    private ProductDao productDao;

    private static final SimpleDateFormat DATETIME_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");

    /**
     * 生成商品编号
     *
     * @return 活动序列号
     */
    private static String generateSN() {
        Random r = new Random();
        return DATETIME_FORMAT.format(new Date()) + Stream.of(
                (long) r.nextInt(16),
                (long) r.nextInt(16),
                (long) r.nextInt(16),
                (long) r.nextInt(16)).
                map(n -> Long.toHexString(n)).collect(Collectors.joining("")).toUpperCase();
    }

    public void setProductDao(ProductDao productDao) {
        this.productDao = productDao;
    }

    public int addProduct(String name, String introduction, String thumbnail, String image, String sn, Double price, Double weight, Integer score, Boolean is_recommend, Boolean is_enable, Long type, Integer stock) {
        ProductType productType = new ProductType();
        productType.setId(type);

        Product product = new Product();
        product.setName(name);
        product.setIntroduction(introduction);
        product.setThumbnail(thumbnail);
        product.setImage(image);
        product.setSn(generateSN());
        product.setPrice(price);
        product.setWeight(weight);
        product.setScore(score);
        if (is_recommend == false) {
            product.setIs_recommend(0);
        } else {
            product.setIs_recommend(1);
        }
        if (is_enable == false) {
            product.setIs_enable(0);
        } else {
            product.setIs_enable(1);
        }
        product.setType(productType);

        return productDao.addProduct(product, stock);
    }

    public void copyProcuct(Long id) {
        String sn = generateSN();
        productDao.copyProcuct(id, sn);
    }

    public int updateProduct(Long id, String name, String introduction, String thumbnail, String image, String sn, Double price, Double weight, Integer score, Boolean is_recommend, Boolean is_enable, Long type, Integer stock) {
        ProductType productType = new ProductType();
        productType.setId(type);

        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setIntroduction(introduction);
        product.setThumbnail(thumbnail);
        product.setImage(image);
        product.setPrice(price);
        product.setWeight(weight);
        product.setScore(score);
        if (is_recommend == false) {
            product.setIs_recommend(0);
        } else {
            product.setIs_recommend(1);
        }
        if (is_enable == false) {
            product.setIs_enable(0);
        } else {
            product.setIs_enable(1);
        }
        product.setType(productType);
        return productDao.updateProduct(product, stock);
    }

    public BinaryPair<List<Product>, Long> findByType(int offset, int count, Long type) {
        return productDao.findByType(offset, count, type);
    }

    public Product findById(Long id) {
        return productDao.findById(id);
    }

    public BinaryPair<List<Product>, Long> selectProduct(String name, int offset, int pageSize) {
        return productDao.selectProduct(name, offset, pageSize);
    }

}
