package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.ActivityReportDao;
import cn.kepu.self.activity.entity.ActivityReport;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum ActivityReportService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ActivityReportService() {
    }

    public static ActivityReportService getInstance() {
        return INSTANCE;
    }

    private ActivityReportDao activityReportDao;

    public void setActivityReportDao(ActivityReportDao activityReportDao) {
        this.activityReportDao = activityReportDao;
    }

    public void insertActivityReport(ActivityReport activityReport) {
        activityReportDao.insertActivityReport(activityReport);
    }

    public void updateActivityReport(ActivityReport activityReport) {
        activityReportDao.updateActivityReport(activityReport);
    }

    public void deleteActivityReport(Long id) {
        activityReportDao.deleteActivityReport(id);
    }

    public ActivityReport findById(Long id) {
        return activityReportDao.findById(id);
    }

    public BinaryPair<List<ActivityReport>, Long> selectActivityReport(String title, int offset, int pageSize) {
        return activityReportDao.selectActivityReport(title, offset, pageSize);
    }
    
    public BinaryPair<List<ActivityReport>, Long> selectActivityReport1(Long activity) {
        return activityReportDao.selectActivityReport1(activity);
    }
}
