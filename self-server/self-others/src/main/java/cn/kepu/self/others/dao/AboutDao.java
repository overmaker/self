package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.About;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface AboutDao {

    int insertAbout(String type, String introduction);

    int updateAbout(String type, String introduction, Long id);

    void deleteAbout(Long id);

    About selectById(Long id);

    About selectByType();

    BinaryPair<List<About>, Long> selectAll(int offset, int pageSize);
}
