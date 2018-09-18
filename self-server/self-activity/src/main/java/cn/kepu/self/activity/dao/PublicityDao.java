package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.Publicity;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface PublicityDao {

    //增加
    void insertPublicity(Publicity publicity);
    //修改
    void updatePublicity(Publicity publicity);
    //删除
    void deletePublicity(Long id);
    //通过ID查询
    Publicity findById(Long id);
    //查询所有
    BinaryPair<List<Publicity>, Long> selectPublicity(String aname, String cname, int offset, int pageSize);
}
