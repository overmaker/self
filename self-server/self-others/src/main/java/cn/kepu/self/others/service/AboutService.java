package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.AboutDao;
import cn.kepu.self.others.entity.About;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum AboutService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private AboutService() {
    }

    public static AboutService getInstance() {
        return INSTANCE;
    }

    private AboutDao aboutDao;

    public void setAboutDao(AboutDao aboutDao) {
        this.aboutDao = aboutDao;
    }

    public int addAbout(String type, String introduction) {
        if (type == null || type.isEmpty()) {
            return 2;
        }
        return aboutDao.insertAbout(type, introduction);
    }

    public int updateAbout(String type, String introduction, Long id) {
        if (type == null || type.isEmpty()) {
            return 2;
        }
        return aboutDao.updateAbout(type, introduction, id);
    }

    public void deleteAbout(Long id) {
        aboutDao.deleteAbout(id);
    }

    public About findById(Long id) {
        return aboutDao.selectById(id);
    }

    public About selectByType() {
        return aboutDao.selectByType();
    }

    public BinaryPair<List<About>, Long> selectAbout(int offset, int pageSize) {
        return aboutDao.selectAll(offset, pageSize);
    }
}
