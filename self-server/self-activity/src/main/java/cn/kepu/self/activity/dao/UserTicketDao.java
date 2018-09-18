package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.UserTicket;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public interface UserTicketDao {

    /**
     * 新增活动用户购票
     *
     * @param userTicket
     */
    void addUserTicket(UserTicket userTicket);

    void paymentSuccess(String sn);

    //通过活动id查询名单
    BinaryPair<List<UserTicket>, Long> selectUserTicket(Long id, String name, String mobile, String email, int offset, int pageSize);

    List<UserTicket> sendEmail(Long id);

    List<UserTicket> sendMobile(Long id);

    /*签到*/
    void signIn(UserTicket userTicket);
    
     /*验证签到手机号是否存在*/
    boolean phoneNumberCheck(UserTicket userTicket);
}
