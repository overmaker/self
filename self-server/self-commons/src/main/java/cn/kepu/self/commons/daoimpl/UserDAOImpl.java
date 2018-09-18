package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.commons.dao.UserDAO;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.commons.mybatis.mapper.UserInfoMapper;
import cn.kepu.self.commons.mybatis.mapper.UserMapper;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 *
 * @author 劉一童
 */
public class UserDAOImpl implements UserDAO {

    private final UserMapper userMapper;
    private final UserInfoMapper userInfoMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public UserDAOImpl(UserMapper userMapper,
            UserInfoMapper userInfoMapper,
            JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.userMapper = userMapper;
        this.userInfoMapper = userInfoMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public void addOrUpdateUser(User user,
            UserInfo userInfo) {

        transactionTemplate.execute(status -> {
            try {
                userMapper.insertOrUpdateUser(user);

                userInfo.setId(user.getId());
                userInfoMapper.insertOrUpdateUserInfo(userInfo);

                jdbcTemplate.update("INSERT INTO kepu_self_user_advance(id) VALUES (?) ON DUPLICATE KEY UPDATE gmt_modified = NOW();", user.getId());
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });

    }

    @Override
    public boolean registerUser(User user) {
        return transactionTemplate.execute(status -> {
            try {
                userMapper.insertUser(user);
                jdbcTemplate.update("INSERT INTO kepu_self_user_info(id,mobile) VALUES(?,?)", user.getId(),user.getUserInfo().getMobile());
                jdbcTemplate.update("INSERT INTO kepu_self_user_advance(id) VALUES(?)", user.getId());
                return true;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                if (err instanceof DuplicateKeyException) {
                    return false;
                }
                throw err;
            }
        });
    }

    @Override
    public User getUser(String token) {
        return userMapper.selectByToken(token);
    }

}
