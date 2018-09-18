package cn.kepu.self.activity.dao;

import cn.kepu.self.activity.entity.ActivityReport;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ActivityReportDao {
    
    void insertActivityReport(ActivityReport activityReport);

    void updateActivityReport(ActivityReport activityReport);

    void deleteActivityReport(Long id);

    ActivityReport findById(Long id);

    BinaryPair<List<ActivityReport>, Long> selectActivityReport(String title, int offset, int pageSize);
    BinaryPair<List<ActivityReport>, Long> selectActivityReport1(Long activity);
}
