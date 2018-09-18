package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.ActivityInfoDao;
import cn.kepu.self.activity.entity.ActivityInfo;
import cn.kepu.self.activity.mybatis.mapper.ActivityInfoMapper;

/**
 *
 * @author 李成志
 */
public class ActivityInfoDaoImpl implements ActivityInfoDao {

    private ActivityInfoMapper activityInfoMapper;

    public void setActivityInfoMapper(ActivityInfoMapper activityInfoMapper) {
        this.activityInfoMapper = activityInfoMapper;
    }

    @Override
    public void updateRollNum(Long id, Long num) {
        activityInfoMapper.updateRollNum(id, num);
    }

    @Override
    public ActivityInfo getActivityInfo(Long id) {
        return activityInfoMapper.selectById(id);
    }
}
