package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.Role;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 劉一童
 */
public interface RoleMapper {

    List<Role> selectRoles(@Param("name") String name);

    void insertRole(Role role);
    
    void updateRole(Role role);
    
    Role selectById(@Param("role-id") Long roleId);

    void insertRoleModule(@Param("role") Long role, @Param("module") Long module);
    
    void deleteRoleModuleByRoleId(@Param("role") Long role);
}
