package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.DonationDao;
import cn.kepu.self.others.entity.Donation;
import cn.kepu.self.others.mybatis.mapper.DonationMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 李成志
 */
public class DonationDaoImpl implements DonationDao {
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private DonationMapper donationMapper;

    public void setDonationMapper(DonationMapper donationMapper) {
        this.donationMapper = donationMapper;
    }

    @Override
    public int insertDonation(String name, Integer amount) {
        Donation donation = new Donation();
        donation.setName(name);
        donation.setAmount(amount);
        
        try {
            donationMapper.insertDonation(donation);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final DataIntegrityViolationException e) {
            return 2;
        } catch (final Exception e) {
            logger.error("添加关于时异常", e);
            return 3;
        }
        return 0;
    }

    @Override
    public int updateDonation(String name, Integer amount, Long id) {
        Donation donation = new Donation();
        donation.setName(name);
        donation.setAmount(amount);
        donation.setId(id);
        
        try {
            donationMapper.updateDonation(donation);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public void deleteDonation(Long id) {
        donationMapper.deleteDonation(id);
    }

    @Override
    public Donation selectById(Long id) {
        return donationMapper.selectById(id);
    }
    
    @Override
    public List<Donation> selectByDonation() {
        return donationMapper.selectByDonation();
    }

    @Override
    public BinaryPair<List<Donation>, Long> selectAll(String name, int offset, int pageSize) {
        Donation donation = new Donation();
        donation.setName(name);
        
        PageHelper.offsetPage(offset, pageSize);
        List<Donation> list = donationMapper.selectAll(donation);
        PageInfo<Donation> pageInfo = new PageInfo(list);
        BinaryPair<List<Donation>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
