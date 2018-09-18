package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.Publicity;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface PublicityMapper {
    
    //增加
    void insertPublicity(Publicity publicity);
    //修改
    void updatePublicity(Publicity publicity);
    //删除
    void deletePublicity(Long id);
    //通过ID查询
    Publicity findById(Long id);
    //查询所有
    List<Publicity> selectPublicity(Publicity publicity);
}
