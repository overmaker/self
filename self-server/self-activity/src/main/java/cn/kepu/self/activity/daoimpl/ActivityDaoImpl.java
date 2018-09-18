package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.ActivityDao;
import cn.kepu.self.activity.entity.Activity;
import cn.kepu.self.activity.entity.ActivityInfo;
import cn.kepu.self.activity.entity.ActivityTheme;
import cn.kepu.self.activity.entity.Ticket;
import cn.kepu.self.activity.mybatis.mapper.ActivityInfoMapper;
import cn.kepu.self.activity.mybatis.mapper.ActivityMapper;
import cn.kepu.self.activity.mybatis.mapper.TicketMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 *
 * @author 李成志
 */
public class ActivityDaoImpl implements ActivityDao {

    private final ActivityMapper activityMapper;
    private final ActivityInfoMapper activityInfoMapper;
    private final TicketMapper ticketMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public ActivityDaoImpl(ActivityMapper activityMapper,
            ActivityInfoMapper activityInfoMapper,
            TicketMapper ticketMapper,
            JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.activityMapper = activityMapper;
        this.activityInfoMapper = activityInfoMapper;
        this.ticketMapper = ticketMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    /*活动首页625*/
    @Override
    public BinaryPair<List<Activity>, Long> complexSearch(int offset, int pageSize, Activity activity) {
        PageHelper.offsetPage(offset, pageSize);
        List<Activity> list = activityMapper.complexSearch(activity);

        PageInfo<Activity> pageInfo = new PageInfo(list);
        BinaryPair<List<Activity>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }

    @Override
    public void addActivity(Activity activity) {
        transactionTemplate.execute(status -> {
            try {
                activityMapper.insertActivity(activity);
                ActivityInfo activityInfo = new ActivityInfo();
                activityInfo.setId(activity.getId());
                activityInfoMapper.insertActivityInfo(activityInfo);
                if (activity.getThemes() != null) {
                    for (ActivityTheme theme : activity.getThemes()) {
                        jdbcTemplate.update("INSERT INTO kepu_self_activity_theme_relation (activity, theme) VALUES (?,?)", activity.getId(), theme.getId());
                    }
                }
                if (activity.getTickets() != null) {
                    for (Ticket ticket: activity.getTickets()) {
                        ticket.setActivity(activity);
                        ticketMapper.insertTicket(ticket);
                    }
                }
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });

    }

    @Override
    public void updateActivityById(Activity activity) {
        transactionTemplate.execute(status -> {
            try {
                activityMapper.updateActivityById(activity);
                if (activity.getThemes() != null) {
                    jdbcTemplate.update("DELETE FROM kepu_self_activity_theme_relation WHERE activity=?", activity.getId());
                    for (ActivityTheme theme : activity.getThemes()) {
                        jdbcTemplate.update("INSERT INTO kepu_self_activity_theme_relation (activity, theme) VALUES (?,?)", activity.getId(), theme.getId());
                    }
                }
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public void copyActivity(Long id, String sn) {
        final Activity activity = new Activity();
        activity.setId(id);
        activity.setSn(sn);
        transactionTemplate.execute(status -> {
            try {
                activityMapper.copyActivity(activity);
                Long targetActivityId = activity.getId();
                jdbcTemplate.update("INSERT INTO kepu_self_activity_info(id) VALUES(?)", targetActivityId);

                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public Activity findById(Long id) {
        Activity activity = activityMapper.findById(id);
        List<ActivityTheme> themesList = jdbcTemplate.query("SELECT t.id AS id, t.name AS name FROM kepu_self_activity_theme_relation r INNER JOIN kepu_self_activity_theme t ON t.id=r.theme WHERE r.activity=?", (rs, rowNum) -> {
            ActivityTheme theme = new ActivityTheme();
            theme.setId(rs.getLong("id"));
            theme.setName(rs.getString("name"));
            return theme;
        }, id);
        ActivityTheme[] themes = themesList.toArray(new ActivityTheme[0]);
        activity.setThemes(themes);
        return activity;
    }

    @Override
    public BinaryPair<List<Activity>, Long> findByAll() {
        PageHelper.offsetPage(0, 10000);
        List<Activity> list = activityMapper.findByAll();
        PageInfo<Activity> pageInfo = new PageInfo(list);
        BinaryPair<List<Activity>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Activity>, Long> selectActivity(Activity activity, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<Activity> list = activityMapper.findActivityAll(activity);
        PageInfo<Activity> pageInfo = new PageInfo(list);
        BinaryPair<List<Activity>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public List<Activity> newestActivity() {
        return activityMapper.newestActivity();
    }

    @Override
    public List<Activity> pastActivity() {
        return activityMapper.pastActivity();
    }

//    最新和最热
    @Override
    public List<Activity> TimeSearch() {

        return activityMapper.selectByTime();
    }

    @Override
    public List<Activity> FeeSearch() {

        return activityMapper.selectByFee();
    }

    @Override
    public BinaryPair<List<Activity>, Long> selectActivity(String title, int offset, int pageSize) {
        Activity activity = new Activity();
        activity.setTitle(title);

        PageHelper.offsetPage(offset, pageSize);
        List<Activity> list = activityMapper.findActivityAll(activity);
        PageInfo<Activity> pageInfo = new PageInfo(list);
        BinaryPair<List<Activity>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

//    直播活动首页123
    @Override
    public BinaryPair<List<Activity>, Long> selectFutureLive() {
        List<Activity> list = activityMapper.selectFutureLive();
        PageInfo<Activity> pageInfo = new PageInfo(list);
        BinaryPair<List<Activity>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Activity>, Long> selectLiving() {
        List<Activity> list = activityMapper.selectLiving();
        PageInfo<Activity> pageInfo = new PageInfo(list);
        BinaryPair<List<Activity>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Activity>, Long> selectPastLive() {
        List<Activity> list = activityMapper.selectPastLive();
        PageInfo<Activity> pageInfo = new PageInfo(list);
        BinaryPair<List<Activity>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

//    通过id查询直播活动
    @Override
    public Activity selectLiveById(Long id) {
        Activity activity = activityMapper.selectLiveById(id);
        return activity;
    }

    //    self+往期活动
    @Override
    public BinaryPair<List<Activity>, Long> selectPastSelf(Activity activity, int offset, int pageSize) {
        List<Activity> list = activityMapper.selectPastSelf(activity);
        PageInfo<Activity> pageInfo = new PageInfo(list);
        BinaryPair<List<Activity>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Activity>, Long> getActivityList(Activity activity, Boolean joinning, Boolean over, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<Activity> list = activityMapper.selectActivityList(activity, joinning, over);

        PageInfo<Activity> pageInfo = new PageInfo(list);
        BinaryPair<List<Activity>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
