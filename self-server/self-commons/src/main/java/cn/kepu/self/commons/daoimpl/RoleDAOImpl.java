package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.commons.dao.RoleDAO;
import cn.kepu.self.commons.entity.Module;
import cn.kepu.self.commons.entity.Role;
import cn.kepu.self.commons.mybatis.mapper.ModuleMapper;
import cn.kepu.self.commons.mybatis.mapper.RoleMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.transaction.support.TransactionTemplate;

/**
 *
 * @author 劉一童
 */
public class RoleDAOImpl implements RoleDAO {

    private final RoleMapper roleMapper;

    private final ModuleMapper moduleMapper;

    private final TransactionTemplate transactionTemplate;

    public RoleDAOImpl(RoleMapper roleMapper,
            ModuleMapper moduleMapper,
            TransactionTemplate transactionTemplate) {
        this.roleMapper = roleMapper;
        this.moduleMapper = moduleMapper;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public BinaryPair<List<Role>, Long> getRoleList(int offset, int count, String name) {
        PageHelper.offsetPage(offset, count);

        List<Role> list = roleMapper.selectRoles(name);
        PageInfo<Role> pageInfo = new PageInfo(list);
        BinaryPair<List<Role>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public void addRole(Role role) {
        Module[] modules = role.getModules();

        transactionTemplate.execute(status -> {
            try {
                roleMapper.insertRole(role);
                if (modules != null && modules.length > 0) {
                    Long roleId = role.getId();
                    for (Module module : modules) {
                        Long moduleId = moduleMapper.selectIdByName(module.getName());
                        roleMapper.insertRoleModule(roleId, moduleId);
                    }
                }
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }
    
    @Override
    public void updateRole(Role role) {
        Module[] modules = role.getModules();
        Long roleId = role.getId();
        transactionTemplate.execute(status -> {
            try {
                roleMapper.updateRole(role); // 更新角色名称
                roleMapper.deleteRoleModuleByRoleId(roleId); // 先删除所有角色授权
                if (modules != null && modules.length > 0) {
                    for (Module module : modules) {
                        Long moduleId = moduleMapper.selectIdByName(module.getName());
                        roleMapper.insertRoleModule(roleId, moduleId); // 逐一添加角色授权
                    }
                }
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public Role getRoleById(Long roleId) {
        return roleMapper.selectById(roleId);
    }
}
