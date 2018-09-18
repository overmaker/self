package cn.kepu.self.commons.dao;

import cn.kepu.self.commons.entity.Subscribe;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface SubscribeDAO {

    void insertSubscribe(Subscribe subscribe);
    
    List<Subscribe> selectAll();

    void deleteSubscribe(String email);
}
