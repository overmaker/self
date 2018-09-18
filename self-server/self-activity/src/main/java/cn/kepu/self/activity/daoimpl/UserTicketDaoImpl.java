package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.UserTicketDao;
import cn.kepu.self.activity.entity.Activity;
import cn.kepu.self.activity.entity.UserTicket;
import cn.kepu.self.activity.mybatis.mapper.UserTicketMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public class UserTicketDaoImpl implements UserTicketDao {

    private UserTicketMapper userTicketMapper;

    public void setUserTicketMapper(UserTicketMapper userTicketMapper) {
        this.userTicketMapper = userTicketMapper;
    }

    @Override
    public void addUserTicket(UserTicket userTicket) {
        userTicketMapper.insertUserTicket(userTicket);
    }

    @Override
    public void paymentSuccess(String sn) {
        userTicketMapper.paymentSuccess(sn);
    }

    @Override
    public BinaryPair<List<UserTicket>, Long> selectUserTicket(Long id, String name, String mobile, String email, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);

        Activity activity = new Activity();
        activity.setId(id);

        UserTicket userTicket = new UserTicket();
        userTicket.setActivity(activity);
        userTicket.setName(name);
        userTicket.setMobile(mobile);
        userTicket.setEmail(email);

        List<UserTicket> list = userTicketMapper.selectUserTicket(userTicket);

        PageInfo<UserTicket> pageInfo = new PageInfo(list);
        BinaryPair<List<UserTicket>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public List<UserTicket> sendEmail(Long id) {
        Activity activity = new Activity();
        activity.setId(id);

        UserTicket userTicket = new UserTicket();
        userTicket.setActivity(activity);

        return userTicketMapper.sendEmail(userTicket);
    }

    @Override
    public List<UserTicket> sendMobile(Long id) {
        Activity activity = new Activity();
        activity.setId(id);

        UserTicket userTicket = new UserTicket();
        userTicket.setActivity(activity);

        return userTicketMapper.sendMobile(userTicket);
    }

    /*签到*/
    @Override
    public void signIn(UserTicket userTicket) {
        userTicketMapper.signIn(userTicket);
    }

    /*验证签到手机号是否存在*/
    @Override
    public boolean phoneNumberCheck(UserTicket userTicket) {
        int checked = userTicketMapper.phoneNumberCheck(userTicket);
        if (checked > 0) {
            return true;
        } else {
            return false;
        }
    }
}
