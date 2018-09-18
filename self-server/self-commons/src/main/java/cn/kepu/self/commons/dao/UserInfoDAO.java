package cn.kepu.self.commons.dao;

import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 * 用户基本信息
 *
 * @author 马亚星
 */
public interface UserInfoDAO {

    /**
     * 用户信息一览
     *
     * @param name 真实姓名
     * @param nickname 昵称
     * @param isVip 是否vip
     * @param isVolunteer 是否是志愿者
     * @return
     */
    BinaryPair<List<UserInfo>, Long> selUserInfo(int offset, int pageSize, String name, String nickname, String mobile, String email, Boolean isVip, Boolean isVolunteer);

    /**
     * 查询用户信息
     *
     * @param uid
     * @return 查询结果
     */
    UserInfo selUserInfoById(Long uid);

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

    void insertOrUpdateUserInfo(UserInfo userInfo);

}
