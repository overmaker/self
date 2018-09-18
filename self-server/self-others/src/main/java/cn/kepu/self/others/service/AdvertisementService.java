package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.AdvertisementDao;
import cn.kepu.self.others.entity.Advertisement;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum AdvertisementService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private AdvertisementService() {}

    public static AdvertisementService getInstance() {
        return INSTANCE;
    }

    private AdvertisementDao advertisementDao;
    
    public void setAdvertisementDao(AdvertisementDao advertisementDao) {
        this.advertisementDao = advertisementDao;
    }

    public void addAdvertisement(Advertisement advertisement) {
        advertisementDao.insertAdvertisement(advertisement);
    }
    
    public void updateAdvertisement(Advertisement advertisement) {
        advertisementDao.updateAdvertisement(advertisement);
    }
    
    public void deleteAdvertisement(Long id) {
        advertisementDao.deleteAdvertisement(id);
    }
    
    public Advertisement findById(Long id) {
        return advertisementDao.selectById(id);
    }
    
    public BinaryPair<List<Advertisement>, Long> selectAdvertisement(String title,int offset, int pageSize){
        return advertisementDao.selectAll(title,offset, pageSize);
    }
}
