package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.Cooperation;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface CooperationDao {
    
    void insertCooperation(Cooperation cooperation);
    
    void updateCooperation(Cooperation cooperation);
    
    void deleteCooperation(Long id);
    
    Cooperation selectById(Long id);
    
    BinaryPair<List<Cooperation>, Long> selectAll(String title, int offset, int pageSize);
}
