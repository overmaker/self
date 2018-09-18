package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.Knowhow;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface KnowhowDao {
    
    int insertKnowhow(String type, String introduction);
    
    int updateKnowhow(String type, String introduction, Long id);
    
    void deleteKnowhow(Long id);
    
    Knowhow selectById(Long id);
    
    BinaryPair<List<Knowhow>, Long> selectAll(int offset, int pageSize);
}
