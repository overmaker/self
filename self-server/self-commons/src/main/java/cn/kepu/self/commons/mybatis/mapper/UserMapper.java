package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.User;

/**
 *
 * @author 劉一童
 */
public interface UserMapper {

    void insertOrUpdateUser(User user);

    void insertUser(User user);

    public User selectByToken(String token);

}
