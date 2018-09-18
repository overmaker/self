package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.SaveDao;
import cn.kepu.self.others.entity.Save;
import cn.kepu.self.others.mybatis.mapper.SaveMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public class SaveDaoImpl implements SaveDao {

    private SaveMapper saveMapper;

    public void setSaveMapper(SaveMapper saveMapper) {
        this.saveMapper = saveMapper;
    }

    @Override
    public void insertSave(Save save) {
        saveMapper.insertSave(save);
    }
//
//    @Override
//    public void updateSave(Save save) {
//        saveMapper.updateSave(save);
//    }
//
//    @Override
//    public void deleteSave(Long id) {
//        saveMapper.deleteSave(id);
//    }
    @Override
    public BinaryPair<List<Save>, Long> selectByUser(Long id, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<Save> list = saveMapper.selectByUser(id);
        PageInfo<Save> pageInfo = new PageInfo(list);
        BinaryPair<List<Save>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    /*收藏验证*/
    @Override
    public boolean saveCheck(Save save) {
        int checked = saveMapper.saveCheck(save);
        if (checked > 0) {
            return true;
        } else {
            return false;
        }
    }

}
