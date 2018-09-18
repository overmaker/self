package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.Donation;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface DonationMapper {
    
    void insertDonation(Donation donation);
    
    void updateDonation(Donation donation);
    
    void deleteDonation(Long id);
    
    Donation selectById(Long id);
    
    List<Donation> selectByDonation();
    
    List<Donation> selectAll(Donation donation);
}
