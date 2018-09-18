package cn.kepu.self.site.daoimpl;

import cn.kepu.self.site.dao.BecomeVipDAO;
import cn.kepu.self.site.entity.BecomeVip;
import cn.kepu.self.site.mybatis.mapper.BecomeVipMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 *
 * @author 周林敏
 */
public class BecomeVipDaoImpl implements BecomeVipDAO {

    private final BecomeVipMapper becomeVipMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public BecomeVipDaoImpl(BecomeVipMapper becomeVipMapper, JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.becomeVipMapper = becomeVipMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public void addOrder(BecomeVip becomeVip) {
        becomeVipMapper.insertOrder(becomeVip);
    }

    @Override
    public void paymentSuccess(String sn) {
        BecomeVip becomeVip = new BecomeVip();
        becomeVip = becomeVipMapper.selectOrderById(sn);
        int type = becomeVip.getVip_type();
        final Long becomeVipId = becomeVip.getUser().getId();
        transactionTemplate.execute(status -> {
            try {
                String vipType = new String();
                if (type == 1) {
                    vipType = "1 month";
                } else if (type == 2) {
                    vipType = "3 month";
                } else if (type == 3) {
                    vipType = "6 month";
                }
                becomeVipMapper.paymentSuccess(sn);
                jdbcTemplate.update("UPDATE kepu_self_user_info SET is_vip=1, vip_expire_time =  CASE WHEN vip_expire_time >= NOW() THEN date_add(vip_expire_time, interval " + vipType + ")ELSE  date_add(NOW(), interval " + vipType + ")END WHERE id=?", becomeVipId);

                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

}
