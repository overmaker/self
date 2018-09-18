package cn.kepu.self.commons.service;

import cn.kepu.self.commons.dao.ModuleDAO;
import cn.kepu.self.commons.entity.Module;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public enum ModuleService {
    INSTANCE;

    private ModuleService() {}

    public static ModuleService getInstance() {
        return INSTANCE;
    }

    private ModuleDAO moduleDAO;

    public void setModuleDAO(ModuleDAO moduleDAO) {
        this.moduleDAO = moduleDAO;
    }

    public List<Module> getAllModule() {
        return moduleDAO.getAllModule();
    }
    
    public List<Module> getModulesByRoleId(Long roleId) {
        return moduleDAO.getModulesByRoleId(roleId);
    }
    
    public List<Module> getModulesByUserId(Long userId) {
        return moduleDAO.getModulesByUserId(userId);
    }
}
