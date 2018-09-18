package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.TicketDao;
import cn.kepu.self.activity.entity.Ticket;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public enum TicketService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private TicketService() {}

    public static TicketService getInstance() {
        return INSTANCE;
    }

    private TicketDao ticketDao;

    public void setTicketDao(TicketDao ticketDao) {
        this.ticketDao = ticketDao;
    }

    public void addTicket(Ticket ticket) {
        ticketDao.addTicket(ticket);
    }

    public void updateTicket(Ticket ticket) {
        ticketDao.updateTicket(ticket);
    }

    public boolean deleteTicket(Long id) {
        return ticketDao.deleteTicket(id);
    }

    public List<Ticket> getList(Long activityId) {
        return ticketDao.getList(activityId);
    }
}
