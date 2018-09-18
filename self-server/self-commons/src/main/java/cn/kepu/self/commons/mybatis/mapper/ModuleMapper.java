package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.Module;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 劉一童
 */
public interface ModuleMapper {

    List<Module> selectAllModule();

    List<Module> selectModulesByRoleId(@Param("role-id") Long roleId);

    Long selectIdByName(@Param("name") String name);
    
    List<Module> getModulesByUserId(@Param("user-id") Long userId);
}
