package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.TicketDao;
import cn.kepu.self.activity.entity.Ticket;
import cn.kepu.self.activity.mybatis.mapper.TicketMapper;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;

/**
 *
 * @author 周林敏
 */
public class TicketDaoImpl implements TicketDao {

    private TicketMapper ticketMapper;

    public void setTicketMapper(TicketMapper ticketMapper) {
        this.ticketMapper = ticketMapper;
    }

    @Override
    public void addTicket(Ticket ticket) {
        ticketMapper.insertTicket(ticket);
    }

    @Override
    public void updateTicket(Ticket ticket) {
        ticketMapper.updateTicket(ticket);
    }

    @Override
    public boolean deleteTicket(Long id) {
        try {
            ticketMapper.deleteTicket(id);
        } catch (final DataIntegrityViolationException e) {
            return false;
        }
        return true;
    }

    @Override
    public List<Ticket> getList(Long activityId) {
        return ticketMapper.selectByActivityId(activityId);
    }

}
