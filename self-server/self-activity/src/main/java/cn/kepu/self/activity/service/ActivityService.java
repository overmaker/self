package cn.kepu.self.activity.service;

import cn.kepu.self.activity.dao.ActivityDao;
import cn.kepu.self.activity.entity.Activity;
import cn.kepu.self.util.BinaryPair;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 *
 * @author 李成志
 */
public enum ActivityService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ActivityService() {
    }

    public static ActivityService getInstance() {
        return INSTANCE;
    }

    private ActivityDao activityDao;

    private static final SimpleDateFormat DATETIME_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");

    /**
     * 生成活动序列号
     *
     * @return 活动序列号
     */
    private static String generateSN() {
        Random r = new Random();
        return DATETIME_FORMAT.format(new Date()) + Stream.of(
                (long) r.nextInt(16),
                (long) r.nextInt(16),
                (long) r.nextInt(16),
                (long) r.nextInt(16)).
                map(n -> Long.toHexString(n)).collect(Collectors.joining("")).toUpperCase();
    }

    /*活动首页625*/
    public BinaryPair<List<Activity>, Long> complexSearch(int offset, int pageSize, Activity activity) {
        return activityDao.complexSearch(offset, pageSize, activity);
    }

    public void setActivityDao(ActivityDao activityDao) {
        this.activityDao = activityDao;
    }

    public void addActivity(Activity activity) {
        activity.setSn(generateSN());
        activityDao.addActivity(activity);
    }

    public void copyActivity(Long id) {
        String sn = generateSN();
        activityDao.copyActivity(id, sn);
    }

    public void updateActivityById(Activity activity) {
        activityDao.updateActivityById(activity);
    }

    public Activity findById(Long id) {
        return activityDao.findById(id);
    }

    public BinaryPair<List<Activity>, Long> findByAll() {
        return activityDao.findByAll();
    }

    public BinaryPair<List<Activity>, Long> selectActivity(Activity activity, int offset, int pageSize) {
        return activityDao.selectActivity(activity, offset, pageSize);
    }

    public BinaryPair<List<Activity>, Long> selectActivity(String title, int offset, int pageSize) {
        return activityDao.selectActivity(title, offset, pageSize);
    }

    public List<Activity> newestActivity() {
        return activityDao.newestActivity();
    }

    public List<Activity> pastActivity() {
        return activityDao.pastActivity();
    }

//    最新和最热
    public List<Activity> TimeSearch() {
        return activityDao.TimeSearch();
    }

    public List<Activity> FeeSearch() {
        return activityDao.FeeSearch();
    }

//    直播活动首页123
    public BinaryPair<List<Activity>, Long> selectFutureLive() {
        return activityDao.selectFutureLive();
    }

    public BinaryPair<List<Activity>, Long> selectLiving() {
        return activityDao.selectLiving();
    }

    public BinaryPair<List<Activity>, Long> selectPastLive() {
        return activityDao.selectPastLive();
    }

//    通过id查询直播活动
    public Activity selectLiveById(Long id) {
        return activityDao.selectLiveById(id);
    }

    /*  self+往期活动*/
    public BinaryPair<List<Activity>, Long> selectPastSelf(Activity activity, int offset, int pageSize) {
        return activityDao.selectPastSelf(activity, offset, pageSize);
    }

    public BinaryPair<List<Activity>, Long> getActivityList(Activity activity, Boolean joinning, Boolean over, int offset, int pageSize) {
        return activityDao.getActivityList(activity, joinning, over, offset, pageSize);
    }
    
}
