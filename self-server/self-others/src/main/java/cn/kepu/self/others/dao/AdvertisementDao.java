package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.Advertisement;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface AdvertisementDao {

    void insertAdvertisement(Advertisement advertisement);

    void updateAdvertisement(Advertisement advertisement);

    void deleteAdvertisement(Long id);

    Advertisement selectById(Long id);

    BinaryPair<List<Advertisement>, Long> selectAll(String title, int offset, int pageSize);
}
