package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.commons.dao.GuestDAO;
import cn.kepu.self.commons.entity.Guest;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.dao.DuplicateKeyException;
import cn.kepu.self.commons.mybatis.mapper.GuestMapper;

/**
 * 嘉宾管理
 *
 * @author
 */
public class GuestDAOImpl implements GuestDAO {

    private GuestMapper guestMapper;

    public void setGuestMapper(GuestMapper guestMapper) {
        this.guestMapper = guestMapper;
    }

    public void selectGuestMapper(GuestMapper guestMapper) {
        this.guestMapper = guestMapper;
    }

    @Override
    public void addGuest(Guest guest) {
        try {
            guestMapper.insertGuest(guest);

        } catch (final DuplicateKeyException e) {
        }
    }

    @Override
    public void updateGuest(Guest guest) {
        try {
            guestMapper.updateGuest(guest);

        } catch (final DuplicateKeyException e) {
        }
    }

    @Override
    public Guest findById(Long id) {
        return guestMapper.findById(id);
    }

    @Override
    public BinaryPair<List<Guest>, Long> selectGuest(int offset, int pageSize, String name) {
        Guest guest = new Guest();
        guest.setName(name);

        PageHelper.offsetPage(offset, pageSize);
        List<Guest> list = guestMapper.selectGuest(guest);
        PageInfo<Guest> pageInfo = new PageInfo(list);
        BinaryPair<List<Guest>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Guest>, Long> activityGuest(Long id) {
        List<Guest> list = guestMapper.activityGuest(id);
        PageInfo<Guest> pageInfo = new PageInfo(list);
        BinaryPair<List<Guest>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
