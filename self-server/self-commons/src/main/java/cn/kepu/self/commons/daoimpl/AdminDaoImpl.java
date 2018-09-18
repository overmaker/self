package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.commons.dao.AdminDao;
import cn.kepu.self.commons.entity.Role;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.mybatis.mapper.AdminMapper;
import static cn.kepu.self.commons.util.Util.generateUid;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 *
 * @author 李成志
 */
public class AdminDaoImpl implements AdminDao {

    private final AdminMapper adminMapper;

    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public AdminDaoImpl(AdminMapper adminMapper,
            JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.adminMapper = adminMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public boolean insertAdmin(String userName, String password, String name, Long roleId) {
        final User admin = new User();
        admin.setUserName(userName);
        admin.setPassword(password);
        admin.setUid(generateUid());
        Role role = new Role();
        role.setId(roleId);
        admin.setRole(role);

        return transactionTemplate.execute(status -> {
            try {
                adminMapper.insertAdmin(admin);
                jdbcTemplate.update("INSERT INTO kepu_self_user_info(id, name) VALUES(?, ?)", admin.getId(), name);
                jdbcTemplate.update("INSERT INTO kepu_self_user_advance(id) VALUES(?)", admin.getId());
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
    public void updateAdmin(Long id, String password, String name, Long roleId) {
        final User admin = new User();
        admin.setId(id);
        admin.setPassword(password);
        Role role = new Role();
        role.setId(roleId);
        admin.setRole(role);
        
        transactionTemplate.execute(status -> {
            try {
                adminMapper.updateAdmin(admin);
                jdbcTemplate.update("UPDATE kepu_self_user_info SET gmt_modified=NOW(), name=? WHERE id=?", name, admin.getId());
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public User selectById(Long id) {
        return adminMapper.selectById(id);
    }

    @Override
    public BinaryPair<List<User>, Long> selectAll(String name, int offset, int pageSize) {
        User admin = new User();
        admin.setUserName(name);

        PageHelper.offsetPage(offset, pageSize);
        List<User> list = adminMapper.selectAll(admin);
        PageInfo<User> pageInfo = new PageInfo(list);
        BinaryPair<List<User>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
