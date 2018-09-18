package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.commons.dao.SubscribeDAO;
import cn.kepu.self.commons.entity.Subscribe;
import cn.kepu.self.commons.mybatis.mapper.SubscribeMapper;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public class SubscribeDAOImpl implements SubscribeDAO {

    private final SubscribeMapper subscribeMapper;

    public SubscribeDAOImpl(SubscribeMapper subscribeMapper) {
        this.subscribeMapper = subscribeMapper;
    }

    @Override
    public void insertSubscribe(Subscribe subscribe) {
        subscribeMapper.insertSubscribe(subscribe);
    }

    @Override
    public void deleteSubscribe(String email) {
        subscribeMapper.deleteSubscribe(email);
    }

    @Override
    public List<Subscribe> selectAll() {
        return subscribeMapper.selSubscribe();
    }

}
