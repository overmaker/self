package cn.kepu.self.site.dao;

import cn.kepu.self.site.entity.Donation;

/**
 *
 * @author 周林敏
 */
public interface DonationDAO {

    void addOrder(Donation donation);

    void paymentSuccess(String sn);
}
