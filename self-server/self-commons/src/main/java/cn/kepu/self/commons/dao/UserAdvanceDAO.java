package cn.kepu.self.commons.dao;

import cn.kepu.self.commons.entity.UserAdvance;

/**
 * 用户证书
 *
 * @author 马亚星
 */
public interface UserAdvanceDAO {

    void addOrUpdateUserAdvance(UserAdvance userAdvance);
    
    /**
     * 删除用户证书
     * 
     * @param uid
     * @return 
     */
    int delUserAdvance(Long uid);
    
    /**
     * 查询证书
     * 
     * @param uid
     * @return 
     */
    UserAdvance selUserAdvance(Long uid);
}
