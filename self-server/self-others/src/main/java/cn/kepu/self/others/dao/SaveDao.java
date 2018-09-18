package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.Save;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public interface SaveDao {

    void insertSave(Save save);
//
//    void updateSave(Save save);
//
//    void deleteSave(Long id);
    BinaryPair<List<Save>, Long> selectByUser(Long id, int offset, int pageSize);

    /*收藏验证*/
    boolean saveCheck(Save save);
}
