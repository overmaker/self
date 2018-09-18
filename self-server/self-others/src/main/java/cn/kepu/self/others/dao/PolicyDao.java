package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.Policy;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface PolicyDao {
    void updatePolicy(String content, Long id);
    
    Policy findPolicy(Long id);
    
    Policy selectByPolicy(Long type);
    
    List<Policy> selectPolicy();
}
