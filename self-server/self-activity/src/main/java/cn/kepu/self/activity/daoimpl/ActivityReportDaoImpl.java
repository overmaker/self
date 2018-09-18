package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.ActivityReportDao;
import cn.kepu.self.activity.entity.ActivityReport;
import cn.kepu.self.activity.mybatis.mapper.ActivityReportMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 *
 * @author 李成志
 */
public class ActivityReportDaoImpl implements ActivityReportDao {
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private ActivityReportMapper activityReportMapper;
    
    public void setActivityReportMapper(ActivityReportMapper activityReportMapper) {
        this.activityReportMapper = activityReportMapper;
    }

    @Override
    public void insertActivityReport(ActivityReport activityReport) {
        activityReportMapper.insertActivityReport(activityReport);
    }

    @Override
    public void updateActivityReport(ActivityReport activityReport) {
        activityReportMapper.updateActivityReport(activityReport);
    }

    @Override
    public void deleteActivityReport(Long id) {
        activityReportMapper.deleteActivityReport(id);
    }

    @Override
    public ActivityReport findById(Long id) {
        return activityReportMapper.findById(id);
    }

    @Override
    public BinaryPair<List<ActivityReport>, Long> selectActivityReport(String title, int offset, int pageSize) {
        ActivityReport activityReport = new ActivityReport();
        activityReport.setTitle(title);

        PageHelper.offsetPage(offset, pageSize);
        List<ActivityReport> list = activityReportMapper.selectActivityReport(activityReport);
        PageInfo<ActivityReport> pageInfo = new PageInfo(list);
        BinaryPair<List<ActivityReport>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<ActivityReport>, Long> selectActivityReport1(Long activity) {
        List<ActivityReport> list = activityReportMapper.selectActivityReport1(activity);
        BinaryPair<List<ActivityReport>, Long> value = new BinaryPair();
        value.setV1(list);
        return value;
    }
    
}
