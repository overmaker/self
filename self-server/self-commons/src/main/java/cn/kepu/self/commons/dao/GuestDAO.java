package cn.kepu.self.commons.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.commons.entity.Guest;
import java.util.List;

/**
 * 嘉宾管理
 *
 * @author
 */
public interface GuestDAO {

    /**
     * 新增嘉宾
     *
     * @param guest
     */
    void addGuest(Guest guest);

    /**
     * 更新嘉宾
     *
     */
    void updateGuest(Guest guest);

    /**
     * 通过id查看嘉宾
     *
     * @param id 嘉宾id
     *
     * @return
     */
    Guest findById(Long id);

    /**
     * 查询嘉宾
     *
     * @param name
     * @param unit
     * @return
     */
    BinaryPair<List<Guest>, Long> selectGuest(int offset, int pageSize, String name);

    BinaryPair<List<Guest>, Long> activityGuest(Long id);

}
