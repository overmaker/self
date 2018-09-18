package cn.kepu.self.shop.service;

import cn.kepu.self.commons.entity.User;
import cn.kepu.self.shop.dao.OrderDao;
import cn.kepu.self.shop.entity.Order;
import cn.kepu.self.shop.entity.ShippingMethod;
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
public enum OrderService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private OrderService() {}

    public static OrderService getInstance() {
        return INSTANCE;
    }

    private OrderDao orderDao;
    
    private static final SimpleDateFormat DATETIME_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");
    
    /**
     * 生成订单编号
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

    public void setOrderDao(OrderDao orderDao) {
        this.orderDao = orderDao;
    }
    
    public int addOrder(Order order) {
        return orderDao.addOrder(order);
    }
    
    public int updateOrderz(Long id, int paymentMethod) {
        return orderDao.updateOrderz(id, paymentMethod);
    }
    
    public int updateOrderf(Long id) {
        return orderDao.updateOrderf(id);
    }
    
    public int updateOrderw(Long id) {
        return orderDao.updateOrderw(id);
    }
    
    public Order findById(Long id) {
        return orderDao.findById(id);
    }
    
    public BinaryPair<List<Order>, Long> selectOrder(String sn, Long id, int offset, int pageSize) {
        return orderDao.selectOrder(sn, id, offset, pageSize);
    }
}
