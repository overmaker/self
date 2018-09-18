package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.Ticket;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 周林敏
 */
public interface TicketMapper {

    /**
     * 新增活动票种
     *
     */
    void insertTicket(Ticket ticket);

    /**
     * 修改活动票种
     */
    void updateTicket(Ticket ticket);

    /**
     * 删除活动票种
     *
     * @param id 活动id
     */
    void deleteTicket(@Param("id") Long id);

    /**
     * 查询所有的活动票种
     *
     * @return
     */
    List<Ticket> selectByActivityId(@Param("activity-id") Long activityId);
}
