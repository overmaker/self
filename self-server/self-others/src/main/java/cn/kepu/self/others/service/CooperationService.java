package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.CooperationDao;
import cn.kepu.self.others.entity.Cooperation;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum CooperationService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private CooperationService() {}

    public static CooperationService getInstance() {
        return INSTANCE;
    }

    private CooperationDao cooperationDao;
    
    public void setCooperationDao(CooperationDao cooperationDao) {
        this.cooperationDao = cooperationDao;
    }

    public void addCooperation(Cooperation cooperation) {
        cooperationDao.insertCooperation(cooperation);
    }
    
    public void updateCooperation(Cooperation cooperation) {
        cooperationDao.updateCooperation(cooperation);
    }
    
    public void deleteCooperation(Long id) {
        cooperationDao.deleteCooperation(id);
    }
    
    public Cooperation findById(Long id) {
        return cooperationDao.selectById(id);
    }
    
    public BinaryPair<List<Cooperation>, Long> selectCooperation(String title, int offset, int pageSize){
        return cooperationDao.selectAll(title, offset, pageSize);
    }
}
