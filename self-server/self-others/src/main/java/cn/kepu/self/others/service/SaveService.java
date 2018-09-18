package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.SaveDao;
import cn.kepu.self.others.entity.Save;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public enum SaveService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private SaveService() {
    }

    public static SaveService getInstance() {
        return INSTANCE;
    }

    private SaveDao saveDao;

    public void setSaveDao(SaveDao saveDao) {
        this.saveDao = saveDao;
    }

    public void addSave(Save save) {
        saveDao.insertSave(save);
    }
//    
//    public void updateSave(Save save) {
//        saveDao.updateSave(save);
//    }
//    
//    public void deleteSave(Long id) {
//        saveDao.deleteSave(id);
//    }
    public BinaryPair<List<Save>, Long> selectByUser(Long id, int offset, int pageSize) {
        return saveDao.selectByUser(id, offset, pageSize);
    }

    /*收藏验证*/
    public boolean saveCheck(Save save) {
        return saveDao.saveCheck(save);
    }
}
