package cn.kepu.self.commons.dao;

import cn.kepu.self.commons.entity.Role;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface RoleDAO {

    BinaryPair<List<Role>, Long> getRoleList(int offset, int count, String name);
    
    void addRole(Role role);
    
    void updateRole(Role role);
    
    Role getRoleById(Long roleId);
}
