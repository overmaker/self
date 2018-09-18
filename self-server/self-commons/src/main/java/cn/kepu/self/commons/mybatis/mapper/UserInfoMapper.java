package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.UserInfo;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface UserInfoMapper {

    List<UserInfo> selectUserInfo(UserInfo userInfo);

    void insertOrUpdateUserInfo(UserInfo userInfo);

    /**
     * 查询用户信息
     *
     * @param uid
     * @return 查询结果
     */
    UserInfo selectUserInfoById(Long uid);

    /**
     * 管理员修改是否时Vip
     *
     * @param uid 用户id
     * @param vip 是否是VIP
     */
    void updateUserInfoIsVip(Long uid, boolean vip);

    /**
     *
     * 管理员修改是否时志愿者
     *
     * @param uid 用户id
     * @param volunteer 是否是志愿者
     */
    void updateUserInfoIsVolunteer(Long uid, boolean volunteer);

}
