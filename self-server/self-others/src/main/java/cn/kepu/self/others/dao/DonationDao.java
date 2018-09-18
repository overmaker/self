package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.Donation;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface DonationDao {
    
    int insertDonation(String name, Integer amount);
    
    int updateDonation(String name, Integer amount, Long id);
    
    void deleteDonation(Long id);
    
    Donation selectById(Long id);
    
    List<Donation> selectByDonation();
    
    BinaryPair<List<Donation>, Long> selectAll(String name, int offset, int pageSize);
    
    
}
