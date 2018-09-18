package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.KnowhowDao;
import cn.kepu.self.others.entity.Knowhow;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum KnowhowService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private KnowhowService() {}

    public static KnowhowService getInstance() {
        return INSTANCE;
    }

    private KnowhowDao knowhowDao;
    
    public void setKnowhowDao(KnowhowDao knowhowDao) {
        this.knowhowDao = knowhowDao;
    }

    public int addKnowhow(String type, String introduction) {
        if (type == null || type.isEmpty()) {
            return 2;
        }
        return knowhowDao.insertKnowhow(type, introduction);
    }
    
    public int updateKnowhow(String type, String introduction, Long id) {
        if (type == null || type.isEmpty()) {
            return 2;
        }
        return knowhowDao.updateKnowhow(type, introduction, id);
    }
    
    public void deleteKnowhow(Long id) {
        knowhowDao.deleteKnowhow(id);
    }
    
    public Knowhow findById(Long id) {
        return knowhowDao.selectById(id);
    }
    
    public BinaryPair<List<Knowhow>, Long> selectKnowhow(int offset, int pageSize){
        return knowhowDao.selectAll(offset, pageSize);
    }
}
