package cn.kepu.self.commons.service;

import cn.kepu.self.commons.dao.RoleDAO;
import cn.kepu.self.commons.entity.Role;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public enum RoleService {
    INSTANCE;

    private RoleService() {}

    public static RoleService getInstance() {
        return INSTANCE;
    }
    
    private RoleDAO roleDAO;

    public void setRoleDAO(RoleDAO roleDAO) {
        this.roleDAO = roleDAO;
    }
    
    public BinaryPair<List<Role>, Long> getRoleList(int offset, int count, String name) {
        return roleDAO.getRoleList(offset, count, name);
    }
    
    public void addRole(Role role) {
        roleDAO.addRole(role);
    }
    
    public void updateRole(Role role) {
        roleDAO.updateRole(role);
    }
    
    public Role getRole(Long roleId) {        
        return roleDAO.getRoleById(roleId);
    }
}
