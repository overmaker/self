package cn.kepu.self.commons.service;

import cn.kepu.self.commons.util.IpUtil;

/**
 *
 * @author 劉一童
 */
public enum IpService {
    INSTANCE;
    
    private IpService(){}
    
    public static IpService getInstance() {
        return INSTANCE;
    }
    
    private IpUtil ipUtil;

    public void setIpUtil(IpUtil ipUtil) {
        this.ipUtil = ipUtil;
    }
    
    public boolean ipExistsInRange(String ip){
    	return  ipUtil.ipExistsInRange(ip);
    }
    
}
