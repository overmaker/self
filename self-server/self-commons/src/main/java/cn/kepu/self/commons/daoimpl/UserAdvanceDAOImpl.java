package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.commons.dao.UserAdvanceDAO;
import cn.kepu.self.commons.entity.UserAdvance;
import cn.kepu.self.commons.mybatis.mapper.UserAdvanceMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * 用户证书
 *
 * @author 马亚星
 */
public class UserAdvanceDAOImpl implements UserAdvanceDAO {

    private final UserAdvanceMapper userAdvanceMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public UserAdvanceDAOImpl(UserAdvanceMapper userAdvanceMapper, JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.userAdvanceMapper = userAdvanceMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public void addOrUpdateUserAdvance(UserAdvance userAdvance) {

        transactionTemplate.execute(status -> {
            try {
                userAdvanceMapper.insertOrUpdateUserAdvance(userAdvance);

                jdbcTemplate.update("UPDATE kepu_self_user_info SET name='"+userAdvance.getName()+"' WHERE id="+userAdvance.getId()+";");
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public int delUserAdvance(Long uid) {
        try {
            userAdvanceMapper.deleteUserAdvance(uid);
        } catch (Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public UserAdvance selUserAdvance(Long uid) {
        return userAdvanceMapper.selectUserAdvance(uid);
    }

}
