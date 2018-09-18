package cn.kepu.self.site.mybatis.mapper;

import cn.kepu.self.site.entity.Donation;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 周林敏
 */
public interface Donation2Mapper {

    void insertOrder(Donation donation);

    void paymentSuccess(@Param("sn") String sn);

}
