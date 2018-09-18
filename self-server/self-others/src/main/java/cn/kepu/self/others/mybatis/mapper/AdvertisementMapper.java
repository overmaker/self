package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.Advertisement;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface AdvertisementMapper {

    void insertAdvertisement(Advertisement advertisement);
    
    void updateAdvertisement(Advertisement advertisement);
    
    void deleteAdvertisement(Long id);
    
    Advertisement selectById(Long id);
    
    List<Advertisement> selectAll(Advertisement advertisement);
}
