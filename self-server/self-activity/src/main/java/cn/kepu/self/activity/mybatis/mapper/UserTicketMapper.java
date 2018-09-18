package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.UserTicket;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 周林敏
 */
public interface UserTicketMapper {

    /**
     * 新增活动用户购票
     *
     * @param userTicket
     */
    void insertUserTicket(UserTicket userTicket);

    void paymentSuccess(@Param("sn") String sn);

    List<UserTicket> selectUserTicket(UserTicket userTicket);

    List<UserTicket> sendEmail(UserTicket userTicket);

    List<UserTicket> sendMobile(UserTicket userTicket);

    /*签到*/
    void signIn(UserTicket userTicket);

    /*验证签到手机号是否存在*/
    int phoneNumberCheck(UserTicket userTicket);

}
