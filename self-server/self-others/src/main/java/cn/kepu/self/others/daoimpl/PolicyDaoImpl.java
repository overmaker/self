package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.PolicyDao;
import cn.kepu.self.others.entity.Policy;
import cn.kepu.self.others.mybatis.mapper.PolicyMapper;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 *
 * @author 李成志
 */
public class PolicyDaoImpl implements PolicyDao {
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private PolicyMapper policyMapper;

    public void setPolicyMapper(PolicyMapper policyMapper) {
        this.policyMapper = policyMapper;
    }

    @Override
    public void updatePolicy(String content, Long id) {
        Policy policy = new Policy();
        policy.setContent(content);
        policy.setId(id);
        policyMapper.updatePolicy(policy);
    }
    
    @Override
    public Policy findPolicy(Long id) {
        return policyMapper.findPolicy(id);
    }
    
    @Override
    public Policy selectByPolicy(Long type) {
        Policy policy = new Policy();
        policy.setType(type);
        return policyMapper.selectByPolicy(policy);
    }
    
    @Override
    public List<Policy> selectPolicy() {
        return policyMapper.selectPolicy();
    }

}
