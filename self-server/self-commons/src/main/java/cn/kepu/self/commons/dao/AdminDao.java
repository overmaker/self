package cn.kepu.self.commons.dao;

import cn.kepu.self.commons.entity.User;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface AdminDao {

    boolean insertAdmin(String userName, String password, String name, Long roleId);

    void updateAdmin(Long id, String password, String name, Long roleId);

    User selectById(Long id);

    BinaryPair<List<User>, Long> selectAll(String name, int offset, int pageSize);
}
