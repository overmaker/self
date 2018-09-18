package cn.kepu.self.commons.service;

import cn.kepu.self.commons.dao.UserInfoDAO;
import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 * 用户基本信息
 *
 * @author 马亚星
 */
public enum UserInfoService {
    INSTANCE;

    private UserInfoService() {
    }

    public static UserInfoService getInstance() {
        return INSTANCE;
    }

    private UserInfoDAO userInfoDAO;

    public void setUserInfoDAO(UserInfoDAO userInfoDAO) {
        this.userInfoDAO = userInfoDAO;
    }

    public BinaryPair<List<UserInfo>, Long> selectUserInfo(int offset, int pageSize, String name, String nickname, String mobile, String email, Boolean isVolunteer, Boolean isVip) {
        return userInfoDAO.selUserInfo(offset, pageSize, name, nickname, mobile, email, isVip, isVolunteer);
    }

    /**
     * 查询用户信息
     *
     * @param uid
     * @return 查询结果
     */
    public UserInfo selectUserInfoById(Long uid) {
        return userInfoDAO.selUserInfoById(uid);
    }

    public void updateUserInfoIsVip(Long uid, boolean vip) {
        userInfoDAO.updateUserInfoIsVip(uid, vip);
    }

    public void updateUserInfoIsVolunteer(Long uid, boolean volunteer) {
        userInfoDAO.updateUserInfoIsVolunteer(uid, volunteer);
    }

    public void insertOrUpdateUserInfo(UserInfo userInfo) {
        userInfoDAO.insertOrUpdateUserInfo(userInfo);

    }
}
