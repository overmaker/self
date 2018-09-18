package cn.kepu.self.site.dao;

import cn.kepu.self.site.entity.BecomeVip;

/**
 *
 * @author 周林敏
 */
public interface BecomeVipDAO {

    void addOrder(BecomeVip becomeVip);

    void paymentSuccess(String sn);
}
