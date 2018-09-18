package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.Knowhow;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface KnowhowMapper {
    
    void insertKnowhow(Knowhow knowhow);
    
    void updateKnowhow(Knowhow knowhow);
    
    void deleteKnowhow(Long id);
    
    Knowhow selectById(Long id);
    
    List<Knowhow> selectAll();
}
