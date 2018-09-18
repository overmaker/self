package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.Save;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public interface SaveMapper {

    void insertSave(Save save);

    void updateSave(Save save);

    void deleteSave(Long id);

    List<Save> selectByUser(Long Uid);
    /*收藏验证*/
    int saveCheck(Save save);

}
