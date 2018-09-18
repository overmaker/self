package cn.kepu.self.commons.dao;

import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;

/**
 *
 * @author 劉一童
 */
public interface UserDAO {

    void addOrUpdateUser(User user,
            UserInfo userInfo);

    public User getUser(String token);

    boolean registerUser(User user);
}
