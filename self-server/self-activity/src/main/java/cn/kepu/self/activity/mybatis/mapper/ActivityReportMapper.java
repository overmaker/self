package cn.kepu.self.activity.mybatis.mapper;

import cn.kepu.self.activity.entity.ActivityReport;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ActivityReportMapper {
    
    void insertActivityReport(ActivityReport activityReport);

    void updateActivityReport(ActivityReport activityReport);

    void deleteActivityReport(Long id);

    ActivityReport findById(Long id);

    List<ActivityReport> selectActivityReport(ActivityReport activityReport);
    List<ActivityReport> selectActivityReport1(Long activity);
}
