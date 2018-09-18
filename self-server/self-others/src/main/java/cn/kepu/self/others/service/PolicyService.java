package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.PolicyDao;
import cn.kepu.self.others.entity.Policy;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum PolicyService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private PolicyService() {}

    public static PolicyService getInstance() {
        return INSTANCE;
    }

    private PolicyDao policyDao;
    
    public void setPolicyDao(PolicyDao policyDao) {
        this.policyDao = policyDao;
    }
    
    public void updatePolicy(String content, Long id) {
        policyDao.updatePolicy(content, id);
    }
    
    public Policy findPolicy(Long id) {
        return policyDao.findPolicy(id);
    }
    
    public Policy selectByPolicy(Long type){
        return policyDao.selectByPolicy(type);
    }
    
    public List<Policy> selectPolicy(){
        return policyDao.selectPolicy();
    }
}
