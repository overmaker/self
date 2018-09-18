package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.Guest;
import java.util.List;

/**
 * 嘉宾
 *
 * @author
 */
public interface GuestMapper {

    /**
     * 新增嘉宾
     *
     * @param guest
     * @return 新增结果。 0:成功，1：重复值，2：其他错误
     */
    int insertGUest(Guest guest);

    /**
     * 新增嘉宾
     *
     * @paramguest
     * @return 新增结果。 0:成功，1：重复值，2：其他错误
     */
    int updateGuest(Guest guest);

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
     * @return
     */
    List<Guest> selectGuest(Guest guest);

    public void insertGuest(Guest guest);

    /**
     * 通过活动id查询活动嘉宾
     *
     * @param id
     * @return
     */
    List<Guest> activityGuest(Long id);
}
