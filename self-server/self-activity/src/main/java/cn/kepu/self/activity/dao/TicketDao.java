package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.Ticket;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public interface TicketDao {

    /**
     * 新增活动票种
     *
     * @param ticket
     */
    void addTicket(Ticket ticket);

    /**
     * 修改活动票种
     *
     * @param ticket
     */
    void updateTicket(Ticket ticket);

    /**
     * 删除活动票种
     *
     * @param id 票种id
     * @return 删除成功返回true，如果票种已经被人购买删除失败，返回false
     */
    boolean deleteTicket(Long id);

    /**
     * 查询指定活动的票种
     *
     * @param activityId
     * @return
     */
    List<Ticket> getList(Long activityId);
}
