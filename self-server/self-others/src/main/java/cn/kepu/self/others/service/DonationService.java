package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.DonationDao;
import cn.kepu.self.others.entity.Donation;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum DonationService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private DonationService() {}

    public static DonationService getInstance() {
        return INSTANCE;
    }

    private DonationDao donationDao;
    
    public void setDonationDao(DonationDao donationDao) {
        this.donationDao = donationDao;
    }

    public int addDonation(String name, Integer amount) {
        if (name == null || name.isEmpty()) {
            return 2;
        }
        return donationDao.insertDonation(name, amount);
    }
    
    public int updateDonation(String name, Integer amount, Long id) {
        if (name == null || name.isEmpty()) {
            return 2;
        }
        return donationDao.updateDonation(name, amount, id);
    }
    
    public void deleteDonation(Long id) {
        donationDao.deleteDonation(id);
    }
    
    public Donation findById(Long id) {
        return donationDao.selectById(id);
    }
    
    public List<Donation> selectByDonation() {
        return donationDao.selectByDonation();
    }
    
    public BinaryPair<List<Donation>, Long> selectDonation(String name, int offset, int pageSize){
        return donationDao.selectAll(name, offset, pageSize);
    }
}
