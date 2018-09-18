package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.Subscribe;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface SubscribeMapper {

    void insertSubscribe(Subscribe subscribe);

    void deleteSubscribe(String email);

    List<Subscribe> selSubscribe();
}
