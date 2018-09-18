/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.commons.dao.ModuleDAO;
import cn.kepu.self.commons.entity.Module;
import cn.kepu.self.commons.mybatis.mapper.ModuleMapper;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public class ModuleDAOImpl implements ModuleDAO {
    
    private final ModuleMapper moduleMapper;
    
    public ModuleDAOImpl (ModuleMapper moduleMapper) {
        this.moduleMapper = moduleMapper;
    }

    @Override
    public List<Module> getAllModule() {
        return moduleMapper.selectAllModule();
    }

    @Override
    public List<Module> getModulesByRoleId(Long roleId) {
        return moduleMapper.selectModulesByRoleId(roleId);
    }

    @Override
    public List<Module> getModulesByUserId(Long userId) {
        return moduleMapper.getModulesByUserId(userId);
    }

}
