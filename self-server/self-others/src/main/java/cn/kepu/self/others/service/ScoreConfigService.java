package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.ScoreConfigDao;
import cn.kepu.self.others.entity.ScoreConfig;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum ScoreConfigService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private ScoreConfigService() {
    }

    public static ScoreConfigService getInstance() {
        return INSTANCE;
    }

    private ScoreConfigDao scoreConfigDao;

    public void setScoreConfigDao(ScoreConfigDao scoreConfigDao) {
        this.scoreConfigDao = scoreConfigDao;
    }

    public void updateScoreConfig(ScoreConfig scoreConfig) {
        scoreConfigDao.updateScoreConfig(scoreConfig);
    }

    public List<ScoreConfig> selectPublicity() {
        return scoreConfigDao.selectScoreConfig();
    }
}
