package cn.kepu.self.shop.daoimpl;

import cn.kepu.self.commons.entity.User;
import cn.kepu.self.shop.dao.OrderDao;
import cn.kepu.self.shop.entity.Order;
import cn.kepu.self.shop.entity.ProductInfo;
import cn.kepu.self.shop.mybatis.mapper.OrderMapper;
import cn.kepu.self.shop.mybatis.mapper.ProductInfoMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.transaction.support.TransactionTemplate;

/**
 *
 * @author 李成志
 */
public class OrderDaoImpl implements OrderDao {
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private final OrderMapper orderMapper;
    private final ProductInfoMapper productInfoMapper;
    private final TransactionTemplate transactionTemplate;

    public OrderDaoImpl(OrderMapper orderMapper,ProductInfoMapper productInfoMapper,TransactionTemplate transactionTemplate) {
        this.orderMapper = orderMapper;
        this.productInfoMapper = productInfoMapper;   
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public int addOrder(Order order) {
        try {
            
            orderMapper.addOrder(order);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            logger.error("添加订单时异常", e);
            return 2;
        }
        return 0;
    }

    @Override
    public int updateOrderz(Long id, int paymentMethod) {
        try {
            orderMapper.updateOrderz(id, paymentMethod);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            logger.error("订单支付时异常", e);
            return 2;
        }
        return 0;
    }

    @Override
    public int updateOrderf(Long id) {
        return transactionTemplate.execute(status -> {
            try {
                orderMapper.updateOrderf(id);
                return 0;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }
    
    @Override
    public int updateOrderw(Long id) {
        try {
            orderMapper.updateOrderw(id);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            logger.error("订单完成时异常", e);
            return 2;
        }
        return 0;
    }

    @Override
    public Order findById(Long id) {
        return orderMapper.findById(id);
    }

    @Override
    public BinaryPair<List<Order>, Long> selectOrder(String sn, Long id, int offset, int pageSize) {
        User user = new User();
        user.setId(id);
        
        Order order = new Order();
        order.setSn(sn);
        order.setUser(user);
        
        PageHelper.offsetPage(offset, pageSize);
        List<Order> list = orderMapper.selectOrder(order);
        PageInfo<Order> pageInfo = new PageInfo(list);
        BinaryPair<List<Order>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
