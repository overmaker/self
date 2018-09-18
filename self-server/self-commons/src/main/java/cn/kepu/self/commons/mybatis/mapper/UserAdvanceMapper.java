package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.UserAdvance;

/**
 * 用户证书
 *
 * @author 马亚星
 */
public interface UserAdvanceMapper {

    void insertOrUpdateUserAdvance(UserAdvance userAdvance);

    /**
     * 删除用户证书
     *
     * @param uid
     * @return
     */
    int deleteUserAdvance(Long uid);

    /**
     * 查询证书
     *
     * @param uid
     * @return
     */
    UserAdvance selectUserAdvance(Long uid);
}
