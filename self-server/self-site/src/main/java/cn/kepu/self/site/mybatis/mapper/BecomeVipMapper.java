package cn.kepu.self.site.mybatis.mapper;

import cn.kepu.self.site.entity.BecomeVip;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 周林敏
 */
public interface BecomeVipMapper {

    void insertOrder(BecomeVip becomeVip);

    void paymentSuccess(@Param("sn") String sn);

    BecomeVip selectOrderById(@Param("sn") String sn);

}
