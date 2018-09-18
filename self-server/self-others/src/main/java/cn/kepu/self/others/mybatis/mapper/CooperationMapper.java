package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.Cooperation;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface CooperationMapper {
    
    void insertCooperation(Cooperation cooperation);
    
    void updateCooperation(Cooperation cooperation);
    
    void deleteCooperation(Long id);
    
    Cooperation selectById(Long id);
    
    List<Cooperation> selectAll(Cooperation cooperation);
}
