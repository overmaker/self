package cn.kepu.self.site.daoimpl;

import cn.kepu.self.site.dao.DonationDAO;
import cn.kepu.self.site.entity.Donation;
import cn.kepu.self.site.mybatis.mapper.Donation2Mapper;

/**
 *
 * @author 周林敏
 */
public class Donation2DaoImpl implements DonationDAO {

    private final Donation2Mapper donationMapper;

    public Donation2DaoImpl(Donation2Mapper donationMapper) {
        this.donationMapper = donationMapper;
    }

    @Override
    public void addOrder(Donation donation) {
        donationMapper.insertOrder(donation);
    }

    @Override
    public void paymentSuccess(String sn) {
        donationMapper.paymentSuccess(sn);
    }

}
