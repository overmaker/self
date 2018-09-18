package cn.kepu.self.commons.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.commons.dao.GuestDAO;
import cn.kepu.self.commons.entity.Guest;
import java.util.List;

/**
 * 嘉宾者管理
 *
 * @author
 */
public enum GuestService {
    INSTANCE;

    private GuestService() {
    }

    private static GuestService getInstance() {
        return INSTANCE;
    }

    private GuestDAO guestDAO;

    public void setGuestDAO(GuestDAO guestDAO) {
        this.guestDAO = guestDAO;
    }

    public void addGuest(Guest guest) {
        guestDAO.addGuest(guest);
    }

    public void updateGuest(Guest guest) {
        guestDAO.updateGuest(guest);
    }

    /**
     * 根据id查询嘉宾
     *
     * @param id
     * @return
     */
    public Guest findById(Long id) {
        return guestDAO.findById(id);
    }

    /**
     * 查询嘉宾
     *
     * @param offset
     * @param pageSize
     * @param name
     * @return
     */
    public BinaryPair<List<Guest>, Long> selectGuest(int offset, int pageSize, String name) {
        return guestDAO.selectGuest(offset, pageSize, name);
    }

    /**
     * 通过活动id查询活动嘉宾
     *
     * @param id
     * @return
     */
    public BinaryPair<List<Guest>, Long> activityGuest(Long id) {
        return guestDAO.activityGuest(id);
    }
}
