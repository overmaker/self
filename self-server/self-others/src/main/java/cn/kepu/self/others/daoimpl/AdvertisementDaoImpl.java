package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.AdvertisementDao;
import cn.kepu.self.others.entity.Advertisement;
import cn.kepu.self.others.mybatis.mapper.AdvertisementMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

/**
 *
 * @author 李成志
 */
public class AdvertisementDaoImpl implements AdvertisementDao {

    private AdvertisementMapper advertisementMapper;

    public void setAdvertisementMapper(AdvertisementMapper advertisementMapper) {
        this.advertisementMapper = advertisementMapper;
    }

    @Override
    public void insertAdvertisement(Advertisement advertisement) {
        advertisementMapper.insertAdvertisement(advertisement);
    }

    @Override
    public void updateAdvertisement(Advertisement advertisement) {
        advertisementMapper.updateAdvertisement(advertisement);
    }

    @Override
    public void deleteAdvertisement(Long id) {
        advertisementMapper.deleteAdvertisement(id);
    }

    @Override
    public Advertisement selectById(Long id) {
        return advertisementMapper.selectById(id);
    }

    @Override
    public BinaryPair<List<Advertisement>, Long> selectAll(String title, int offset, int pageSize) {
        Advertisement advertisement = new Advertisement();
        advertisement.setTitle(title);

        PageHelper.offsetPage(offset, pageSize);
        List<Advertisement> list = advertisementMapper.selectAll(advertisement);
        PageInfo<Advertisement> pageInfo = new PageInfo(list);
        BinaryPair<List<Advertisement>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
