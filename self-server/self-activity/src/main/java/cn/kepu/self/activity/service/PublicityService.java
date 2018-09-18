package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.PublicityDao;
import cn.kepu.self.activity.entity.Publicity;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum PublicityService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private PublicityService() {
    }

    public static PublicityService getInstance() {
        return INSTANCE;
    }

    private PublicityDao publicityDao;

    public void setPublicityDao(PublicityDao publicityDao) {
        this.publicityDao = publicityDao;
    }

    public void insertPublicity(Publicity publicity) {
        publicityDao.insertPublicity(publicity);
    }

    public void updatePublicity(Publicity publicity) {
        publicityDao.updatePublicity(publicity);
    }

    public void deletePublicity(Long id) {
        publicityDao.deletePublicity(id);
    }

    public Publicity findById(Long id) {
        return publicityDao.findById(id);
    }

    public BinaryPair<List<Publicity>, Long> selectPublicity(String aname, String cname, int offset, int pageSize) {
        return publicityDao.selectPublicity(aname, cname, offset, pageSize);
    }
}
