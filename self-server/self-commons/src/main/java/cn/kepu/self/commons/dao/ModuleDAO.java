package cn.kepu.self.commons.dao;

import cn.kepu.self.commons.entity.Module;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface ModuleDAO {

    List<Module> getAllModule();

    List<Module> getModulesByRoleId(Long roleId);

    List<Module> getModulesByUserId(Long userId);
}
