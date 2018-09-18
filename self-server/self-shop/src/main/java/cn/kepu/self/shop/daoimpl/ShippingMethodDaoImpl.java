package cn.kepu.self.shop.daoimpl;

import cn.kepu.self.shop.dao.ShippingMethodDao;
import cn.kepu.self.shop.entity.ShippingMethod;
import cn.kepu.self.shop.mybatis.mapper.ShippingMethodMapper;
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
public class ShippingMethodDaoImpl implements ShippingMethodDao {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private ShippingMethodMapper shippingMethodMapper;

    public void setShippingMethodMapper(ShippingMethodMapper shippingMethodMapper) {
        this.shippingMethodMapper = shippingMethodMapper;
    }

    @Override
    public int addShippingMethod(String name, String logistics_company, int first_weight, int continue_weight, Double first_price, Double continue_price) {
        try {
            ShippingMethod shippingMethod = new ShippingMethod();
            shippingMethod.setName(name);
            shippingMethod.setLogistics_company(logistics_company);
            shippingMethod.setFirst_weight(first_weight);
            shippingMethod.setContinue_weight(continue_weight);
            shippingMethod.setFirst_price(first_price);
            shippingMethod.setContinue_price(continue_price);
            shippingMethodMapper.insertShippingMethod(shippingMethod);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            logger.error("添加配送方式时异常", e);
            return 2;
        }
        return 0;
    }

    @Override
    public int updateShippingMethod(String name, String logistics_company, int first_weight, int continue_weight, Double first_price, Double continue_price, Long id) {
        try {
            ShippingMethod shippingMethod = new ShippingMethod();
            shippingMethod.setId(id);
            shippingMethod.setName(name);
            shippingMethod.setLogistics_company(logistics_company);
            shippingMethod.setFirst_weight(first_weight);
            shippingMethod.setContinue_weight(continue_weight);
            shippingMethod.setFirst_price(first_price);
            shippingMethod.setContinue_price(continue_price);
            shippingMethodMapper.updateShippingMethod(shippingMethod);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            logger.error("修改配送方式时异常", e);
            return 2;
        }
        return 0;
    }

    @Override
    public void deleteShippingMethod(Long id) {
        try {
            shippingMethodMapper.deleteShippingMethod(id);
        } catch (final Exception e) {
            logger.error("删除配送方式时异常", e);
        }
    }
    
    @Override
    public ShippingMethod findById(Long id) {
        return shippingMethodMapper.findById(id);
    }
    
    @Override
    public BinaryPair<List<ShippingMethod>, Long> selectShippingMethod(String name, int offset, int pageSize) {
        ShippingMethod shippingMethod = new ShippingMethod();
        shippingMethod.setName(name);
        
        PageHelper.offsetPage(offset, pageSize);
        List<ShippingMethod> list = shippingMethodMapper.findShippingMethod(shippingMethod);
        PageInfo<ShippingMethod> pageInfo = new PageInfo(list);
        BinaryPair<List<ShippingMethod>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
    
}
