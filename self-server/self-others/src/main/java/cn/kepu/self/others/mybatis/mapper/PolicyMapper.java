package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.Policy;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface PolicyMapper {
    void updatePolicy(Policy policy);
    
    Policy findPolicy(Long id);
    
    Policy selectByPolicy(Policy policy);
    
    List<Policy> selectPolicy();
}
