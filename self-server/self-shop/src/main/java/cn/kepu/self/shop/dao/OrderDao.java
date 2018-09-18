package cn.kepu.self.shop.dao;

import cn.kepu.self.shop.entity.Order;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface OrderDao {
    
    /**
     * 新增订单
     * @param order 订单
     * @return 新增结果。0：成功，1：活动标题已存在，2：其他错误
     */
    int addOrder(Order order);
    
    /**
     * 修改订单
     * @param id 订单id
     * @param paymentMethod 支付方式
     * @return 新增结果。0：成功，1：库存不足，2：其他错误
     */
    int updateOrderz(Long id, int paymentMethod);
    
    /**
     * 修改订单
     * @param id 订单id
     * @return 新增结果。0：成功，1：库存不足，2：其他错误
     */
    int updateOrderf(Long id);
    
    /**
     * 修改订单
     * @param id 订单id
     * @return 新增结果。0：成功，1：失败
     */
    int updateOrderw(Long id);
    
    /**
     * 通过id查看订单
     * @param id 订单id
     * 
     * @return 
     */
    Order findById(Long id);
    
    /**
     * 查询所有的订单
     *
     * @return
     */
    BinaryPair<List<Order>, Long> selectOrder(String sn, Long id, int offset, int pageSize);
}
